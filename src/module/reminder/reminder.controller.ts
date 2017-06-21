import * as Hapi from 'hapi';
import * as moment from 'moment';
import * as promise from 'bluebird';
import { getPaymentAmount } from '../../helper/integration/paymentCalculator';
import { setSMSBefore, setSMSAfter } from '../../helper/integration/sendSMS/';
import { queryBeforeDueDate, queryAfterDueDate, checkDueDate } from '../../helper/integration/queryData';
import { FormatRupiah } from '../../helper/util/formatRupiah';

const DATE_FORMAT = 'YYYY/MM/DD';

export default class ReminderController {

  public sendSMSReminder(request: Hapi.Request, reply: Hapi.IReply) {
    var asOfDate: any;
    if (request.query.asofdate) {
      asOfDate = moment(request.query.asofdate).format(DATE_FORMAT);
    } else {
      asOfDate = moment().format(DATE_FORMAT);
    }
    promise.join( queryBeforeDueDate(asOfDate), queryAfterDueDate(asOfDate),
      function( beforeDueDateResults, afterDueDateResults ) {
        var results = {};
        beforeDueDateResults.map( (res) => {
          results[res.loanId] = true;
          var dueDateParam = moment(res.dueDate).format('YYYY-MM-DD');
          getPaymentAmount(res.loanId, dueDateParam).then( (response) => {
            res.total_due = FormatRupiah(response.data.total_amount);
            return res;
          }).then( (res) => {
            setSMSBefore(res, asOfDate);
          }).catch( (err) => {
            console.log(err);
          });
        });
        afterDueDateResults.map( (res) => {
          var asOfDateParam = moment(request.query.asofdate).format('YYYY-MM-DD');
          if (!results[res.loanId]) {
            getPaymentAmount(res.loanId, asOfDateParam).then( (response) => {
              res.total_due = FormatRupiah(response.data.total_amount);
              return res;
            }).then( (res) => {
              setSMSAfter(res, asOfDate);
            }).catch( (err) => {
              console.log(err);
            });
          }
        });
      });
    reply({statusCode: 200, message: 'reminder sebelum jatuh tempo berhasil di blast sms.'});
  }
}

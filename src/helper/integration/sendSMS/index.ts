import axios from 'axios';
import { ISmsObjectData } from '../../../module/reminder/interface';
const __BASE_SMS_API__ = process.env.BASE_SMS_API;
import * as moment from 'moment';
import { FormatRupiah } from '../../util/formatRupiah';

export function setSMSBefore (res: any, asOfDate: any) {
  var dueDate = moment(res.dueDate).format('DD-MMM-YYYY');
  var phone = res.nomorHandphone.replace(/^0+/, '+62').replace(/\-/g, '');
  var responseDataObject = {
    sender: 'TARALITE',
    type: 'Reminder Before Due',
    message: 'Bpk/Ibu ' + res.namaLengkap +
    '\nTagihan Anda Rp ' + FormatRupiah(res.total_due) +
    ' kontrak no ' + res.nomorKontrak +
    ', jatuh tempo pada ' + dueDate +
    '\nAbaikan jika telah melakukan pembayaran.',
    nomorHandphone: phone
  };
  return sendSMS(responseDataObject);
}

export function setSMSAfter (res: any, asOfDate: any) {
  var dueDate = moment(res.dueDate).format('DD-MMM-YYYY');
  var phone = res.nomorHandphone.replace(/^0+/, '+62').replace(/\-/g, '');
  var responseDataObject = {
    sender: 'TARALITE',
    type: 'Reminder After Due',
    message: 'Bpk/Ibu ' + res.namaLengkap +
    '\nTagihan Anda Rp ' + FormatRupiah(res.total_due) +
    ' kontrak no ' + res.nomorKontrak +
    ', lewat jatuh tempo pada ' + dueDate +
    '\nAbaikan jika telah melakukan pembayaran.',
    nomorHandphone: phone
  };
  return sendSMS(responseDataObject);
}

function sendSMS(data: ISmsObjectData) {
  const config = {
    method: 'POST',
    url: `${__BASE_SMS_API__}/message`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      sender: data.sender,
      recipient: data.nomorHandphone,
      content: data.message,
    }
  };
  axios(config).then((response) => {
    console.log(response.data);
    return response.data;
  }).catch((err) => {
    console.log(err);
    return err;
  });
}

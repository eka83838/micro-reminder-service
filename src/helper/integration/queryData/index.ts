import Model from '../../../module/database';
import * as moment from 'moment';

export function checkDueDate(date: any) {
  var dateFormat = moment(date);
  var dueDate = dateFormat.day() === 1 ? dateFormat.format('YYYY-MM-DD')
  : dateFormat.add(1, 'weeks').day(1).format('YYYY-MM-DD');
  return dueDate;
}

export function queryBeforeDueDate(asOfDate: any) {
  var queryString = `SELECT t1."loanId", t1."dueDate", t2."paymentCycle", t2."nomorKontrak", t2."borrowerId",
                    t3."nomorHandphone", t3."email", t3."namaLengkap" FROM "loanInvoice" t1
                    INNER JOIN "loan" t2 ON t1."loanId" = t2."id"
                    INNER JOIN "borrower" t3 ON t2."borrowerId" = t3."id"
                    WHERE t1."status" != 'paid' AND (
                          ( t2."paymentCycle" = 'weekly'
                            AND ( t1."dueDate" = DATE '${asOfDate}' + INTERVAL '2 DAYS'OR
                                t1."dueDate" = DATE '${asOfDate}' )
                          ) OR
                          ( t2."paymentCycle" = 'biWeekly'
                            AND ( t1."dueDate" = DATE '${asOfDate}' + INTERVAL '4 DAYS' OR
                                t1."dueDate" = DATE '${asOfDate}' )
                          ) OR ( t2."paymentCycle" IN ( 'monthly', 'monthlyV2' )
                            AND ( t1."dueDate" = DATE '${asOfDate}' + INTERVAL '6 DAYS' OR
                                t1."dueDate" = DATE '${asOfDate}' + INTERVAL '3 DAYS' OR
                                t1."dueDate" = DATE '${asOfDate}' )
                          ) ) ORDER BY t2."paymentCycle"`.replace(/\s{2,}/g, ' ');
  return injectDatabase(queryString);
}

export function queryAfterDueDate(asOfDate: any) {
  var queryString = `SELECT "loanId", "dueDate", "paymentCycle", "nomorKontrak", "borrowerId", "nomorHandphone",
                    "namaLengkap", "email" FROM "loan"
                    JOIN ( select "loanId", min("dueDate") AS "dueDate" FROM "loanInvoice"
                          WHERE "loanInvoice"."status" != 'paid' GROUP BY "loanId" ) "unpaidLoanInvoice"
                    ON ( "loan"."id" = "unpaidLoanInvoice"."loanId" )
                    JOIN "borrower" ON ( "borrower"."id" = "loan"."borrowerId" )
                    WHERE "dueDate" < DATE '${asOfDate}' AND "loan"."paymentCycle" != 'uberWeekly'
                    ORDER BY "paymentCycle"`.replace(/\s{2,}/g, ' ');

  return injectDatabase(queryString);
}

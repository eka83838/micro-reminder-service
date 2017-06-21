import axios from 'axios';
const __BASE_PAYMENT_API__ = process.env.BASE_PAYMENT_API;
const __PAYMENT_API_KEY = process.env.PAYMENT_API_KEY;

export function getPaymentAmount (loanId: number, dueDate: string) {
  return axios.get(`${__BASE_PAYMENT_API__}?id=${loanId}&date=${dueDate}`, {
    headers: {
      'Accept': 'application/json',
      'apiKey': __PAYMENT_API_KEY
    }
  });
}

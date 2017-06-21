export function FormatRupiah (num) {
  if (num !== 'undefined' && num) {
    var str = num.toString();
    var output = [];
    var i = 1;
    var formatted = null;
    str = str.split('').reverse();
    for (var j = 0, len = str.length; j < len; j++) {
      if (str[j] !== '.') {
        output.push(str[j]);
        if (i % 3 === 0 && j < (len - 1)) {
          output.push('.');
        }
        i++;
      }
    }
    formatted = output.reverse().join('');
    return formatted;
  }
}

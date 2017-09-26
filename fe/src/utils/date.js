
Date.prototype.format = function() {
  let s = '';
  const mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
  const day = this.getDate()>=10?this.getDate():('0'+this.getDate());
  s += this.getFullYear() + '-'; // 获取年份。
  s += mouth + "-"; // 获取月份。
  s += day; // 获取日。
  return (s); // 返回日期。
};

/**
 * 获取两个日期（格式：yyyy-MM-dd）内所有的日期
 * @param begin
 * @param end
 */
const getAllByDateStr = (begin, end) => {
  const ab = begin.split("-");
  const ae = end.split("-");
  let db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  let de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  const unixDb = db.getTime();
  const unixDe = de.getTime();
  const result = [];
  for (let k = unixDb; k <= unixDe;) {
    result.push((new Date(parseInt(k))).format());
    k = k + 24 * 60 * 60 * 1000;
  }
  return result;
};

/**
 * 根据传入的时间毫秒数获取两个时间内所有的天数
 * @param begin
 * @param end
 */
const getAllByMilliSecones = (begin, end) => {
  const beginStr = (new Date(parseInt(begin))).format();
  const endStr = (new Date(parseInt(end))).format();
  const ab = beginStr.split("-");
  const ae = endStr.split("-");
  let db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  let de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  const unixDb = db.getTime();
  const unixDe = de.getTime();
  const result = [];
  for (let k = unixDb; k <= unixDe;) {
    result.push((new Date(parseInt(k))).format());
    k = k + 24 * 60 * 60 * 1000;
  }
  return result;
};

module.exports = {
  getAllByDateStr,
  getAllByMilliSecones,
};

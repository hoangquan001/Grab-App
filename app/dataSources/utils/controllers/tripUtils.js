function matchDate(dateFromTo) {
  const { from, to } = dateFromTo;
  const fromDate = new Date(from);
  const mDate = { $gte: fromDate };
  if (to) {
    const toDate = new Date(to);
    toDate.setDate(toDate.getDate() + 1);
    mDate.$lt = toDate;
  }
  return mDate;
}
module.exports = { matchDate };

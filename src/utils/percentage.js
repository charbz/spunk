const CalculatePercentage = (changeValue, baseValue) => {
  let diff = changeValue - baseValue;
  let change = (diff / changeValue) * 100;
  return Math.abs(change);
}

module.exports = CalculatePercentage;

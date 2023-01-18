const containsUpperCase = (string) => {
  const pattern = new RegExp("^(?=.*[A-Z])");
  return pattern.test(string);
};

module.exports = {
  containsUpperCase,
};

function calculateNetworth(num) {
  // Check if the number is greater than or equal to 1 billion
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(3) + " B"; // Return the number divided by 1 billion, rounded to 3 decimal places, and with the letter "B" added
  }
  // Check if the number is greater than or equal to 1 million
  else if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + " M"; // Return the number divided by 1 million, rounded to 3 decimal places, and with the letter "M" added
  }
  // Check if the number is greater than or equal to 1 thousand
  else if (num >= 1000) {
    return (num / 1000).toFixed(0) + " K"; // Return the number divided by 1 thousand, rounded to 3 decimal places, and with the letter "K" added
  }
  // Otherwise, return the original number
  else {
    return num.toString();
  }
}
module.exports = { calculateNetworth };

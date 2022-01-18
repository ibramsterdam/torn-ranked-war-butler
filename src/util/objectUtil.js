/**
 * @description Checks if the value given is an object
 * @returns true if the value is an object
 */
const isObject = (value) => {
  if (value == null) {
    return false;
  }
  return typeof value === 'object';
};

/**
 * @description Recieves JSON object and destructures it
 * @param {Object} object
 */
const objProps = (object) => {
  for (let value in object) {
    if (isObject(object[value])) {
      console.log('Key = ' + value);
      objProps(object[value]);
    } else {
      console.log(value, object[value]);
    }
  }
};

module.exports = {
  isObject,
  objProps,
};

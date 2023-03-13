// program to get a random item from an array

export function getRandomItemFromArray(arr: any): any {
  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  const item = arr[randomIndex];

  return item;
}

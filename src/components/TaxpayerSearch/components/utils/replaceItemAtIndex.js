/**
 * Replaces an item in an array at the specified index.
 *
 * @template T
 * @param {Array<T>} array - The original array.
 * @param {T} item - The item to replace.
 * @param {number} index - The index where the replacement should occur.
 * @returns {Array<T>} A new array with the item replaced at the specified index.
 */
const replaceItemAtIndex = (array, item, index) => {
  return [...array.slice(0, index), item, ...array.slice(index + 1)];
};

export default replaceItemAtIndex;
/**
 * sleep (delay tool)
 * @param {number} ms
 * @return {Promise<void>}
 */
export function sleep(ms = 1000)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

// /**
//  * debounce
//  * @param {function} func
//  * @param {number} delay
//  * @return {function}
//  */
// export function debounce(func, delay)
// {
//   let inDebounce;
//   return function() {
//     const context = this;
//     const args = arguments;
//     clearTimeout(inDebounce);
//     inDebounce = setTimeout(() => func.apply(context, arguments), delay);
//   };
// }

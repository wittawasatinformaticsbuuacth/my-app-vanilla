export function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };

  // add event listener to the element to increment the counter when clicked
  element.addEventListener("click", () => setCounter(counter + 1));

  // initialize the counter
  setCounter(0);
}

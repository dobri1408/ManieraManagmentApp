export const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const getPrescurtare = (string) => {
  const firstLetters = string
    .split(" ")
    .map((word) => word.substring(0, 3))
    .join("");

  return firstLetters;
};
export function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

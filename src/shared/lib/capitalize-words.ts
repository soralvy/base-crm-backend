export const capitalizeWords = (name?: string) => {
  if (!name) {
    return '';
  }

  const words = name.toLowerCase().match(/[A-Za-z][a-z]*/g) || [];
  return words.map(capitalizeFirstLetter).join(' ');
};

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

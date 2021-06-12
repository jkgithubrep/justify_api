export interface IJustifyPayload {
  text: string;
  token: string;
}

export const justify = (text: string, maxWidth: number): string => {
  if (!text) return text;
  const words = text.trim().split(/\s+/);
  const totalNbOfWords = words.length;

  const resultLines: string[] = [];

  let i = 0;
  while (i < totalNbOfWords) {
    let lineLength = words[i].length;
    let j = i + 1;
    while (
      j < totalNbOfWords &&
      lineLength + words[j].length + (j - i - 1) < maxWidth
    ) {
      lineLength += words[j].length;
      j++;
    }

    const spacesRemaining = maxWidth - lineLength;
    if (spacesRemaining < 0)
      throw new Error(
        `The word ${words[i]} has more than ${maxWidth} characters.`
      );
    const nbOfWordsInLine = j - i;
    if (nbOfWordsInLine == 1 || j >= totalNbOfWords)
      resultLines.push(leftJustify(words, spacesRemaining, i, j));
    else resultLines.push(middleJustify(words, spacesRemaining, i, j));
    i = j;
  }

  function leftJustify(
    words: string[],
    spacesRemaining: number,
    start: number,
    end: number
  ): string {
    let line = words[start];
    for (let i = start + 1; i < end; i++) {
      line += ` ${words[i]}`;
    }
    return `${line}${"".repeat(spacesRemaining)}`;
  }

  function middleJustify(
    words: string[],
    spacesRemaining: number,
    start: number,
    end: number
  ): string {
    let line = words[start];
    const spacesNeededInLine = end - start - 1;
    const spacesBetweenWords = Math.floor(spacesRemaining / spacesNeededInLine);
    let extraSpaces = spacesRemaining % spacesNeededInLine;
    for (let i = start + 1; i < end; i++) {
      const spacesToAdd = spacesBetweenWords + (extraSpaces-- > 0 ? 1 : 0);
      line += `${" ".repeat(spacesToAdd)}${words[i]}`;
    }
    return line;
  }

  return resultLines.join("\n");
};

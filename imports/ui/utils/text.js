export function splitStringIntoFlexibleSentences(text, minLength, maxLength) {
  // Split the text into sentences
  const sentences = text.split(" ").map((word) => word + " ");
  let currentSplit = "";
  let splitText = [];

  for (let i = 0; i < sentences.length; i++) {
    if (sentences[i].length > maxLength) {
      // If a sentence is longer than maxLength, then we need to split it
      const longSentence = sentences[i];
      let start = 0;
      while (start < longSentence.length) {
        let end = Math.min(start + maxLength, longSentence.length);
        splitText.push(longSentence.slice(start, end));
        start = end;
      }
    } else {
      let nextLength = currentSplit.length + sentences[i].length;
      if (nextLength > maxLength) {
        // If adding the sentence would make the currentSplit longer than maxLength,
        // then we need to push currentSplit to the array and start a new currentSplit
        splitText.push(currentSplit);
        currentSplit = sentences[i];
      } else {
        currentSplit += sentences[i];
      }
    }
  }

  // Add the last piece if it wasn't already added
  if (currentSplit) {
    splitText.push(currentSplit);
  }

  // Return the splits
  return splitText;
}

export function cleanJsonString(jsonString) {
  // if it parses, we do not do anything
  try {
    JSON.parse(jsonString);
    return jsonString;
  } catch (e) {
    // Guess we need to clean up
  }

  const cleaned = jsonString
    .replace(/ \/\/ .*$/gm, "") // Remove comments
    .split("\n") // Split into pairs
    .map((pair) => {
      pair = pair.trim();
      if (pair.endsWith(",")) {
        pair = pair.slice(0, -1);
      }

      const colonIdx = pair.indexOf(":");
      let k = pair.slice(0, colonIdx).trim();
      let v = pair.slice(colonIdx + 1).trim();

      if (!k || !v) {
        return undefined;
      }

      k = !k.startsWith('"') ? `"${k}` : k;
      v = !v.match(/^[["]/) ? `"${v}` : v;
      k = !k.endsWith('"') ? `${k}"` : k;
      v = !v.match(/["\]]$/) ? `${v}"` : v;

      return `${k}: ${v}`;
    })
    .filter(Boolean)
    .join(",");

  return cleaned;
}

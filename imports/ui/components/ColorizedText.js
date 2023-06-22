import React, { useState } from "react";
import reactStringReplace from "react-string-replace";

const ColorizedText = ({ text, phrases, setSelectedPhrase, color }) => {
  console.log("render");
  const phraseDictionary = new Map(phrases);

  const handleClick = (phrase) => {
    setSelectedPhrase(`${phrase}: ${phraseDictionary.get(phrase)}`);
  };

  let processedText = text;

  for (let [phrase, explanation] of phraseDictionary.entries()) {
    processedText = reactStringReplace(processedText, phrase, (match, i) => (
      <span
        key={i}
        style={{ color: "blue" }}
        onClick={() => handleClick(phrase)}
        title={explanation}
      >
        {match}
      </span>
    ));
  }

  return (
    <div style={{ marginBottom: "5px" }}>
      <font color={color}>
        <div>{processedText}</div>
      </font>
    </div>
  );
};

export default ColorizedText;

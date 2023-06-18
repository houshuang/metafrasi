import React, { useState } from "react";
import reactStringReplace from "react-string-replace";

const ColorizedText = ({ text, phrases }) => {
  const [selectedPhrase, setSelectedPhrase] = useState(null);
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
    <div>
      <p>{selectedPhrase || "..."}</p>
      {processedText}
      {/* {selectedPhrase && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedPhrase(null)}>
              &times;
            </span>
            <p>{selectedPhrase}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ColorizedText;

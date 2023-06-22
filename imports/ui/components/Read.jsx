import React, { useState, useRef, memo } from "react";
import { Page, Input, Button } from "react-onsenui";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Documents } from "/imports/api/documents";
import { useCodeMirror } from "@uiw/react-codemirror";
import { useNavigate } from "react-router-dom";
import { EditorView } from "codemirror";
import { useSwipeable } from "react-swipeable";
import ColorizedText from "./ColorizedText";

const RenderText = ({ text, phrases }) => {};

export default function Read() {
  const { documentId } = useParams();
  const [selectedPhrase, setSelectedPhrase] = useState(undefined);

  const navigate = useNavigate();
  const [view, setView] = React.useState();

  const { document, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe("documents");

    return {
      document: Documents.findOne(documentId),
      isLoading: !handler.ready(),
    };
  }, [documentId]);

  function setProgress(value) {
    setView(undefined);
    Meteor.call("documents.setProgress", documentId, value);
  }

  const paragraphs = !isLoading && document.content.split("---%---");
  const maxProgress = !isLoading && paragraphs.length - 1;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const ColorizedMemo = memo(ColorizedText);
  const current = document.gpt?.[document.progress || 0];
  return (
    <div>
      <Page style={{ margin: "5px" }}>
        <Button onClick={() => navigate(`/document/${documentId}`)}>
          Back
        </Button>
        <Button
          onClick={() => {
            setSelectedPhrase(undefined);
            setProgress(document.progress - 1);
          }}
          disabled={!document.progress || document.progress < 1}
        >
          {`<`}
        </Button>
        <Button
          disabled={(document.progress || 0) > maxProgress - 1}
          onClick={() => {
            setSelectedPhrase(undefined);
            setProgress(document.progress ? document.progress + 1 : 1);
          }}
        >
          {`>`}
        </Button>
        <Button onClick={() => setView("english")}>English</Button>
        <Button onClick={() => setView("simple")}>Simple</Button>
        <Button onClick={() => setView(undefined)}>Original</Button>
        <Button onClick={() => setView("all")}>All</Button>
        {document.progress + 1 || 1} / {maxProgress + 1}
        {current?.sentences ? (
          <div>
            <p>{selectedPhrase || "..."}</p>

            {view === "english" && (
              <p>{current.sentences.map((n) => n[2]).join(" ")}</p>
            )}
            {view === "simple" && (
              <ColorizedMemo
                key={document.progress || 0}
                text={current.sentences.map((n) => n[1]).join(" ")}
                phrases={current.phrases}
                setSelectedPhrase={setSelectedPhrase}
              />
            )}
            {!view && (
              <ColorizedMemo
                key={document.progress || 0}
                text={current.sentences.map((n) => n[0]).join(" ")}
                phrases={current.phrases}
                setSelectedPhrase={setSelectedPhrase}
              />
            )}
            {view === "all" &&
              current.sentences.map((_, i) => {
                return (
                  <div style={{ marginBottom: "15px" }}>
                    <ColorizedMemo
                      key={"original" + i}
                      text={current.sentences[i][0]}
                      phrases={current.phrases}
                      setSelectedPhrase={setSelectedPhrase}
                    />
                    <ColorizedMemo
                      color="green"
                      key={"simple" + i}
                      text={current.sentences[i][1]}
                      phrases={current.phrases}
                      setSelectedPhrase={setSelectedPhrase}
                    />
                    <font color="grey">{current.sentences[i][2]}</font>
                  </div>
                );
              })}
          </div>
        ) : (
          <p>No data</p>
        )}
      </Page>
    </div>
  );
}

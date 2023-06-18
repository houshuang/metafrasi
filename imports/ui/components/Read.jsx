import React, { useState, useRef } from "react";
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

  const handlers = useSwipeable({
    onTouchStartOrOnMouseDown: (event) => {
      event.preventDefault();
    },
    onSwipedLeft: () => {
      if (document.progress && document.progress < maxProgress) {
        setProgress(document.progress + 1);
      }
    },
    onSwipedRight: () => {
      if (document.progress && document.progress > 2) {
        setProgress(document.progress - 1);
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div {...handlers} style={{ touchAction: "pan-y" }}>
      <Page>
        <Button onClick={() => navigate(`/document/${documentId}`)}>
          Back
        </Button>
        <Button
          onClick={() => setProgress(document.progress - 1)}
          disabled={!document.progress || document.progress < 2}
        >
          {`<`}
        </Button>

        <Button
          disabled={(document.progress || 0) > maxProgress}
          onClick={() =>
            setProgress(document.progress ? document.progress + 1 : 1)
          }
        >
          {`>`}
        </Button>
        <Button onClick={() => setView("english")}>English</Button>
        <Button onClick={() => setView("simple")}>Simple</Button>
        <Button onClick={() => setView(undefined)}>Original</Button>
        <Button onClick={() => setView("all")}>All</Button>

        {(view === "english" || view === "all") && (
          <p>{document.gpt?.[document.progress || 0]?.english}</p>
        )}
        {(view === "simple" || view === "all") && (
          <ColorizedText
            text={document.gpt?.[document.progress || 0]?.simplified}
            phrases={document.phrases}
          />
        )}
        {(!view || view === "all") && (
          <ColorizedText
            text={paragraphs[document.progress || 0]}
            phrases={document.gpt[document.progress || 0].difficultPhrases}
          />
        )}
      </Page>
    </div>
  );
}

import React, { useState, useRef } from "react";
import { Page, Input, Button } from "react-onsenui";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Documents } from "/imports/api/documents";
import { useCodeMirror } from "@uiw/react-codemirror";
import { useNavigate } from "react-router-dom";
import { EditorView } from "codemirror";
import { useSwipeable } from "react-swipeable";

export default function Read() {
  const { documentId } = useParams();

  const navigate = useNavigate();

  const { document, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe("documents");

    return {
      document: Documents.findOne(documentId),
      isLoading: !handler.ready(),
    };
  }, [documentId]);

  function setProgress(value) {
    Meteor.call("documents.setProgress", documentId, value);
  }

  const paragraphs = !isLoading && document.content.split("---%---");
  const maxProgress = !isLoading && paragraphs.length - 1;

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (document.progress && document.progress > 2) {
        setProgress(document.progress - 1);
      }
    },
    onSwipedRight: () => {
      if (document.progress && document.progress < maxProgress) {
        setProgress(document.progress + 1);
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
          Previous
        </Button>

        <Button
          disabled={(document.progress || 0) > maxProgress}
          onClick={() =>
            setProgress(document.progress ? document.progress + 1 : 1)
          }
        >
          Next
        </Button>

        <p>{paragraphs[document.progress || 0]}</p>
      </Page>
    </div>
  );
}

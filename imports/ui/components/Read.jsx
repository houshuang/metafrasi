import React, { useState, useRef } from "react";
import { Page, Input, Button } from "react-onsenui";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Documents } from "/imports/api/documents";
import { useCodeMirror } from "@uiw/react-codemirror";
import { useNavigate } from "react-router-dom";
import { EditorView } from "codemirror";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const paragraphs = document.content.split("---%---");
  const maxProgress = paragraphs.length - 1;

  return (
    <Page>
      <Button onClick={() => navigate(`/document/${documentId}`)}>Back</Button>
      {document.progress && document.progress > 1 && (
        <Button onClick={() => setProgress(document.progress - 1)}>
          Previous
        </Button>
      )}
      {(document.progress || 0) < maxProgress && (
        <Button
          onClick={() =>
            setProgress(document.progress ? document.progress + 1 : 1)
          }
        >
          Next
        </Button>
      )}
      <p>{paragraphs[document.progress || 0]}</p>
    </Page>
  );
}

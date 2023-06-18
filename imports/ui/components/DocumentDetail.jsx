import React, { useState, useRef } from "react";
import { Page, Input, Button } from "react-onsenui";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Documents } from "/imports/api/documents";
import { useCodeMirror } from "@uiw/react-codemirror";
import { useNavigate } from "react-router-dom";
import { EditorView } from "codemirror";

function splitIntoParagraphs(text, MIN_SIZE) {
  // split the text into lines
  let lines = text.split("\n");
  let paragraphs = [];
  let paragraph = "";

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().length === 0) {
      continue;
    }
    paragraph += lines[i].trim() + "\n";
    if (paragraph.length > MIN_SIZE) {
      paragraphs.push(paragraph.trim());
      paragraph = "";
    }
  }

  // add the last paragraph if it's not empty
  if (paragraph !== "") {
    paragraphs.push(paragraph);
  }

  return paragraphs;
}

const MIN_SIZE = 300;

export default function DocumentDetail() {
  const { documentId } = useParams();

  const navigate = useNavigate();

  const { document, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe("documents");

    return {
      document: Documents.findOne(documentId),
      isLoading: !handler.ready(),
    };
  }, [documentId]);

  function saveDocument(value) {
    Meteor.call("documents.setContents", documentId, value);
  }

  function changeTitle(value) {
    Meteor.call("documents.setTitle", documentId, value);
  }

  const editor = useRef();
  const { setContainer, state } = useCodeMirror({
    container: editor.current,
    value: document?.content,
    onChange: saveDocument,
    extensions: [EditorView.lineWrapping],
  });

  React.useEffect(() => {
    if (editor.current && !isLoading) {
      setContainer(editor.current);
    }
  }, [editor.current, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const process = () => {
    let text = document.content;
    const title = text.match(/\<page [^\>]+title="(.+?)"/);
    if (title) {
      changeTitle(title[1]);
    }
    const newText = text.match(/\<extract.+?>(.+?)\<\/extract\>/);
    if (newText) {
      text = newText[1];
    }
    const paragraphs = splitIntoParagraphs(
      text.replaceAll("---%---", ""),
      MIN_SIZE
    );
    saveDocument(paragraphs.join("\n---%---\n"));
  };

  return (
    <Page>
      <Button onClick={() => navigate("/")}>Back</Button>
      <Button onClick={process}>Process</Button>
      <Button onClick={() => navigate(`/read/${documentId}`)}>Read</Button>
      <Input
        value={document?.title || ""}
        onInput={(e) => changeTitle(e.target.value)}
      />
      <div ref={editor} />
    </Page>
  );
}

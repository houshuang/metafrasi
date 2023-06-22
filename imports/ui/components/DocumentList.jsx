import React, { useEffect, useState } from "react";
import { List, ListItem, Button } from "react-onsenui";
import { Meteor } from "meteor/meteor";
import { Documents } from "/imports/api/documents";
import { useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

export default function DocumentList() {
  const navigate = useNavigate();
  const { documents, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe("documents");

    return {
      documents: Documents.find().fetch(),
      isLoading: !handler.ready(),
    };
  }, []);

  function addDocument() {
    Meteor.call("documents.insert", (error, documentId) => {
      if (documentId) {
        navigate(`/document/${documentId}`);
      }
    });
  }

  function deleteDocument(documentId) {
    Meteor.call("documents.remove", documentId);
  }

  return (
    <div>
      <Button onClick={addDocument}>Add New</Button>
      <List
        dataSource={documents}
        renderRow={(document) => (
          <ListItem
            key={document._id}
            onClick={() =>
              document?.gpt
                ? navigate(`/read/${document._id}`)
                : navigate(`/document/${document._id}`)
            }
          >
            {document.title}
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteDocument(document._id);
              }}
            >
              Delete
            </Button>
          </ListItem>
        )}
      />
    </div>
  );
}

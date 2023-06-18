import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Documents = new Mongo.Collection("documents");

if (Meteor.isServer) {
  Meteor.publish("documents", function documentsPublication() {
    return Documents.find();
  });
}

Meteor.methods({
  "documents.insert"() {
    return Documents.insert({
      createdAt: new Date(),
    });
  },
  "documents.remove"(documentId) {
    check(documentId, String);
    Documents.remove(documentId);
  },
  "documents.setTitle"(documentId, content) {
    check(documentId, String);
    check(content, String);

    Documents.update(documentId, { $set: { title: content } });
  },
  "documents.setContents"(documentId, content) {
    check(documentId, String);
    check(content, String);

    Documents.update(documentId, { $set: { content: content } });
  },
  "documents.setProgress"(documentId, content) {
    check(documentId, String);
    check(content, Number);

    Documents.update(documentId, { $set: { progress: content } });
  },
  "documents.setGPT"(documentId, content) {
    check(documentId, String);

    Documents.update(documentId, { $set: { gpt: content } });
  },
});

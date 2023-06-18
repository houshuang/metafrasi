import { Meteor } from "meteor/meteor";
import { DocCollection } from "/imports/api/links";

Meteor.startup(async () => {});

// We publish the entire Links collection to all clients.
// In order to be fetched in real-time to the clients
Meteor.publish("docs", function () {
  return DocCollection.find();
});

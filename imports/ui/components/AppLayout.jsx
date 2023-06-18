import React from "react";
import { Page } from "react-onsenui";

import DocumentList from "./DocumentList.jsx";

export default class AppLayout extends React.Component {
  render() {
    return (
      <Page>
        <DocumentList />
      </Page>
    );
  }
}

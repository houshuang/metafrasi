import React from "react";
import { Hello } from "./Hello.jsx";
import { Info } from "./Info.jsx";
import { Page, Button } from "react-onsenui";
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

export const App = () => (
  <Page>
    Hello
    <Button> Click Me!!</Button>
  </Page>
);

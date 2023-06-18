import "onsenui/css/onsen-css-components.css";
import "onsenui/css/onsenui.css";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import DocumentDetail from "./components/DocumentDetail";
import DocumentList from "./components/DocumentList";
import Read from "./components/Read";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DocumentList />,
  },
  {
    path: "document/:documentId",
    element: <DocumentDetail />,
  },
  {
    path: "read/:documentId",
    element: <Read />,
  },
]);

export const App = () => <RouterProvider router={router} />;

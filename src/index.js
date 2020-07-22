import React from "react";
import { render } from "react-dom";

import "./assets/style.css"; //master reset
import Editor from "./Editor";

const App = () => (
  <Editor />
);

render(<App />, document.getElementById("root"));

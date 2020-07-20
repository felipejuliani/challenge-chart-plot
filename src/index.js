import React from "react";
import { render } from "react-dom";

import Editor from "./Editor";

const App = () => (
  <Editor />
);

render(<App />, document.getElementById("root"));

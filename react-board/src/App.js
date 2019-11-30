import React from "react";
import logo from "./logo.svg";
import "./App.css";
import CreateBoard from "./components/CreateBoard";
import Board from "./components/Board";
import BoardList from "./components/BoardList";
import Detail from "./components/Detail";

import TopPage from "./screens/TopPage";
import Test from "./screens/test";

function App() {
  return (
    <div className="App">
      <TopPage />
    </div>
  );
}

export default App;

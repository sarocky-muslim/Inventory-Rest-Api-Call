import React from "react";
import "./bootstrap.min.css";
import "./App.css";
import Urls from "./Urls";
import { ToastProvider } from "react-toast-notifications";

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <Urls />
      </ToastProvider>
    </div>
  );
}

export default App;

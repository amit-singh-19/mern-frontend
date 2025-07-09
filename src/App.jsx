// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./components/Home";

function App() {
  // return <Home age={21} />;
  return (
    <div className="App-Container">
      <h1>MERN Frontend</h1>
      <Home />
      <h3>This is footer</h3>
    </div>
  );
}

export default App;

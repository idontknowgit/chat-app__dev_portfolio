import React from "react";
import { io } from "socket.io-client";

class App extends React.Component {
  constructor() {
    super();
    this.socket = io("/");
    this.socket.emit("dad");
  }
  render() {
    return <div>love you dad</div>;
  }
}

export default App;

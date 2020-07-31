import React from "react";
import Card from "./Cards/Card";
import "./App.css";

function App() {
  return (
    <div>
      <div className="main">
        <div className="Container">
          <div className="flex">
            <div>
              <Card />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

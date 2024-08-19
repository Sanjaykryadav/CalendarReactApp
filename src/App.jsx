import React from "react";
import "./App.css";
import Calendar from "./components/Calendar";
import 'rsuite/dist/rsuite.min.css'; 

function App() {
  return (
    <>
      <div className="bg-gray-100">
        <Calendar />
      </div>
    </>
  );
}

export default App;

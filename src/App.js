import React, { useReducer } from "react";
import "./App.css";
import Control from "./components/Control/Control";

const initialState = {
  
};

const reducer = (state, action) => {
  switch (action.type) {
    case "BTN_CLICKED":
    // return {...state, [action.id]:{...state[action.id], className: "red" }}>

    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="grid">
      <div className='green'></div>
      <div className='red'></div>
      <div className='yellow'></div>
      <div className='blue'></div>
      <Control />
      <div className="sp-vertical"></div>
      <div className="sp-horizontal"></div>
    </div>
  );
}

export default App;

import React, { useReducer, useRef } from "react";
import "./App.css";
import Control from "./components/Control/Control";
import sounds from "./sounds";

const initialState = {};

const reducer = (state, action) => {
  switch (action.type) {
    case "PLAY_SOUND":
      return { ...state, sound: action.sound };

    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audio = useRef();
  const playSound = sound => {
    dispatch({
      type: "PLAY_SOUND",
      sound
    });
    if (state.sound === sound) {
      audio.current.currentTime = 0;
      audio.current.play();
    }
  };
  return (
    <div className="grid">
      <div
        className="green"
        onClick={() => {
          playSound(sounds.sound01);
        }}
      ></div>
      <div
        className="red"
        onClick={() => {
          playSound(sounds.sound02);
        }}
      ></div>
      <div
        className="yellow"
        onClick={() => {
          playSound(sounds.sound03);
        }}
      ></div>
      <div
        className="blue"
        onClick={() => {
          playSound(sounds.sound04);
        }}
      ></div>
      <Control />
      <div className="sp-vertical"></div>
      <div className="sp-horizontal"></div>

      <audio src={state.sound} ref={audio} autoPlay></audio>
    </div>
  );
}

export default App;

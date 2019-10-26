import React, { useReducer, useRef } from "react";
import "./App.css";
// import Control from "./components/Control/Control";
import sounds from "./sounds";

const initialState = {
  playList: [sounds[Math.floor(Math.random() * 4)]],
  userPlayList: [],
  start: false,
  reset: false,
  isPlaying: false
};

const reducer = (state, action) => {
  console.log("dispatch =", action.type)
  switch (action.type) {
    case "PLAY_SOUND":
      return { ...state, sound: action.sound };
    case "ADD_PLAYLIST":
      return { ...state, playList: [...state.playList, action.sound] };
    case "ADD_USER_PLAYLIST":
      return { ...state, userPlayList: [...state.userPlayList, action.sound] };
    case "REST_SOUND_FILE":
      return { ...state, sound: action.sound };
    case "IS_PLAYING":
      return { ...state, isPlaying: true };
    case "IS_NOT_PLAYING":
      return { ...state, isPlaying: false };
    case "START":
      return { ...state, start: !state.start };
    case "RESET":
      return { ...initialState,  playList: [sounds[Math.floor(Math.random() * 4)]] };

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
    dispatch({ type: "IS_PLAYING" });
    if (state.sound === sound) {
      audio.current.currentTime = 0;
      audio.current.play();
    }
  };
  const addUserPlayList = sound => {
    dispatch({
      type: "ADD_USER_PLAYLIST",
      sound
    });
  };

  const playPlayList = () => {
    setTimeout(() => {
      state.playList.forEach((sound, i) => {
        setTimeout(() => {
        playSound(sound)
        }, 1000 * (i + 1));
      });
    }, 1000);
  };

  const addPlayList = sound => {
    dispatch({
      type: "ADD_PLAYLIST",
      sound: state[sound].sound
    });
  };
  
const checkList = () => {
  
}

  

  // console.log("state playlist =", state.playList);
  // console.log("sound =", state.sound);
  return (
    <div className="grid">
      <div
        className="green"
        style={sounds[0] === state.sound ? { background: "lime" } : {}}
        onClick={() => {
          playSound(sounds[0]);
          addUserPlayList(sounds[0]);
          checkList()
        }}
      ></div>
      <div
        className="red"
        style={sounds[1] === state.sound ? { background: "orange" } : {}}
        onClick={() => {
          playSound(sounds[1]);
          addUserPlayList(sounds[1]);
        }}
      ></div>
      <div
        className="yellow"
        style={sounds[2] === state.sound ? { background: "yellow" } : {}}
        onClick={() => {
          playSound(sounds[2]);
          addUserPlayList(sounds[2]);
        }}
      ></div>
      <div
        className="blue"
        style={sounds[3] === state.sound ? { background: "skyblue" } : {}}
        onClick={() => {
          playSound(sounds[3]);
          addUserPlayList(sounds[3]);
        }}
      ></div>

      <div className="control">
        <h1 className="title">Simon</h1>
        <div className="monitor">
          <span>Good</span>
        </div>
        <div className="btn-wrap">
          <div
            className="btn"
            style={!state.start ? { background: "red" } : {}}
            onClick={() => {
              if (!state.start) {
                dispatch({
                  type: "START"
                });
                playPlayList();
                // const sound = Math.floor(Math.random() * 4);
                // addPlayList(sound);
              } else {
                dispatch({ type: "RESET" });
              }
            }}
          >
            P
          </div>
          <div className="btn">S</div>
          <div className="btn"></div>
        </div>
      </div>

      <div className="sp-vertical"></div>
      <div className="sp-horizontal"></div>

      <audio src={state.sound} ref={audio} autoPlay onEnded={() => {
        // console.log('audio ended')
        dispatch({
          type: "REST_SOUND_FILE",
          sound:undefined
        })
        dispatch({
          type: "IS_NOT_PLAYING"
        })
      }
      } ></audio>
    </div>
  );
}

export default App;

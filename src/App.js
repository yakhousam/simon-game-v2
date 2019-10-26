import React, { useReducer, useRef} from "react";
import "./App.css";
// import Control from "./components/Control/Control";
import sounds from "./sounds";

const initialState = {
  0: {
    sound: sounds.sound01
  },
  1: {
    sound: sounds.sound02
  },
  2: {
    sound: sounds.sound03
  },
  3: {
    sound: sounds.sound04
  },
  playList: [sounds["sound0" + Math.floor(Math.random() * 4 + 1)]],
  userPlayList: [],
  start: false,
  reset: false,
  isPlaying: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "PLAY_SOUND":
      return { ...state, sound: action.sound };
    case "ADD_PLAYLIST":
      return { ...state, playList: [...state.playList, action.sound] };
    case "ADD_USER_PLAYLIST":
      return { ...state, userPlayList: [...state.userPlayList, action.sound] };
    case "SET_SOUND":
      return { ...state, sound: action.sound };
    case "IS_PLAYING":
      return { ...state, isPlaying: true };
    case "IS_NOT_PLAYING":
      return { ...state, isPlaying: false };
    case "START":
      return { ...state, start: !state.start };
    case "RESET":
      return { ...initialState };

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
  const addUserPlayList = sound => {
    dispatch({
      type: "ADD_USER_PLAYLIST",
      sound
    });
  };

  const playSequence = () => {
    setTimeout(() => {
      state.playList.forEach((sound, i) => {
        setTimeout(() => {
          dispatch({
            type: "PLAY_SOUND",
            sound
          });
          if (state.sound === sound) {
            audio.current.currentTime = 0;
          }
          audio.current.play();
        }, 1000 * (i + 1));
      });
    }, 1000);
  }

  const addPlayList = sound => {
    dispatch({
      type: "ADD_PLAYLIST",
      sound: state[sound].sound
    });
  };

  console.log("state playlist =", state.playList);
  console.log("sound =", state.sound);
  return (
    <div className="grid">
      <div
        className="green"
        onClick={() => {
          playSound(sounds.sound01);
          addUserPlayList(sounds.sound01);
        }}
      ></div>
      <div
        className="red"
        onClick={() => {
          playSound(sounds.sound02);
          addUserPlayList(sounds.sound02);
        }}
      ></div>
      <div
        className="yellow"
        onClick={() => {
          playSound(sounds.sound03);
          addUserPlayList(sounds.sound03);
        }}
      ></div>
      <div
        className="blue"
        onClick={() => {
          playSound(sounds.sound04);
          addUserPlayList(sounds.sound04);
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
            style={!state.start ? {background: 'red'}: {}}
            onClick={() => {
              if (!state.start) {
                dispatch({
                  type: "START"
                });
                playSequence();
                const sound = Math.floor(Math.random() * 4);
                addPlayList(sound);
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

      <audio src={state.sound} ref={audio} autoPlay ></audio>
    </div>
  );
}

export default App;

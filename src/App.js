import React, { useReducer, useRef } from "react";
import "./App.css";
// import Control from "./components/Control/Control";
import sounds from "./sounds";

const buttons = ["btnGreen", "btnRed", "btnYellow", "btnBlue", "wrong"];

const initialState = {
  btnGreen: {
    clicked: false,
    classClicked: "green-clicked",
    soundEffect: sounds[0]
  },
  btnRed: {
    clicked: false,
    classClicked: "red-clicked",
    soundEffect: sounds[1]
  },
  btnYellow: {
    clicked: false,
    classClicked: "yellow-clicked",
    soundEffect: sounds[2]
  },
  btnBlue: {
    clicked: false,
    classClicked: "blue-clicked",
    soundEffect: sounds[3]
  },
  playList: [buttons[Math.floor(Math.random() * 4)]],
  userPlayList: [],
  start: false,
  reset: false,
  isPlaying: false,
  displayer: "-:-",
  cursor: 0,
  simonIsBusy: false
};

const reducer = (state, action) => {
  // console.log("state =", state)
  console.log("dispatch =", action.type, action.btn || "", action.text || "");
  switch (action.type) {
    case "ADD_PLAYLIST":
      return {
        ...state,
        playList: [...state.playList, action.btn]
      };
    case "IS_PLAYING":
      return { ...state, isPlaying: true };
    case "IS_NOT_PLAYING":
      return { ...state, isPlaying: false, displayer: "-:-" };
    case "START":
      return { ...state, start: !state.start };
    case "RESET":
      return {
        ...initialState,
        playList: [buttons[Math.floor(Math.random() * 4)]]
      };
    case "INC_CURSOR":
      return { ...state, cursor: state.cursor + 1 };
    case "RESET_CURSOR":
      return { ...state, cursor: 0 };
    case "SET_DISPLAYER":
      return { ...state, displayer: action.text };
    case "BTN_PLAY":
      return {
        ...state,
        [action.btn]: { ...state[action.btn], clicked: true }
      };
    case "BTN_STOP":
      return {
        ...state,
        [action.btn]: { ...state[action.btn], clicked: false }
      };
    case "WIN":
      return { ...state, start:false, playList: [buttons[Math.floor(Math.random() * 4)]], cursor: 0, displayer: "YOU WIN"}

    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioBtnGreen = useRef();
  const audioBtnRed = useRef();
  const audioBtnYellow = useRef();
  const audioBtnBlue = useRef();
  const audioWorng = useRef();

  const playBtn = btn => {
    if (btn === "btnGreen") {
      audioBtnGreen.current.currentTime = 0;
      audioBtnGreen.current.play();
    }
    if (btn === "btnRed") {
      audioBtnRed.current.currentTime = 0;
      audioBtnRed.current.play();
    }
    if (btn === "btnYellow") {
      audioBtnYellow.current.currentTime = 0;
      audioBtnYellow.current.play();
    }
    if (btn === "btnBlue") {
      audioBtnBlue.current.currentTime = 0;
      audioBtnBlue.current.play();
    }
    if (btn === "wrong") {
      audioWorng.current.currentTime = 0;
      audioWorng.current.play();
    }

    // else{
    //   dispatch({
    //     type: "PLAY_SOUND",
    //     sound
    //   });
    //   if (!state.isPlaying) {
    //     dispatch({ type: "IS_PLAYING" });
    //   }
    //   if (state.sound === sound) {
    //     audio.current.currentTime = 0;
    //     audio.current.play();
    //   }
    // }
  };
  // const addUserPlayList = sound => {
  //   dispatch({
  //     type: "ADD_USER_PLAYLIST",
  //     sound
  //   });
  // };

  const playPlayList = newBtn => {
    const list = newBtn ? [...state.playList, newBtn] : [...state.playList];
    console.log("play playlist----", list);
    dispatch({ type: "IS_PLAYING" });
    dispatch({ type: "RESET_CURSOR" });
    setTimeout(() => {
    list.forEach((btn, i) => {
      setTimeout(() => {
        dispatch({
          type: "BTN_PLAY",
          btn
        });
        dispatch({
          type: "SET_DISPLAYER",
          text: list.length - i
        });
        playBtn(btn);
      }, 1000 * (i + 1));
    });
    setTimeout(() => {
      dispatch({ type: "IS_NOT_PLAYING" });
    }, 1000 * (list.length + 2));
    }, 1000);
  };

  const checkList = btn => {
    if (state.playList[state.cursor] === btn) {
      console.log("user click --------");
      playBtn(btn);
      if(state.cursor === 1){
        dispatch({ type: "WIN" })
       
      return
      }
      dispatch({ type: "INC_CURSOR" });
      if (state.cursor === state.playList.length - 1) {
        const newBtn = buttons[Math.floor(Math.random() * 4)];
        dispatch({ type: "ADD_PLAYLIST", btn: newBtn });
        playPlayList(newBtn);
      }
    } else {
      dispatch({ type: "SET_DISPLAYER", text: "WRONG" });
      playBtn("wrong");
      dispatch({
        type: "BTN_STOP",
        btn
      });
      dispatch({ type: "RESET_CURSOR" });
      playPlayList();
    }
  };

  // console.log("state playlist =", state.playList);
  // console.log("sound =", state.sound);
  const { btnGreen, btnRed, btnYellow, btnBlue } = state;
  return (
    <div className="grid">
      <div
        className={`green ${btnGreen.clicked ? btnGreen.classClicked : ""}`}
        // style={sounds[0] === state.sound ? { background: "lime" } : {}}
        onClick={() => {
          if (!state.start) return;
          if (state.isPlaying) return;
          dispatch({
            type: "BTN_PLAY",
            btn: "btnGreen"
          });
          checkList("btnGreen");
        }}
      ></div>
      <div
        className={`red ${btnRed.clicked ? btnRed.classClicked : ""}`}
        onClick={() => {
          if (!state.start) return;
          if (state.isPlaying) return;
          dispatch({
            type: "BTN_PLAY",
            btn: "btnRed"
          });
          checkList("btnRed");
        }}
      ></div>
      <div
        className={`yellow ${btnYellow.clicked ? btnYellow.classClicked : ""}`}
        onClick={() => {
          if (!state.start) return;
          if (state.isPlaying) return;
          dispatch({
            type: "BTN_PLAY",
            btn: "btnYellow"
          });
          checkList("btnYellow");
        }}
      ></div>
      <div
        className={`blue ${btnBlue.clicked ? btnBlue.classClicked : ""}`}
        onClick={() => {
          if (!state.start) return;
          if (state.isPlaying) return;
          dispatch({
            type: "BTN_PLAY",
            btn: "btnBlue"
          });
          checkList("btnBlue");
        }}
      ></div>

      <div className="control">
        <h1 className="title">Simon</h1>
        <div className="monitor">
          <span>{state.displayer}</span>
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
                const sound = Math.floor(Math.random() * 4);
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

      <audio
        src={state.btnGreen.soundEffect}
        ref={audioBtnGreen}
        onEnded={() => {
          // console.log('audio ended')

          dispatch({
            type: "BTN_STOP",
            btn: "btnGreen"
          });
        }}
      ></audio>
      <audio
        src={state.btnRed.soundEffect}
        ref={audioBtnRed}
        onEnded={() => {
          // console.log('audio ended')

          dispatch({
            type: "BTN_STOP",
            btn: "btnRed"
          });
        }}
      ></audio>
      <audio
        src={state.btnYellow.soundEffect}
        ref={audioBtnYellow}
        onEnded={() => {
          // console.log('audio ended')

          dispatch({
            type: "BTN_STOP",
            btn: "btnYellow"
          });
        }}
      ></audio>
      <audio
        src={state.btnBlue.soundEffect}
        ref={audioBtnBlue}
        onEnded={() => {
          // console.log('audio ended')

          dispatch({
            type: "BTN_STOP",
            btn: "btnBlue"
          });
        }}
      ></audio>
      <audio
        src={sounds[4]}
        ref={audioWorng}
        onEnded={() => {
          // console.log('audio ended')

          dispatch({
            type: "BTN_STOP",
            btn: "wrong"
          });
        }}
      ></audio>
    </div>
  );
}

export default App;

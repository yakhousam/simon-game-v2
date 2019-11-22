import React, { useReducer, useState, useRef } from "react";
import "./App.css";
// import Control from "./components/Control/Control";
import sounds from "./sounds";
import imgStart from './start.png'
import imgStop from './stop.png'

const buttons = ["btnGreen", "btnRed", "btnYellow", "btnBlue"];

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
  btnWrong:{
    btn:'',
    classClicked: "wrong",
    soundEffect: sounds[4]
  },
  playList: [buttons[Math.floor(Math.random() * 4)]],
  userPlayList: [],
  start: false,
  reset: false,
  isPlaying: false,
  displayer: "PUSH START",
  cursor: 0,
  scoreWin: 10,
  wrong: false,
  win: false
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
      return { ...state, isPlaying: false };
    case "START":
      return { ...state, start: !state.start, win: false, wrong: false };
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
        [action.btn]: { ...state[action.btn], clicked: false}
      };
    case "WIN":
      return { ...state, win: true, start:false, playList: [buttons[Math.floor(Math.random() * 4)]], cursor: 0, displayer: "YOU WIN"}
    case "WRONG":
      return {...state, wrong: action.wrong, btnWrong:{...state.btnWrong, btn: action.btn}}
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [timer, setTimer] = useState([]);
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

    
  };
 

  const playPlayList = newBtn => {
    const list = newBtn ? [...state.playList, newBtn] : [...state.playList];
    console.log("play playlist----", list);
    dispatch({ type: "IS_PLAYING" });
    dispatch({ type: "RESET_CURSOR" });
    const timeOut = setTimeout(() => {
    list.forEach((btn, i) => {
      const timeOut = setTimeout(() => {
        dispatch({
          type: "BTN_PLAY",
          btn
        });
        dispatch({
          type: "SET_DISPLAYER",
          text: i + 1
        });
        playBtn(btn);
      }, 1000 * (i + 1));
      setTimer([...timer, timeOut])
    });
    const timeOut = setTimeout(() => {
      dispatch({ type: "IS_NOT_PLAYING" });
      dispatch({type: "SET_DISPLAYER", text: "YOUR TURN"})
    }, 1000 * (list.length + 2));
    setTimer([...timer, timeOut])
    }, 1000);
    setTimer([...timer, timeOut])
  };

  const checkList = btn => {
    if (state.playList[state.cursor] === btn) {
      console.log("user click --------");
      dispatch({type: "SET_DISPLAYER", text: `${state.cursor + 1} : ${state.playList.length }`})
      playBtn(btn);
      if(state.cursor + 1 === state.scoreWin){
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
      dispatch({type:"WRONG", wrong:true, btn})
      playBtn("wrong");
      
      dispatch({ type: "RESET_CURSOR" });
      playPlayList();
    }
  };

  // console.log("state playlist =", state.playList);
  // console.log("sound =", state.sound);
  const { btnGreen, btnRed, btnYellow, btnBlue, btnWrong } = state;
  window.console.log = ()=>{}
  return (
    <div className={`grid ${state.win ? 'win': ''} ${state.wrong ? 'wrong': ''}`}>
      <div
        className={`green ${btnGreen.clicked ? btnGreen.classClicked : ""} ${btnWrong.btn === 'btnGreen' ? btnWrong.classClicked : ""}`}
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
        className={`red ${btnRed.clicked ? btnRed.classClicked : ""} ${btnWrong.btn === 'btnRed' ? btnWrong.classClicked : ""}`}
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
        className={`yellow ${btnYellow.clicked ? btnYellow.classClicked : ""} ${btnWrong.btn === 'btnYellow' ? btnWrong.classClicked : ""}`}
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
        className={`blue ${btnBlue.clicked ? btnBlue.classClicked : ""} ${btnWrong.btn === 'btnBlue' ? btnWrong.classClicked : ""}`}
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

      <div className={`control ${state.win ? 'win': ''} ${state.wrong ? 'wrong': ''}`}>
        <h1 className="title">Simon</h1>
        <div className={`monitor ${state.win ? 'win': ''} ${state.wrong ? 'wrong': ''}`}>
          <span>{state.displayer}</span>
        </div>
        <div className="btn-wrap">
          <div
            className="btn"
            style={{ backgroundImage: !state.start ?  `url(${imgStart})` : `url(${imgStop})`} }
            onClick={() => {
              if (!state.start) {
                dispatch({
                  type: "START"
                });
                playPlayList();
               
              } else {
                dispatch({ type: "RESET" });
                timer.forEach(t =>{
                  clearTimeout(t)
                })
              }
            }}
          >
          </div>
          {/* <div className="btn">S</div>
          <div className="btn"></div> */}
        </div>
      </div>

      <div className={`sp-vertical ${state.win ? 'win': ''} ${state.wrong ? 'wrong': ''}`}></div>
      <div className={`sp-horizontal ${state.win ? 'win': ''} ${state.wrong ? 'wrong': ''}`}></div>

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
        src={state.btnWrong.soundEffect}
        ref={audioWorng}
        onEnded={() => {
          // console.log('audio ended')

          dispatch({
            type: "BTN_STOP",
            btn: state.btnWrong.btn
          });
          dispatch({
            type: "WRONG",
            wrong: false,
            btn: ''
          });
        }}
      ></audio>
    </div>
  );
}

export default App;

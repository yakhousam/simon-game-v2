import React from "react";
import "./button.css";

const Button = props => {
  const { state, id, dispatch } = props;
  return (
    <div
      className={state.className}
      
    ></div>
  );
};

export default Button;

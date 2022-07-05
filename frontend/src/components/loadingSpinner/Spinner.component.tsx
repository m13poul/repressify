import React from "react";
import "./Spinner.styles.scss";
function Spinner() {
  return (
    <div className="placeIt">
      <div className="quote">
        Where the press is free and every man able to read, all is safe.
        <br />
        <span className="author"> Thomas Jefferson </span>
      </div>
      <br />
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Spinner;

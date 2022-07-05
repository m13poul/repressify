import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import "./FormSuccess.styles.scss";
import { useNavigate } from "react-router-dom";
import Countdown from "react-countdown";

function FormSuccess() {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/");
  }, 5000);
  const renderer = ({ seconds }: { seconds: number }) => {
    return <span>{seconds}</span>;
  };
  return (
    <div className="success-container">
      <div className="upper">
        <IconContext.Provider
          value={{
            color: "white",
            className: "global-class-name",
            size: "5rem",
          }}
        >
          <BsCheckCircleFill />
          <p>Success</p>
        </IconContext.Provider>
      </div>
      <div className="lower">
        <p>
          We have successfully received your message! <br /> Thank you. We will
          get back to you soon!
        </p>
        <p>
          You will be redirected automatically in <br />
          <Countdown date={Date.now() + 5000} renderer={renderer} />
        </p>
      </div>
    </div>
  );
}

export default FormSuccess;

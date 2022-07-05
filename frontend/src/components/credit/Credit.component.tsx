import React from "react";
import "./Credit.styles.scss";

function Credit() {
  return (
    <div className="credit">
      <p>Are you enjoying the service? Give me a star on </p>
      <span className="github">
        <a href="https://github.com/m13poul/repressify" className="github" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </span>
    </div>
  );
}

export default Credit;

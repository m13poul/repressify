import React from "react";
import "./ErrorMessage.styles.scss";

function ErrorMessage({ children }: { children: string }) {
  return <div className="errorStyles">{children}</div>;
}

export default ErrorMessage;

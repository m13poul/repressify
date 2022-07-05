import React, { FC } from "react";
import "./UtilButton.scss";

interface Props {
  children: string;
  actionToDo: (value: any) => void;
  value?: any;
  color: string;
  disabled?: boolean;
  icon?: any;
  type?: string;
  className?: string;
}

const UtilButton: FC<Props> = ({ children, actionToDo, value, color, disabled = false, icon, className }) => {
  return (
    <button className={`utilButton ${color} ${className}`} onClick={() => actionToDo(value)} disabled={disabled}>
      {children}
      {icon}
    </button>
  );
};

export default UtilButton;

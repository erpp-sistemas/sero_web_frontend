import awaitms from "./Custom/awaitms";
import "./styles/UseClick.css";
import { FC, HTMLAttributes, ReactNode, useState } from "react";

const UseClick = ({ children, ...rest }) => {
  const [classNames, setClassNames] = useState("--use-click");
  const handleClick = async (e) => {
    e.stopPropagation(); 
    setClassNames("--use-click --click");
    await awaitms(200);
    setClassNames("--use-click");
  };
  return (
    <div className={classNames} onClick={handleClick} {...rest}>
      {children}
    </div>
  );
};

export default UseClick;

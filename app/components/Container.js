import React, { useEffect } from "react";

function Container(props) {
  return <div className={"max-w-3xl py-5 " + (props.wide ? "" : "max-w-2xl")}>{props.children}</div>;
}

export default Container;

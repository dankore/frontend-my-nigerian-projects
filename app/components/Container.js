import React, { useEffect } from "react";

function Container(props) {
  console.log(props);
  return <div className={`mx-auto mt-10 ${props.wide ? 'max-w-3xl' : 'max-w-2xl'}`}>{props.children}</div>;
}

export default Container;

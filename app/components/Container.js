import React from "react";

function Container(props) {
  return <div style={{minHeight: 400+'px'}} className={`sm:mx-auto bg-white py-10 px-2 lg:px-8 shadow ${props.wide ? 'max-w-3xl' : 'max-w-2xl'}`}>{props.children}</div>;
}

export default Container;

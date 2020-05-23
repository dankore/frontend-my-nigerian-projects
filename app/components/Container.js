import React, { useEffect } from "react";

function Container(props) {
  return <div className={`${props.margin || ''} sm:mx-auto mt-10 ${props.wide ? 'max-w-3xl' : 'max-w-2xl'}`}>{props.children}</div>;
}

export default Container;

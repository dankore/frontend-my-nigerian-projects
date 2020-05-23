import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | Bid For My Projects`;
    window.scrollTo(0, 0);
  }, [props.title]);

  return <Container margin={props.margin} wide={props.wide}>{props.children}</Container>;
}

export default Page;

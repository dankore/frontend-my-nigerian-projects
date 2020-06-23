import React, { useEffect, useContext } from "react";
import Container from "./Container";
import DispatchContext from '../DispatchContext';

function Page(props) {
  const appDispatch = useContext(DispatchContext);
  useEffect(() => {
    document.title = `${props.title} | Bid For My Projects`;
    appDispatch({ type: 'alwaysCloseTheseMenus' });
    window.scrollTo(0, 0);
  }, [props.title]);

  return <Container margin={props.margin} wide={props.wide}>{props.children}</Container>;
}

export default Page;

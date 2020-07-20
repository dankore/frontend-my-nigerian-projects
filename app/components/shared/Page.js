import React, { useEffect, useContext } from 'react';
import Container from './Container';
import DispatchContext from '../../DispatchContext';
import { Helmet } from 'react-helmet';
import {formatTitleAndDescription } from '../../helpers/JSHelpers';



function Page(props) {
  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    appDispatch({ type: 'alwaysCloseTheseMenus' });
    window.scrollTo(0, 0);
  }, [props.title]);

  return (
    <Container margin={props.margin} wide={props.wide}>
      <Helmet>
        {/* General tags */}
        <title>{`${props.title} | My Nigerian Projects`}</title>
        <meta name="description" content={formatTitleAndDescription(props.description)} />
        <meta name="image" content={props.image} />

        {/* OpenGraph tags */}
        <meta property="og:url" content={props.url} />
        {props.isArticle && <meta property="og:type" content="article" />}
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={formatTitleAndDescription(props.description)} />
        <meta property="og:image" content={props.image} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={formatTitleAndDescription(props.description)} />
        <meta name="twitter:image" content={props.image} />
      </Helmet>
      {props.children}
    </Container>
  );
}

export default Page;

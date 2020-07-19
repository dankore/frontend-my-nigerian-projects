import React from 'react';
import { Helmet } from 'react-helmet';

function SEO({ image, description, url, title}) {
  // TRUNCATE TITLE AND DESCRIPTION
  const formatTitleAndDescription = s => {
    if(s){
        const inputToArray = s.split(' ');
    if (inputToArray.length < 6) {
      return `${inputToArray.slice(0, 5).join(' ')}`;
    }
    return `${inputToArray.slice(0, 5).join(' ')}...`;
    }
  };

  return (
    <>
        <Helmet>
        {/* General tags */}
        <title>{title}</title>
        <meta name="description" content={formatTitleAndDescription(description)} />
        <meta name="image" content={image} />

        {/* OpenGraph tags */}
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" /> 
        <meta property="og:title" content={title} />
        <meta property="og:description" content={formatTitleAndDescription(description)} />
        <meta property="og:image" content={image} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={formatTitleAndDescription(description)} />
        <meta name="twitter:image" content={image} />
      </Helmet>
    </>
  );
}

export default SEO;
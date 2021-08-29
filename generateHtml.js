import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import Footer from './app/components/shared/Footer';
import Header from './app/components/shared/Header';
import LoadingDotsIcon from './app/components/shared/LoadingDotsIcon';
import { StaticRouter as Router } from 'react-router-dom';
import StateContext from './app/StateContext';

function Shell() {
  return (
    <StateContext.Provider>
      <Router>
        <Header />
        <div>
          <LoadingDotsIcon />
        </div>
        <Footer />
      </Router>
    </StateContext.Provider>
  );
}

function html(x) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Bid For My Projects</title>
      <link rel="stylesheet" href="/css/main.css" />
       <script defer src="https://use.fontawesome.com/releases/v5.5.0/js/all.js"
        integrity="sha384-GqVMZRt5Gn7tB9D9q7ONtcp4gtHIUEW/yG7h98J7IpE3kpi+srfFyyB/04OV6pG0" crossorigin="anonymous">
      </script>
    </head>
    <body style="background-color: #f0f2f5; -webkit-font-smoothing: antialiased;">
      <div id="app">
      ${x}
      </div>
    </body>
  </html>
  `;
}

/*
  I can use ReactDomServer (you can see how I imported
  that at the very top of this file) to generate a string
  of HTML text. I simply give it a React component and
  here I are using the JSX syntax.
*/
const reactHtml = ReactDOMServer.renderToString(<Shell />);

/*
  Call our "html" function which has the skeleton or
  boilerplate HTML, and give it the string that React
  generated for us. Our "html" function will insert
  the React string inside the #app div. So now I will
  have a variable in memory with the exact string I
  want, I just need to save it to a file.

*/
const overallHtmlString = html(reactHtml);

/*
  Here I are simply
  saving our generated string into a file named
  index-template.html. Please note that this Node task
  will fail if the directory I told it to live within
  ("app" in this case) does not already exist.
*/
const fileName = './app/index-template.html';
const stream = fs.createWriteStream(fileName);
stream.once('open', () => {
  stream.end(overallHtmlString);
});

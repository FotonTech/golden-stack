import serialize from 'serialize-javascript';

const NODE_ENV = process.env.NODE_ENV;

const indexHtml = ({ assets, styleTags, relayData, html, lang = 'en' }) => {
  return `
    <!doctype html>
      <html lang="${lang}">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />

          <title>Foton Golden Stack</title>

          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://fonts.googleapis.com/css?family=Nunito+Sans&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.23.6/antd.css" integrity="sha256-VcWLDsd1Jrj16QZzmvX28YbDY1XwK3P4ku5mo1I+89g=" crossorigin="anonymous" />
          <meta name="theme-color" content="#ffffff">

          <style>
              html,
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #F8F8F8;

                  /* Antialiased fonts*/
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
              }
              * {
                font-family: 'Nunito sans', Nunito, Helvetica, Arial, sans-serif;
                ::-webkit-scrollbar {
                  display: none;
                }
              }
              #root {
                overflow: hidden;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
              }
              input[type="email"] {
                text-transform: lowercase;
              }
              img {
                object-fit: cover;
              }
          </style>
          ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
          ${styleTags}
      </head>
      <body>
          <div id="root">${html}</div>
          <script src="${assets.client.js}" defer${NODE_ENV === 'production' ? '' : ' crossorigin'}></script>
          <script>
            window.__RELAY_PAYLOADS__ = ${serialize(relayData, { isJSON: true })};
          </script>
          <script async src="https://unpkg.com/smoothscroll-polyfill/dist/smoothscroll.min.js"></script>
      </body>
    </html>`;
};

export default indexHtml;

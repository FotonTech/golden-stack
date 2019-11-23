const indexHtml = ({ assets, styleTags, relayData, html }) => {
  return `
    <!doctype html>
      <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <title>Foton Golden Stack</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap" rel="stylesheet">
          <style>
              html,
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f8f8f8;

                  /* Antialiased fonts*/
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
              }
              * {
                font-family: 'Open Sans', Helvetica, Arial, sans-serif;
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
          <script src="${assets.client.js}" defer${
    process.env.NODE_ENV === 'production' ? '' : ' crossorigin'
  }></script>
      </head>
      <body>
          <div id="root">${html}</div>
      </body>
    </html>`;
};

export default indexHtml;

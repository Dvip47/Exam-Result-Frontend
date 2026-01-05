export const generateHTML = (content, initialData, helmet) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${helmet ? helmet.title.toString() : '<title>Daily Exam Result</title>'}
      ${helmet ? helmet.meta.toString() : ''}
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div id="root">${content}</div>
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
      </script>
      <script src="/bundle.js"></script>
    </body>
    </html>
  `;
};

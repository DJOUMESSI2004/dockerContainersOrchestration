const express = require('express');
const app = express();
const port = 3020;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 👇 Changer localhost → 0.0.0.0
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});

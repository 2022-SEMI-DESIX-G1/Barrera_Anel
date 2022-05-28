const express = require('express')
const app = express()
const port = 3000

app.get('/:n', (req, res) => {
  var n = req.params.n;
  var fibonacci = [];
  fibonacci[0] = 0;
  fibonacci[1] = 1;
  for (var i = 2; i < n; i++) {
      fibonacci[i] = fibonacci[i - 2] + fibonacci[i - 1];
  }
    res.json({ Fibonacci: fibonacci });
     
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
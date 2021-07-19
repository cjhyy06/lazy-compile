const express = require('express')
const path = require('path')

const fs = require('fs')

const app = express()

const port = 3000

let html

console.log('sssssssssss2s1ss2ssss')

app.get('*', (req, res, next) => {
  // res.sendFile(__dirname + '/public/index.html')
  if (html) {
    res.send(html)
  } else {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, content) => {
      if (err) {
        next(err)
      } else {
        html = content
        res.send(content)
      }
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

let express = require('express')
let app = express()

let connections = []
let votes = {yes: 0, no: 0}

app.use(express.json())
app.use(express.static('static'))

app.get('/', function(req, res) {
  res.redirect('/index.html')
})

app.post('/vote', function(req, res) {
  if (req.body.vote === "yes") votes.yes++
  else votes.no++

  console.log(votes)

  for(let i = 0; i < connections.length; i++) {
    connections[i].write("data: " + JSON.stringify(votes) + "\n\n");
  }

  res.sendStatus(200)
})

app.get('/stream', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    res.write("data: " + JSON.stringify(votes) + "\n\n");
    connections.push(res)
})

app.listen(3000, function() {
  console.log('Listening on port 3000.')
})
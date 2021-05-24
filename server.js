const port = 3000

const express = require('express')
const bodyParser = require('body-parser')
const NeDB = require('nedb')
const path = require('path')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
 
app.use(express.static('static'))

let database = new NeDB({
    filename: './levels.db',
    autoload: true
})


app.get('/', (req, res) => {
    res.redirect('/editor')
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'editor.html'))
})

app.get('/hex', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'hex.html'))
})

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'game.html'))
})

app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'player.html'))
})




app.post('/send', (req, res) => {

    database.update({level: req.body.name}, { $set: { hexes: req.body.level, size: req.body.size }}, {upsert: true})
    database.update({level: ''}, { $set: { hexes: req.body.level, size: req.body.size }}, {upsert: true})

    console.log('got', req.body)
    res.send('zapisano')
})

app.post('/get', (req, res) => {
    database.findOne({level: req.body.name}, (err, doc) => {
        if(err)
            console.error(err)
        else
            res.send(doc)
    })
})

app.listen(port, () => console.log(`Hexy działają na porcie: ${port}!`));
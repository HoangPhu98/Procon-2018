const express = require('express')
const engine = require('ejs-mate')
const Router = require('router')
const addon = require('./build/Release/addon.node')
//const cookieParser = require('cookie-parser')

const app = express()

app.engine('ejs', engine)

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))
//app.use(cookieParser())

app.get('/', (req, res) =>{
    res.render('index')
})

app.get('/get-suggest', (req, res) => {
    //console.log(JSON.parse(req.headers.data).m);
    var currentState = JSON.parse(req.headers.data);
    //console.log(currentState.myAgent1.x);
    let array_direct = addon.add(currentState.m, currentState.n, currentState.mapOfWeight, currentState.mapOfPosition, currentState.myAgent1.x, currentState.myAgent1.y, currentState.myAgent2.x, currentState.myAgent2.y, currentState.opAgent1.x, currentState.opAgent1.y, currentState.opAgent2.x, currentState.opAgent2.y, currentState.nb_turn);
    console.log(array_direct)

    //let array = [[1, 2], [2, 3]];
    //res.send(JSON.stringify(array))
    res.send(JSON.stringify(array_direct))
})

app.listen(3333, () => {
    console.log("Server running at magic port 3333...")
})


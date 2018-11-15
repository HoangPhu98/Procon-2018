var content_map;
var m;  //Height of map
var n;  //Width if map
var map = new Array();
var mapOfWeight;
var mapOfPosition = new Array();
var myTilePoint = 0;
var opTilePoint = 0;
var statusSuggest = 0;
var statusGreedy = 0;
var checkDirection = 1;
var directionOfSide = 0;
var max_point = -16;


let myHeadColor = "#0033cc"
let opHeadColor = "#ff6600"
let myColor = "#33cccc"
let opColor = "#ffcc66"

var allHistory = [];
var mapStatus = new Array(); //For calculate surround Point
var turn = 0;

function Agent(name, side){
    this.x = 0;
    this.y = 0;
    this.name = name;
    this.side = side;
    this.history = [];
    
    this.getId = getIdDom;
    this.start = startAgent;
    this.action = createEventAgent;
}

function getIdDom(){
    return "row" + this.y + "col" + this.x;
}

function startAgent(x, y){
    this.x = x;
    this.y = y;

    let headClass;
    if(this.side == "X"){
        headClass = "headMyAgent";
        mapOfPosition[y][x] = 1;
        myTilePoint += mapOfWeight[y][x];
        document.getElementById("vrow" + this.y + "col" + this.x).style.backgroundColor = "#ff6600";
    }else{
        headClass = "headOpAgent";
        mapOfPosition[y][x] = 2;
        opTilePoint += mapOfWeight[y][x];
    }
    document.getElementById(this.getId()).classList.add(headClass);
    document.getElementById(this.getId()).innerHTML = this.name;
    //this.action();
}

function createEventAgent(){
   
}

const myAgent1 = new Agent("X1", "X");
const myAgent2 = new Agent("X2", "X");
const oponentAgent1 = new Agent("O1", "O");
const oponentAgent2 = new Agent("O2", "O");

window.onload = function(){
    document.getElementById('file-input').addEventListener('change', readSingleFile, false);
    document.getElementById('acceptx').addEventListener('click', readInputText);
    document.getElementById('drawMap').onclick = drawMap;
    document.getElementById('next').onclick = nextTurn;
    document.getElementById("btn-undo-x1").onclick = undoAgent;
    document.getElementById("btn-undo-x2").onclick = undoAgent;
    document.getElementById("btn-undo-o1").onclick = undoAgent;
    document.getElementById("btn-undo").onclick = undoGame;
    document.getElementById("btn-undo-o2").onclick = undoAgent;
    
    document.getElementById('next').addEventListener('click', saveStatus);
    document.getElementById('backupGame').addEventListener('click', restoreGame);
    document.getElementById("btn-change").addEventListener('click', changeStatusSuggest);
    document.getElementById("btn-change2").addEventListener('click', changeStatusGreedy);
    document.getElementById("changeAngle").onclick = drawDirection;

    //document.getElementById('next').addEventListener('click', suggest);
    //document.getElementById('next').addEventListener('click', getSuggest);
}
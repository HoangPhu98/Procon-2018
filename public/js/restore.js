function saveStatus(){
    console.log("Save data");
    localStorage.clear();
    window.localStorage['mapWeight'] = JSON.stringify(mapOfWeight);
    window.localStorage['mapPosition'] = JSON.stringify(mapOfPosition);

    let parameter = {
        'm': m,
        'n': n,
        'turn': turn - 1
    }

    let myHead1 = [myAgent1.x, myAgent1.y];
    let myHead2 = [myAgent2.x, myAgent2.y];

    let opHead1 = [oponentAgent1.x, oponentAgent1.y];
    let opHead2 = [oponentAgent2.x, oponentAgent2.y];

    let myPoint = {
        'tile': myTilePoint,
        'surround': parseInt(document.getElementById("mySurround").innerHTML),
        'total': parseInt(document.getElementById('myTotalPoint').innerHTML)
    }

    let opPoint = {
        'tile': opTilePoint,
        'surround': parseInt(document.getElementById('opSurround').innerHTML),
        'total': parseInt(document.getElementById('opTotalPoint').innerHTML)
    }

    window.localStorage['parameter'] = JSON.stringify(parameter);
    window.localStorage['myHead1'] = JSON.stringify(myHead1);
    window.localStorage['myHead2'] = JSON.stringify(myHead2);
    window.localStorage['opHead1'] = JSON.stringify(opHead1);
    window.localStorage['opHead2'] = JSON.stringify(opHead2);
    window.localStorage['myPoint'] = JSON.stringify(myPoint);
    window.localStorage['opPoint'] = JSON.stringify(opPoint);
    window.localStorage['turn'] = JSON.stringify(turn);
}

function continueGame(x1, y1, x2, y2, x3, y3, x4, y4){
    myAgent1.name = "X1";
    myAgent1.side = "X";
    myAgent1.x = x1;
    myAgent1.y = y1;

    myAgent2.name = "X2";
    myAgent2.side = "X";
    myAgent2.x = x2;
    myAgent2.y = y2;

    oponentAgent1.name = "O1";
    oponentAgent1.side = "O";
    oponentAgent1.x = x3;
    oponentAgent1.y = y3;

    oponentAgent2.name = "O2";
    oponentAgent2.side = "O";
    oponentAgent2.x = x4;
    oponentAgent2.y = y4;

    document.getElementById("row" + y1 + "col" + x1).style.backgroundColor = "#ff6600";
    document.getElementById("row" + y1 + "col" + x1).innerHTML = "X1";
    document.getElementById("row" + y2 + "col" + x2).style.backgroundColor = "#ff6600";
    document.getElementById("row" + y2 + "col" + x2).innerHTML = "X2";
    document.getElementById("row" + y3 + "col" + x3).style.backgroundColor = "#0033cc";
    document.getElementById("row" + y3 + "col" + x3).innerHTML = "O1";
    document.getElementById("row" + y4 + "col" + x4).style.backgroundColor = "#0033cc";
    document.getElementById("row" + y4 + "col" + x4).innerHTML = "O2";

    document.getElementById("vrow" + y1 + "col" + x1).style.backgroundColor = "#ff6600";
    document.getElementById("vrow" + y2 + "col" + x2).style.backgroundColor = "#ff6600";

}

function restoreGame(){
    //Load local storage
    let parameter = JSON.parse(window.localStorage['parameter']);
    
    mapOfWeight = JSON.parse(window.localStorage['mapWeight']);
    mapOfPosition = JSON.parse(window.localStorage['mapPosition']);
    
    let myHead1 = JSON.parse(window.localStorage['myHead1']);
    let myHead2 = JSON.parse(window.localStorage['myHead2']);
    let opHead1 = JSON.parse(window.localStorage['opHead1']);
    let opHead2 = JSON.parse(window.localStorage['opHead2']);

    let myPoint = JSON.parse(window.localStorage['myPoint']);
    let opPoint = JSON.parse(window.localStorage['opPoint']);

    let old_turn = JSON.parse(window.localStorage['turn']);

    //Set basic parameter
    m = parameter.m;
    n = parameter.n;
    turn = parameter.turn;

    //draw raw two map: main map and color map
    let html = "<table>";
    let htmlColor = "<table>";
    let data;
    let dataColor;
    for(let i = 1; i <= m; i++){
        data = "<tr>";
        dataColor = "<tr>";
        for(let j = 1; j <= n; j++){
            data += "<td id='row" + i + "col" + j + "'>" + mapOfWeight[i][j] + "</td>";
            dataColor += "<td id='vrow" + i + "col" + j + "'>" + mapOfWeight[i][j] + "</td>";
        }
        data += "</tr>";
        dataColor += "</tr>";
        
        html += data;
        htmlColor += dataColor;
    }
    html += "</table>";
    htmlColor += "</table>";
    
    document.getElementById("board").innerHTML = html;
    document.getElementById("boardColor").innerHTML = htmlColor;

    document.getElementById("file-input").style.display = 'none';
    document.getElementById("drawMap").style.display = 'none';
    document.getElementById("backupGame").style.display = "none";
    document.getElementById('acceptx').style.display = 'none';
    document.getElementById('text-input').style.display = 'none';
    document.getElementById("board").style.width = (n * 34 + (n -1) * 6.8)  + "px";
    
    document.getElementById('displayTurn').innerHTML = old_turn;
    //set status
    myTilePoint = myPoint.tile;
    opTilePoint = opPoint.tile;
    document.getElementById("myTile").innerHTML = myTilePoint;
    document.getElementById("opTile").innerHTML = opTilePoint;
    document.getElementById("mySurround").innerHTML = myPoint.surround;
    document.getElementById("opSurround").innerHTML = opPoint.surround;
    document.getElementById("myTotalPoint").innerHTML = myPoint.total;
    document.getElementById("opTotalPoint").innerHTML = opPoint.total;

    for(let i = 1; i <= m; i++){
        for(let j = 1; j <= n; j++){
            if(mapOfPosition[i][j] == 1){
                document.getElementById("row" + i + "col" +j).style.backgroundColor = "#ffcc66";
            }else if(mapOfPosition[i][j] == 2){
                document.getElementById("row" + i + "col" + j).style.backgroundColor = "#33cccc";
            }
        }
    }

    drawBoardColor();
    continueGame(myHead1[0], myHead1[1], myHead2[0], myHead2[1], opHead1[0], opHead1[1], opHead2[0], opHead2[1]);
    createEventForMap();
    

    mapStatus.push(new Array());
    for(let i = 1; i <= m; i++){
        mapStatus.push(new Array());
        mapStatus[i].push(i);
        for(let j = 1; j <= n; j++){
            mapStatus[i].push(0);
        }
    }
    
}


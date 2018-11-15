
var flagOfAgent = false;
var anchor = {x: 0, y: 0};
var nameOfAgent = "";

function readSingleFile(e){
    var file = e.target.files[0];
    if(!file){
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e){
        content_map = e.target.result;
    };

    reader.readAsText(file);
}

function readInputText(){
    console.log(document.getElementById('text-input').value)
    content_map = document.getElementById('text-input').value
}

function startGame(x1, y1, x2, y2, x3, y3, x4, y4){
    myAgent1.name = "X1";
    myAgent1.side = "X";

    myAgent2.name = "X2";
    myAgent2.side = "X";

    oponentAgent1.name = "O1";
    oponentAgent1.side = "O";

    oponentAgent2.name = "O2";
    oponentAgent2.side = "O";

    myTilePoint = 0;
    opTilePoint = 0;

    myAgent1.start(x1, y1);
    myAgent2.start(x2, y2);
    oponentAgent1.start(x3, y3);
    oponentAgent2.start(x4, y4);

    document.getElementById("myTile").innerHTML = myTilePoint;
    document.getElementById("opTile").innerHTML = opTilePoint;
    document.getElementById("myTotalPoint").innerHTML = myTilePoint;
    document.getElementById("opTotalPoint").innerHTML = opTilePoint;

}

function drawDirection(){
    if(directionOfSide){
        directionOfSide = 0
        document.getElementById("changeAngle").innerHTML = "Sang mau Xanh";
        drawMap()
    }else{
        directionOfSide = 1
        drawMap()
        document.getElementById("changeAngle").innerHTML = "Sang mau Do";
    }
}

function drawMap(){
    console.log(content_map);
    var array_split = content_map.split(":");
    for(var i = 0; i < array_split.length; i++){
        array_split[0].trim();
    }

    m = parseInt(array_split[0].split(" ")[0]);
    n = parseInt(array_split[0].split(" ")[1]);

    console.log(m + "x" + n);

    map.push(new Array());
    mapOfPosition.push(new Array());

    for(var i = 1; i < m + 1; i++){
        map.push(new Array());
        mapOfPosition.push(new Array());
        var row = array_split[i].split(" ");
        map[i].push(i);
        mapOfPosition[i].push(0);
        for(var j = 0; j < n; j++){
            map[i].push(parseInt(row[j]));
            mapOfPosition[i].push(0);
        }
    }

    let y1 = parseInt(array_split[m+1].split(" ")[0]);
    let x1 = parseInt(array_split[m+1].split(" ")[1]);

    let y2 = parseInt(array_split[m+2].split(" ")[0]);
    let x2 = parseInt(array_split[m+2].split(' ')[1]);

    let x3 = x1;
    let y3 = y2;

    let x4 = x2;
    let y4 = y1;

    let visual_map = new Array();
    let html;
    if(directionOfSide){
        visual_map.push(0);
        for(let i = 1; i <= n;i++){
            visual_map.push(new Array())
            visual_map[i].push(0)
            for(let j = 1; j <= m; j++){
                visual_map[i].push(map[m + 1 - j][i])
            }
        }
        html = "<table>";
        var data;
        for(var i = 1; i <= n; i++){
            data = "<tr>";
            for(var j = 1; j <= m; j++){
                data += "<td id='row" + (m + 1 - j) + "col" + i + "'>" + visual_map[i][j] + "</td>";
            }
            data += "</tr>";
            html += data;
        }
        html += "</table>";
    }else{
        visual_map.push(0)
        for(let i = 1; i <= n; i++){
            visual_map.push(new Array())
            visual_map[i].push(0)
            for(let j = 1; j <= m; j++){
                visual_map[i].push(map[j][n + 1 - i])
            }
        }
        html = "<table>";
        var data;
        for(var i = 1; i <= n; i++){
            data = "<tr>";
            for(var j = 1; j <= m; j++){
                data += "<td id='row" + j + "col" + (n + 1 - i) + "'>" + visual_map[i][j] + "</td>";
            }
            data += "</tr>";
            html += data;
        }
        html += "</table>";
    }
    

    mapOfWeight = map.slice();

    for(let i = 1; i <= m; i++){
        for(let j = 1; j <= n; j++){
            if(max_point < mapOfWeight[i][j]){
                max_point = mapOfWeight[i][j]
            }
        }
    }

    document.getElementById("board").innerHTML = html;
    drawBoardColor();

    document.getElementById("file-input").style.display = 'none';
    document.getElementById("drawMap").style.display = 'none';
    document.getElementById("backupGame").style.display = "none";
    document.getElementById('acceptx').style.display = 'none';
    document.getElementById('text-input').style.display = 'none';
    document.getElementById("board").style.width = (m * 34 + (m -1) * 6.8)  + "px";

    startGame(x1, y1, x2, y2, x3, y3, x4, y4);
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

//Tao su kien cho toan map
function createEventForMap(){
    for(let i = 1; i <= m; i++){
        for(let j = 1; j <= n; j++){
            document.getElementById("row" + i + "col" + j).addEventListener('click', handleClickNode);
            document.getElementById("row" + i + "col" + j).addEventListener('contextmenu', handleRightClick);
        }
    }
    //console.log("create event");
}

function parseId(id){
    //row3col7
    let x, y;
    y = parseInt(id.slice(id.search("w") + 1, id.search("c")));
    x = parseInt(id.slice(id.search("l") + 1, id.length));
    return {'x': x, 'y': y};
}

function checkClickAgent(coor, agent){
    return (coor.x == agent.x && coor.y == agent.y);
}

function handleClickNode(){
    const coordinate = parseId(this.id);
    let ownPosition;
    if(flagOfAgent){
        //Da kich vao agent
        console.log("Click step 2");
        if(checkClickAgent(coordinate, anchor)){
            //Click on agent
            console.log("Stand: " + nameOfAgent);
            if(nameOfAgent == "X1" || nameOfAgent == "X2"){
                document.getElementById("row" + coordinate.y + "col" + coordinate.x).style.backgroundColor = myHeadColor;
            }else if(nameOfAgent == "O1" || nameOfAgent == "O2"){
                document.getElementById("row" + coordinate.y + "col" + coordinate.x).style.backgroundColor = opHeadColor;
            }
            flagOfAgent = false;
        }else if(checkMoveToMyTeam(coordinate)){
            //click arround agent -> move
            if(coordinate.x >= anchor.x - 1 && coordinate.x <= anchor.x + 1 && coordinate.y <= anchor.y + 1 && coordinate.y >= anchor.y - 1){
                console.log("allow move");
                document.getElementById("row" + coordinate.y + "col" + coordinate.x).innerHTML = nameOfAgent;
                document.getElementById("row" + anchor.y + "col" + anchor.x).innerHTML = mapOfWeight[anchor.y][anchor.x];
                if(nameOfAgent == "X1" || nameOfAgent == "X2"){
                    if(mapOfPosition[coordinate.y][coordinate.x] == 1){
                        ownPosition = true;
                    }else{
                        ownPosition = false;
                        myTilePoint += mapOfWeight[coordinate.y][coordinate.x];
                    }
                    mapOfPosition[coordinate.y][coordinate.x] = 1;
                    document.getElementById("row" + coordinate.y + "col" + coordinate.x).style.backgroundColor = myHeadColor;
                    document.getElementById("row" + anchor.y + "col" + anchor.x).style.backgroundColor = myColor;
                    if(!ownPosition){
                        document.getElementById("myTile").innerHTML = myTilePoint;
                        mySurroundPoint = calculateSurround(mapOfPosition[coordinate.y][coordinate.x]);
                        document.getElementById("mySurround").innerHTML = mySurroundPoint;
                        document.getElementById("myTotalPoint").innerHTML = mySurroundPoint + myTilePoint;
                    }
                    
                    if(nameOfAgent == "X1"){
                        //Update Agent
                        myAgent1.x = coordinate.x;
                        myAgent1.y = coordinate.y;
                        myAgent1.history.push([anchor.x, anchor.y, "move"]);
                        allHistory.push(["X1", anchor.x, anchor.y, "move"]);
                    }else if(nameOfAgent == "X2"){
                        myAgent2.x = coordinate.x;
                        myAgent2.y = coordinate.y;
                        myAgent2.history.push([anchor.x, anchor.y, "move"]);
                        allHistory.push(["X2", anchor.x, anchor.y, "move"]);
                    }
                }else if(nameOfAgent == "O1" || nameOfAgent == "O2"){
                    if(mapOfPosition[coordinate.y][coordinate.x] == 2){
                        ownPosition = true;
                    }else{
                        ownPosition = false;
                        opTilePoint += mapOfWeight[coordinate.y][coordinate.x];
                    }
                    mapOfPosition[coordinate.y][coordinate.x] = 2;
                    
                    document.getElementById("row" + coordinate.y + "col" + coordinate.x).style.backgroundColor = opHeadColor;
                    document.getElementById("row" + anchor.y + "col" + anchor.x).style.backgroundColor = opColor;
                    
                    if(!ownPosition){
                        document.getElementById("opTile").innerHTML = opTilePoint;
                        opSurroundPoint = calculateSurround(mapOfPosition[coordinate.y][coordinate.x]);
                        document.getElementById("opSurround").innerHTML = opSurroundPoint;
                        document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurroundPoint;
                    }
                    
                    if(nameOfAgent == "O1"){
                        oponentAgent1.x = coordinate.x;
                        oponentAgent1.y = coordinate.y;
                        oponentAgent1.history.push([anchor.x, anchor.y, "move"]);
                        allHistory.push(["O1", anchor.x, anchor.y, "move"]);
                    }else if(nameOfAgent == "O2"){
                        oponentAgent2.x = coordinate.x;
                        oponentAgent2.y = coordinate.y;
                        oponentAgent2.history.push([anchor.x, anchor.y, "move"]);
                        allHistory.push(["O2", anchor.x, anchor.y, "move"]);
                    }
                }
                flagOfAgent = false;
            }
        }
    }else{
        //Chua kich vao agent
        if(checkClickAgent(coordinate, myAgent1)){
            console.log("My Agent1");
            anchor.x = myAgent1.x;
            anchor.y = myAgent1.y;
            nameOfAgent = myAgent1.name;
            document.getElementById(myAgent1.getId()).style.backgroundColor = "#66ff66";
            

            flagOfAgent = true;
        }else if(checkClickAgent(coordinate, myAgent2)){
            console.log("My agent 2");
            anchor.x = myAgent2.x;
            anchor.y = myAgent2.y;
            nameOfAgent = myAgent2.name;
            document.getElementById(myAgent2.getId()).style.backgroundColor = "#66ff66";

            flagOfAgent = true;
        }else if(checkClickAgent(coordinate, oponentAgent1)){
            console.log("Oponent 1");
            anchor.x = oponentAgent1.x;
            anchor.y = oponentAgent1.y;
            nameOfAgent = oponentAgent1.name;
            document.getElementById(oponentAgent1.getId()).style.backgroundColor = "#66ff66";

            flagOfAgent = true;
        }else if(checkClickAgent(coordinate, oponentAgent2)){
            console.log("Oponent 2");
            anchor.x = oponentAgent2.x;
            anchor.y = oponentAgent2.y;
            nameOfAgent = oponentAgent2.name;
            document.getElementById(oponentAgent2.getId()).style.backgroundColor = "#66ff66";
            
            flagOfAgent = true;
        }
    }
}

function checkMoveToMyTeam(coordinate){
    if(mapOfPosition[coordinate.y][coordinate.x] == 0){
        return true;
    }
    if(nameOfAgent == "X1" || nameOfAgent == "X2"){
        return (mapOfPosition[coordinate.y][coordinate.x] == 1);
    }else{
        return (mapOfPosition[coordinate.y][coordinate.x] == 2);
    }
}

function handleRightClick(){
    const coordinate = parseId(this.id);

    if(flagOfAgent && !(checkClickAllAgent(coordinate.x, coordinate.y))){
        if(coordinate.x >= anchor.x - 1 && coordinate.x <= anchor.x + 1 && coordinate.y >= anchor.y - 1 && coordinate.y <= anchor.y + 1 && mapOfPosition[coordinate.y][coordinate.x] != 0){
            console.log("maybe remove");
            document.getElementById("row" + coordinate.y + "col" + coordinate.x).style.backgroundColor = "#ffffcc";
            //if(mapOfPosition[coordinate.y][coordinate.x] == 1)
            addHistoryRemove(coordinate);
            if(mapOfPosition[coordinate.y][coordinate.x] == 2){
                if(nameOfAgent == "X1" || nameOfAgent == "X2"){
                    document.getElementById("row" + anchor.y + "col" + anchor.x).style.backgroundColor = myHeadColor;
                }else if(nameOfAgent == "O1" || nameOfAgent == "O2"){
                    document.getElementById("row" + anchor.y + "col" + anchor.x).style.backgroundColor = opHeadColor;
                }
                opTilePoint -= mapOfWeight[coordinate.y][coordinate.x];
                mapOfPosition[coordinate.y][coordinate.x] = 0;

                document.getElementById("opTile").innerHTML = opTilePoint;
                opSurroundPoint = calculateSurround(2);
                document.getElementById("opSurround").innerHTML = opSurroundPoint;
                document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurroundPoint;

            }else if(mapOfPosition[coordinate.y][coordinate.x] == 1){
                if(nameOfAgent == "X1" || nameOfAgent == "X2"){
                    document.getElementById("row" + anchor.y + "col" + anchor.x).style.backgroundColor = myHeadColor;
                }else if(nameOfAgent == "O1" || nameOfAgent == "O2"){
                    document.getElementById("row" + anchor.y + "col" + anchor.x).style.backgroundColor = opHeadColor;
                }
                myTilePoint -= mapOfWeight[coordinate.y][coordinate.x];
                mapOfPosition[coordinate.y][coordinate.x] = 0;

                document.getElementById("myTile").innerHTML = myTilePoint;
                mySurroundPoint = calculateSurround(1);
                document.getElementById("mySurround").innerHTML = mySurroundPoint;
                document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurroundPoint;
            }
            flagOfAgent = false;
            // let sss = "";
            // for(let k = 1; k <= m; k++){
            //     sss = "";
            //     for(let l = 1; l <= m; l++){
            //         sss += mapOfPosition[k][l] + "  ";
            //     }
            //     console.log(sss);
            // }
        }
    }
}

function checkClickAllAgent(x, y){
    return (myAgent1.x == x && myAgent1.y == y) || 
        (myAgent2.x == x && myAgent2.y == y) ||
        (oponentAgent1.x == x && oponentAgent1.y == y) ||
        (oponentAgent2.x == x && oponentAgent2.y == y);
}

function addHistoryRemove(coordinate){
    if(nameOfAgent == "X1"){
        if(mapOfPosition[coordinate.y][coordinate.x] == 1){
            myAgent1.history.push([coordinate.x, coordinate.y, "remove", 1]);
            allHistory.push(["X1", coordinate.x, coordinate.y, "remove", 1]);
        }else{
            myAgent1.history.push([coordinate.x, coordinate.y, "remove", 0]);
            allHistory.push(["X1", coordinate.x, coordinate.y, "remove", 0]);
        }
    }else if(nameOfAgent == "X2"){
        if(mapOfPosition[coordinate.y][coordinate.x] == 1){
            myAgent2.history.push([coordinate.x, coordinate.y, "remove", 1]);
            allHistory.push(["X2", coordinate.x, coordinate.y, "remove", 1]);
        }else{
            myAgent2.history.push([coordinate.x, coordinate.y, "remove", 0]);
            allHistory.push(["X2", coordinate.x, coordinate.y, "remove", 0]);
        }
    }else if(nameOfAgent == "O1"){
        if(mapOfPosition[coordinate.y][coordinate.x] == 2){
            oponentAgent1.history.push([coordinate.x, coordinate.y, "remove", 1]);
            allHistory.push(["O1", coordinate.x, coordinate.y, "remove", 1]);
        }else{
            oponentAgent1.history.push([coordinate.x, coordinate.y, "remove", 0]);
            allHistory.push(["O1", coordinate.x, coordinate.y, "remove", 0]);
        }
    }else if(nameOfAgent == "O2"){
        if(mapOfPosition[coordinate.y][coordinate.x] == 2){
            oponentAgent2.history.push([coordinate.x, coordinate.y, "remove", 1]);
            allHistory.push(["O2", coordinate.x, coordinate.y, "remove", 1]);
        }else{
            oponentAgent2.history.push([coordinate.x, coordinate.y, "remove", 0]);
            allHistory.push(["O2", coordinate.x, coordinate.y, "remove", 0]);
        }
    }
}

function calculateSurround(team){
    let surroundPoint = 0;

    for(let i = 1; i <= m; i++){
        for(let j = 0; j <= n; j++){
            if(mapOfPosition[i][j] == team){
                mapStatus[i][j] = 1;
            }else{
                mapStatus[i][j] = 0;
            }
        }
    }

    for(let i = 1; i <= m; i++){
        for(let j = 1; j <= n; j++){
            if(mapStatus[i][j] == 0){
                surroundPoint += spreadingOperation(i, j);
            }
        }
    }

    return surroundPoint;
}

function spreadingOperation(y, x){
    let queue = new Array();
    let surround = 0;
    queue.push({'x': x, 'y': y});
    let pos;
    let check = true;
    while(queue.length != 0){
        pos = queue.shift();
        mapStatus[pos.y][pos.x] = 2;
        if(pos.x == 1 || pos.y == 1 || pos.x == n || pos.y == m){
            check = false;
            
        }
        if(check){
            surround += Math.abs(mapOfWeight[pos.y][pos.x]);
        }
        if(pos.x + 1 <= n){
            if(mapStatus[pos.y][pos.x + 1] == 0){
                queue.push({'x': pos.x + 1, 'y': pos.y});
                mapStatus[pos.y][pos.x + 1] = 2;
            }
        }
        if(pos.x - 1 >= 1){
            if(mapStatus[pos.y][pos.x - 1] == 0){
                queue.push({'x': pos.x - 1, 'y': pos.y});
                mapStatus[pos.y][pos.x - 1] = 2;
            }
        }
        if(pos.y + 1 <= m){
            if(mapStatus[pos.y + 1][pos.x] == 0){
                queue.push({'x': pos.x, 'y': pos.y + 1});
                mapStatus[pos.y + 1][pos.x] = 2;
            }
        }
        if(pos.y >= 1){
            if(mapStatus[pos.y - 1][pos.x] == 0){
                queue.push({'x': pos.x, 'y': pos.y - 1});
                mapStatus[pos.y - 1][pos.x] = 2;
            }
        }
    }
    if(!check){
        return 0;
    }
    return surround;
}

function drawBoardColor(){
    //let color = ['#ffffff', '#b3ffe6', '#66ffcc', '#1affb2', '#00ffaa', '#00e699', '#00cc88', '#00b377', '#009966', '#008055', '#006644', '#004d33'];
    let color = ['#ffffff', '#e6ffff', '#ccffff', '#b3ffff', '#99ffff', '#66ffff', '#33ffff', '#00ffff', '#00cccc'];
    let html = "<table>";
    // for(let i = 1; i <= m; i++){
    //     html += "<tr>";
    //     for(let j = 1; j <= n; j++){
    //         html += "<td id='vrow" + i + "col" + j +"' style='background-color: " + color[Math.round((mapOfWeight[i][j] + 16)/4)] + ";'>" + mapOfWeight[i][j] + "</td>";
    //     }
    //     html += "</tr>";
    // }
    // html += "</table>";
    
    if(directionOfSide){
        for(let i = 1; i <= n; i++){
            html += "<tr>";
            for(let j = 1; j <= m; j++){
                html += "<td id='vrow" + (m + 1 - j) + "col" + i + "' style='background-color: " + color[Math.round((mapOfWeight[j][i] + 16) / 4)] + ";'>" + mapOfWeight[j][i] + "</td>";
            }
            html += "<tr>";
        }
    }else{
        for(let i = n; i >= 1; i--){
            html += "<tr>";
            for(let j = 1; j <= m; j++){
                html += "<td id='vrow" + j + "col" + i + "' style='background-color: " + color[Math.round((mapOfWeight[j][i] + 16) / 4)] + ";'>" + mapOfWeight[j][i] + "</td>";
            }
            html += "<tr>";
        }
    }
    html + "<table>"

    document.getElementById('boardColor').innerHTML = html;
}

function nextTurn(){
    turn++;
    document.getElementById('displayTurn').innerHTML = turn;
}

function undoGame(){
    if(allHistory.length > 0){
        let lastestAction = allHistory.pop();
        if(lastestAction[0] == "X1"){
            if(lastestAction[3] == "move"){
                document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).innerHTML = "X1";
                document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = myHeadColor;
                document.getElementById("row" + myAgent1.y + "col" + myAgent1.x).innerHTML = mapOfWeight[myAgent1.y][myAgent1.x];
                document.getElementById("row" + myAgent1.y + "col" + myAgent1.x).style.backgroundColor = "#ffffcc";
                mapOfPosition[myAgent1.y][myAgent1.x] = 0;
                myTilePoint -= mapOfWeight[myAgent1.y][myAgent1.x];
                let mySurroundPoint = calculateSurround(1);
                document.getElementById("myTile").innerHTML = myTilePoint;
                document.getElementById("mySurround").innerHTML = mySurroundPoint;
                document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurroundPoint;
                myAgent1.x = lastestAction[1];
                myAgent1.y = lastestAction[2];
            }else if(lastestAction[3] == "remove"){
                if(lastestAction[4] == 1){
                    //Remove my tile
                    document.getElementById("row" + lastestAction[2] + "col" +lastestAction[1]).style.backgroundColor = myColor;
                    mapOfPosition[lastestAction[2]][lastestAction[1]] = 1;
                    myTilePoint += mapOfWeight[lastestAction[2]][lastestAction[1]];
                    let mySurround = calculateSurround(1);
                    document.getElementById("myTile").innerHTML = myTilePoint;
                    document.getElementById("mySurround").innerHTML = mySurround;
                    document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurround;
                }else{
                    document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = opColor;
                    mapOfPosition[lastestAction[2]][lastestAction[1]] = 2;
                    opTilePoint += mapOfWeight[lastestAction[2]][lastestAction[1]];
                    let opSurround = calculateSurround(2);
                    document.getElementById("opTile").innerHTML = opTilePoint;
                    document.getElementById("opSurround").innerHTML = opSurround;
                    document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurround;
                }
            }
        }else if(lastestAction[0] == "X2"){
            if(lastestAction[3] == "move"){
                document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).innerHTML = "X1";
                document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = myHeadColor;
                document.getElementById("row" + myAgent2.y + "col" + myAgent2.x).innerHTML = mapOfWeight[myAgent2.y][myAgent2.x];
                document.getElementById("row" + myAgent2.y + "col" + myAgent2.x).style.backgroundColor = "#ffffcc";
                mapOfPosition[myAgent2.y][myAgent2.x] = 0;
                myTilePoint -= mapOfWeight[myAgent2.y][myAgent2.x];
                let mySurroundPoint = calculateSurround(1);
                document.getElementById("myTile").innerHTML = myTilePoint;
                document.getElementById("mySurround").innerHTML = mySurroundPoint;
                document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurroundPoint;
                myAgent2.x = lastestAction[1];
                myAgent2.y = lastestAction[2];
            }else if(lastestAction[3] == "remove"){
                if(lastestAction[4] == 1){
                    document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = myColor;
                    mapOfPosition[lastestAction[2]][lastestAction[1]] = 1;
                    myTilePoint += mapOfWeight[lastestAction[2]][lastestAction[1]];
                    let mySurround = calculateSurround(1);
                    document.getElementById("myTile").innerHTML = myTilePoint;
                    document.getElementById("mySurround").innerHTML = mySurround;
                    document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurround;
                }else{
                    document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = opColor;
                    mapOfPosition[lastestAction[2]][lastestAction[1]] = 2;
                    opTilePoint += mapOfWeight[lastestAction[2]][lastestAction[1]];
                    let opSurround = calculateSurround(2);
                    document.getElementById("opTile").innerHTML = opTilePoint;
                    document.getElementById("opSurround").innerHTML = opSurround;
                    document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurround;
                }
            }
        }else if(lastestAction[0] == "O1"){
            if(lastestAction[3] == "move"){
                document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).innerHTML = "O1";
                document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = opHeadColor;
                document.getElementById("row" + oponentAgent1.y + "col" + oponentAgent1.x).innerHTML = mapOfWeight[oponentAgent1.y][oponentAgent1.x];
                document.getElementById("row" + oponentAgent1.y + "col" + oponentAgent1.x).style.backgroundColor = "#ffffcc";
                mapOfPosition[oponentAgent1.y][oponentAgent1.x] = 0;
                opTilePoint -= mapOfWeight[oponentAgent1.y][oponentAgent1.x];
                let opSurroundPoint = calculateSurround(2);
                document.getElementById("opTile").innerHTML = opTilePoint;
                document.getElementById("opSurround").innerHTML = opSurroundPoint;
                document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurroundPoint;
                oponentAgent1.x = lastestAction[1];
                oponentAgent1.y = lastestAction[2];
            }else if(lastestAction[3] == "remove"){
                if(lastestAction[4] == 1){
                    document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = opColor;
                    mapOfPosition[lastestAction[2]][lastestAction[1]] = 2;
                    opTilePoint += mapOfWeight[lastestAction[2]][lastestAction[1]];
                    let opSurround = calculateSurround(2);
                    document.getElementById("opTile").innerHTML = opTilePoint;
                    document.getElementById("opSurround").innerHTML = opSurround;
                    document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurround;
                }else{
                    document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = myColor;
                    mapOfPosition[lastestAction[2]][lastestAction[1]] = 1;
                    myTilePoint += mapOfWeight[lastestAction[2]][lastestAction[1]];
                    let mySurround = calculateSurround(1);
                    document.getElementById("myTile").innerHTML = myTilePoint;
                    document.getElementById("mySurround").innerHTML = mySurround;
                    document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurround;
                }
            }
        }else if(lastestAction[0] == "O2"){
            if(lastestAction[3] == "move"){
                document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).innerHTML = "O2";
                document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = opHeadColor;
                document.getElementById("row" + oponentAgent2.y + "col" + oponentAgent2.x).innerHTML = mapOfWeight[oponentAgent2.y][oponentAgent2.x];
                document.getElementById("row" + oponentAgent2.y + "col" + oponentAgent2.x).style.backgroundColor = "#ffffcc";
                mapOfPosition[oponentAgent2.y][oponentAgent2.x] = 0;
                opTilePoint -= mapOfWeight[oponentAgent2.y][oponentAgent2.x];
                let opSurroundPoint = calculateSurround(2);
                document.getElementById("opTile").innerHTML = opTilePoint;
                document.getElementById("opSurround").innerHTML = opSurroundPoint;
                document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurroundPoint;
                oponentAgent2.x = lastestAction[1];
                oponentAgent2.y = lastestAction[2];
            }else if(lastestAction[3] == "remove"){
                if(lastestAction[4] == 1){
                    document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = opColor;
                    mapOfPosition[lastestAction[2]][lastestAction[1]] = 2;
                    opTilePoint += mapOfWeight[lastestAction[2]][lastestAction[1]];
                    let opSurround = calculateSurround(2);
                    document.getElementById("opTile").innerHTML = opTilePoint;
                    document.getElementById("opSurround").innerHTML = opSurround;
                    document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurround;
                }else{
                    document.getElementById("row" + lastestAction[2] + "col" + lastestAction[1]).style.backgroundColor = myColor;
                    mapOfPosition[lastestAction[2]][lastestAction[1]] = 1;
                    myTilePoint += mapOfWeight[lastestAction[2]][lastestAction[1]];
                    let mySurround = calculateSurround(1);
                    document.getElementById("myTile").innerHTML = myTilePoint;
                    document.getElementById("mySurround").innerHTML = mySurround;
                    document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurround;
                }
            }
        }
    }
}

function undoAgent(){
    console.log("undo");
    console.log(this.id);
    if(this.id == "btn-undo-x1"){
        if(myAgent1.history.length > 0){
            console.log("length: " + myAgent1.history.length);
            let lastestAction = myAgent1.history.pop();
            console.log(lastestAction);
            if(lastestAction[2] == "move"){
                document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).innerHTML = "X1";
                document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = myHeadColor;
                document.getElementById("row" + myAgent1.y + "col" + myAgent1.x).innerHTML = mapOfWeight[myAgent1.y][myAgent1.x];
                document.getElementById("row" + myAgent1.y + "col" + myAgent1.x).style.backgroundColor = "#ffffcc";
                mapOfPosition[myAgent1.y][myAgent1.x] = 0;
                myTilePoint -= mapOfWeight[myAgent1.y][myAgent1.x];
                let mySurroundPoint = calculateSurround(1);
                document.getElementById("myTile").innerHTML = myTilePoint;
                document.getElementById("mySurround").innerHTML = mySurroundPoint;
                document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurroundPoint;
                myAgent1.x = lastestAction[0];
                myAgent1.y = lastestAction[1];
            }else if(lastestAction[2] == "remove"){
                if(lastestAction[3] == 1){
                    //Remove my tile
                    document.getElementById("row" + lastestAction[1] + "col" +lastestAction[0]).style.backgroundColor = myColor;
                    mapOfPosition[lastestAction[1]][lastestAction[0]] = 1;
                    myTilePoint += mapOfWeight[lastestAction[1]][lastestAction[0]];
                    let mySurround = calculateSurround(1);
                    document.getElementById("myTile").innerHTML = myTilePoint;
                    document.getElementById("mySurround").innerHTML = mySurround;
                    document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurround;
                }else{
                    document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = opColor;
                    mapOfPosition[lastestAction[1]][lastestAction[0]] = 2;
                    opTilePoint += mapOfWeight[lastestAction[1]][lastestAction[0]];
                    let opSurround = calculateSurround(2);
                    document.getElementById("opTile").innerHTML = opTilePoint;
                    document.getElementById("opSurround").innerHTML = opSurround;
                    document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurround;
                }
            }
        }
    }else if(this.id == "btn-undo-x2"){
        if(myAgent2.history.length > 0){
            console.log("length: " + myAgent2.history.length);
            let lastestAction = myAgent2.history.pop();
            console.log(lastestAction);
            if(lastestAction[2] == "move"){
                document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).innerHTML = "X1";
                document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = myHeadColor;
                document.getElementById("row" + myAgent2.y + "col" + myAgent2.x).innerHTML = mapOfWeight[myAgent2.y][myAgent2.x];
                document.getElementById("row" + myAgent2.y + "col" + myAgent2.x).style.backgroundColor = "#ffffcc";
                mapOfPosition[myAgent2.y][myAgent2.x] = 0;
                myTilePoint -= mapOfWeight[myAgent2.y][myAgent2.x];
                let mySurroundPoint = calculateSurround(1);
                document.getElementById("myTile").innerHTML = myTilePoint;
                document.getElementById("mySurround").innerHTML = mySurroundPoint;
                document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurroundPoint;
                myAgent2.x = lastestAction[0];
                myAgent2.y = lastestAction[1];
            }else if(lastestAction[2] == "remove"){
                if(lastestAction[3] == 1){
                    document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = myColor;
                    mapOfPosition[lastestAction[1]][lastestAction[0]] = 1;
                    myTilePoint += mapOfWeight[lastestAction[1]][lastestAction[0]];
                    let mySurround = calculateSurround(1);
                    document.getElementById("myTile").innerHTML = myTilePoint;
                    document.getElementById("mySurround").innerHTML = mySurround;
                    document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurround;
                }else{
                    document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = opColor;
                    mapOfPosition[lastestAction[1]][lastestAction[0]] = 2;
                    opTilePoint += mapOfWeight[lastestAction[1]][lastestAction[0]];
                    let opSurround = calculateSurround(2);
                    document.getElementById("opTile").innerHTML = opTilePoint;
                    document.getElementById("opSurround").innerHTML = opSurround;
                    document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurround;
                }
            }
        }
    }else if(this.id == "btn-undo-o1"){
        if(oponentAgent1.history.length > 0){
            let lastestAction = oponentAgent1.history.pop();
            console.log(lastestAction);
            if(lastestAction[2] == "move"){
                document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).innerHTML = "O1";
                document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = opHeadColor;
                document.getElementById("row" + oponentAgent1.y + "col" + oponentAgent1.x).innerHTML = mapOfWeight[oponentAgent1.y][oponentAgent1.x];
                document.getElementById("row" + oponentAgent1.y + "col" + oponentAgent1.x).style.backgroundColor = "#ffffcc";
                mapOfPosition[oponentAgent1.y][oponentAgent1.x] = 0;
                opTilePoint -= mapOfWeight[oponentAgent1.y][oponentAgent1.x];
                let opSurroundPoint = calculateSurround(2);
                document.getElementById("opTile").innerHTML = opTilePoint;
                document.getElementById("opSurround").innerHTML = opSurroundPoint;
                document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurroundPoint;
                oponentAgent1.x = lastestAction[0];
                oponentAgent1.y = lastestAction[1];
            }else if(lastestAction[2] == "remove"){
                if(lastestAction[3] == 1){
                    document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = opColor;
                    mapOfPosition[lastestAction[1]][lastestAction[0]] = 2;
                    opTilePoint += mapOfWeight[lastestAction[1]][lastestAction[0]];
                    let opSurround = calculateSurround(2);
                    document.getElementById("opTile").innerHTML = opTilePoint;
                    document.getElementById("opSurround").innerHTML = opSurround;
                    document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurround;
                }else{
                    document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = myColor;
                    mapOfPosition[lastestAction[1]][lastestAction[0]] = 1;
                    myTilePoint += mapOfWeight[lastestAction[1]][lastestAction[0]];
                    let mySurround = calculateSurround(1);
                    document.getElementById("myTile").innerHTML = myTilePoint;
                    document.getElementById("mySurround").innerHTML = mySurround;
                    document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurround;
                }
            }
        }
    }else if(this.id == "btn-undo-o2"){
        if(oponentAgent2.history.length > 0){
            console.log("length: " + oponentAgent2.history.length);
            let lastestAction = oponentAgent2.history.pop();
            console.log(lastestAction);
            if(lastestAction[2] == "move"){
                document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).innerHTML = "O2";
                document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = opHeadColor;
                document.getElementById("row" + oponentAgent2.y + "col" + oponentAgent2.x).innerHTML = mapOfWeight[oponentAgent2.y][oponentAgent2.x];
                document.getElementById("row" + oponentAgent2.y + "col" + oponentAgent2.x).style.backgroundColor = "#ffffcc";
                mapOfPosition[oponentAgent2.y][oponentAgent2.x] = 0;
                opTilePoint -= mapOfWeight[oponentAgent2.y][oponentAgent2.x];
                let opSurroundPoint = calculateSurround(2);
                document.getElementById("opTile").innerHTML = opTilePoint;
                document.getElementById("opSurround").innerHTML = opSurroundPoint;
                document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurroundPoint;
                oponentAgent2.x = lastestAction[0];
                oponentAgent2.y = lastestAction[1];
            }else if(lastestAction[2] == "remove"){
                if(lastestAction[3] == 1){
                    document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = opColor;
                    mapOfPosition[lastestAction[1]][lastestAction[0]] = 2;
                    opTilePoint += mapOfWeight[lastestAction[1]][lastestAction[0]];
                    let opSurround = calculateSurround(2);
                    document.getElementById("opTile").innerHTML = opTilePoint;
                    document.getElementById("opSurround").innerHTML = opSurround;
                    document.getElementById("opTotalPoint").innerHTML = opTilePoint + opSurround;
                }else{
                    document.getElementById("row" + lastestAction[1] + "col" + lastestAction[0]).style.backgroundColor = myColor;
                    mapOfPosition[lastestAction[1]][lastestAction[0]] = 1;
                    myTilePoint += mapOfWeight[lastestAction[1]][lastestAction[0]];
                    let mySurround = calculateSurround(1);
                    document.getElementById("myTile").innerHTML = myTilePoint;
                    document.getElementById("mySurround").innerHTML = mySurround;
                    document.getElementById("myTotalPoint").innerHTML = myTilePoint + mySurround;
                }
            }
        }
    }
}

function changeStatusSuggest(){
    if(statusSuggest == 1){
        statusSuggest = 0;
        document.getElementById("btn-change").innerHTML = "Turn on";
        document.getElementById("displayStatus").innerHTML = "Suggest Mode: OFF";
        document.getElementById("next").removeEventListener('click', getSuggest);
        drawBoardColor();
    }else{
        statusSuggest = 1;
        document.getElementById("btn-change").innerHTML = "Turn off";
        document.getElementById("displayStatus").innerHTML = "Suggest Mode: <span style='color: green;'>ON</span>";
        document.getElementById("next").addEventListener('click', getSuggest);
    }
}

function changeStatusGreedy(){
    if(statusSuggest == 1){
        statusSuggest = 0;
        document.getElementById("btn-change2").innerHTML = "Turn on";
        document.getElementById("displayStatus2").innerHTML = "Greedy Mode: OFF";
        document.getElementById("next").removeEventListener('click', suggest);
        drawBoardColor();
    }else{
        statusSuggest = 1;
        document.getElementById("btn-change2").innerHTML = "Turn off";
        document.getElementById("displayStatus2").innerHTML = "Greedy Mode: <span style='color: green;'>ON</span>";
        document.getElementById("next").addEventListener('click', suggest);
    }
}

function getSuggest(){
    let stateGame = {
        "m": m,
        "n": n,
        "mapOfWeight": mapOfWeight,
        "mapOfPosition": mapOfPosition,
        "myAgent1": {
            "x": myAgent1.x,
            "y": myAgent1.y
        },
        "myAgent2": {

            "x": myAgent2.x,
            "y": myAgent2.y
        },
        "opAgent1": {
            "x": oponentAgent1.x,
            "y": oponentAgent1.y
        },
        "opAgent2": {
            "x": oponentAgent2.x,
            "y": oponentAgent2.y
        },
        "nb_turn": turn
    }

    //Remove color
    drawBoardColor();

    //document.cookie = "username=" + JSON.stringify(stateGame);
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //Document render
            if(this.responseText == ""){
                console.log("none");
            }else{
                console.log(JSON.parse(this.responseText));
                let goDirect = JSON.parse(this.responseText);
                document.getElementById("vrow" + myAgent1.y + "col" + myAgent1.x).style.backgroundColor = myHeadColor;
                document.getElementById("vrow" + myAgent2.y + "col" + myAgent2.x).style.backgroundColor = myHeadColor;
                document.getElementById("vrow" + goDirect[0][1] + "col" + goDirect[0][0]).style.backgroundColor = myColor;
                document.getElementById("vrow" + goDirect[1][1] + "col" + goDirect[1][0]).style.backgroundColor = myColor;
            }
        }
    }
    xhttp.open("get", "/get-suggest", true);
    xhttp.setRequestHeader("data", JSON.stringify(stateGame));
    xhttp.send(null);
}
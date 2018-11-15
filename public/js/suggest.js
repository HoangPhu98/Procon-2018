var maxPoint;
var maxDeep = 5;

function Node(data){
    this.data = data;
    this.x = 0;
    this.y = 0;
    this.parent = null;
    this.children = [];
    this.point = 0;
}

function Tree(data){
    var node = new Node(data);
    node.point = 0;
    this._root = node;
}

function copyTwoDementionArray(src){
    let dst = [];
    for(let i = 0; i < src.length; i++){
        dst.push(src[i].slice());
    }
    return dst;
}

function reFillColor(){
    let color = ['#ffffff', '#e6ffff', '#ccffff', '#b3ffff', '#99ffff', '#66ffff', '#33ffff', '#00ffff', '#00cccc'];
    for(let i = 1; i <= m; i++){
        for(let j = 1; j <= n; j++){
            document.getElementById('vrow' + i + 'col' + j).style.backgroundColor = color[Math.round((mapOfWeight[i][j] + 16)/4)];
        }
    }
    document.getElementById('vrow' + myAgent1.y + 'col' + myAgent1.x).style.backgroundColor = '#ff6600';
    document.getElementById('vrow' + myAgent2.y + 'col' + myAgent2.x).style.backgroundColor = '#ff6600';
}

function suggest(){
    console.log("process suggest");
    reFillColor();
    //var vmapOfPosition = mapOfPosition.slice();
    var vmapOfPosition = copyTwoDementionArray(mapOfPosition);
    //console.log("begin: " + mapOfPosition[5][5])
    //vmapOfPosition[5][5] = 10;
    //console.log("expect: 10 = " + mapOfPosition[5][5]);
    let tree = new Tree(vmapOfPosition);
    let x1 = myAgent1.x;
    let y1 = myAgent1.y;
    let x2 = myAgent2.x;
    let y2 = myAgent2.y;

    maxPoint = new Node(vmapOfPosition);

    createAway(tree._root, x1, y1, 0);
    
    let index = 0;
    let currentNode = maxPoint;
    let color = ['#ffd1b3', '#ffc299', '#ffb380', '#ffa366', '#ff944d', '#ff8533'];
    while(index < maxDeep){
        document.getElementById('vrow' + currentNode.y + 'col' + currentNode.x).style.backgroundColor = color[index];
        index++;
        currentNode = currentNode.parent;
    }
    

    let tree2 = new Tree(maxPoint.data);
    maxPoint = new Node(maxPoint.data);
    createAway(tree2._root, x2, y2, 0);

    index = 0;
    currentNode = maxPoint;
    while(index < maxDeep){
        document.getElementById('vrow' + currentNode.y + 'col' + currentNode.x).style.backgroundColor = color[index];
        index++;
        currentNode = currentNode.parent;
    }
}

function createAway(currentNode, x, y, deep){
    let directions = [
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1 , -1]
    ];


    if(deep < maxDeep){
        directions.forEach(function(e){
            if(x + e[0] >= 1 && x + e[0] <= n && y + e[1] >= 1 && y + e[1] <= m){
                let vmPositon = copyTwoDementionArray(currentNode.data);
                let vPoint = 0;
                if(vmPositon[y + e[1]][x + e[0]] != 1){
                    if((y + e[1] == 1 || y + e[1] == m) && (x + e[0] == 1 || x + e[0] == n)){
                        if(max_point > 5){
                            vPoint += 1;
                        }else if(max_point > 10){
                            vPoint += 2;
                        }
                    }else if(y + e[1] == 1 || y + e[1] == m || x + e[0] == 1 || x + e[0] == n){
                        if(max_point > 10){
                            vPoint += 1;
                        }
                    }
                    //if(mapOfWeight)
                    // if(mapOfWeight[y + e[1]][x + e[0]] >= 14){
                    //     vPoint += 15;
                    // }else if(mapOfWeight[y + e[1]][x + e[0] >= 11]){
                    //     vPoint += 12;
                    // }else if(mapOfWeight[y + e[1]][x + e[0]] >= 8){
                    //     vPoint += 9;
                    // }else if(mapOfWeight[y + e[1]][x + e[0]] >= 5){
                    //     vPoint += 6;
                    // }else if(mapOfWeight[y + e[1]][x + e[0]] >= 2){
                    //     vPoint += 3;
                    // }else if(mapOfWeight[y + e[1]][x + e[0]] >= -1){
                    //     vPoint += 0;
                    // }else if(mapOfWeight[y + e[1]][x + e[0]] >= -4){
                    //     vPoint += -3;
                    // }else if(mapOfWeight[y + e[1]][x + e[0]] >= -7){
                    //     vPoint += -6;
                    // }else if(mapOfWeight[y + e[1]][x + e[0]] >= -10){
                    //     vPoint += -9;
                    // }else if(mapOfWeight[y + e[1]][x + e[0]] >= -13){
                    //     vPoint += - 12;
                    // }else{
                    //     vPoint +- 15;
                    // }
                    vPoint += mapOfWeight[y + e[1]][x + e[0]];
                }
                if(vmPositon[y + e[1]][x + e[0]] == 0){
                    vmPositon[y + e[1]][x + e[0]] = 1;
                }else if(vmPositon[y + e[1]][x + e[0]] == 1){
                    vmPositon[y + e[1]][x + e[0]] = 1;
                    vPoint += -1;
                }else{
                    vmPositon[y + e[1]][x + e[0]] = 0;
                    vPoint += -2;
                }
                
                //Use surround point
                //change Turn
                if(turn > 1){
                    maxDeep = 5;
                    let myCurrentSurround = calculateSurroundMap(1, currentNode.data);
                    let myNextSurround = calculateSurroundMap(1, vmPositon);
                    if(myNextSurround > myCurrentSurround){
                        vPoint += parseInt((myNextSurround - myCurrentSurround) * 75 / 100);
                    }else if(myNextSurround < myCurrentSurround){
                        vPoint -= myCurrentSurround - myNextSurround;
                    }
                    let sideSurround = calculateSurroundMap(2, currentNode.data); 
                    if(sideSurround > 0){
                        vPoint += sideSurround - calculateSurroundMap(2, vmPositon) + 2;
                    }
                }else{
                    maxDeep = 5;
                }

                let node = new Node(vmPositon);
                node.parent = currentNode;
                node.point = currentNode.point + vPoint;
                node.x = x + e[0];
                node.y = y + e[1];
                if(maxPoint.point < node.point){
                    maxPoint = node;
                }
                currentNode.children.push(node);
                if(vmPositon[y + e[1]][x + e[0]] == 0){
                    createAway(node, x, y, deep + 1);
                }else{
                    createAway(node, x + e[0], y + e[1], deep + 1);
                }
            }
        });
    }
}

function calculateSurroundMap(team, vmapPosition){
    let surroundPoint = 0;

    for(let i = 1; i <= m; i++){
        for(let j = 0; j <= n; j++){
            if(vmapPosition[i][j] == team){
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
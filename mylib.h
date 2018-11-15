#include <vector>
#include <queue>
#include <limits.h>
#include <unordered_map>

#define NUM_OF_AGENTS 4

using namespace std;
enum AGENT {
    MY_AGENT_1,
    OP_AGENT_1,
    MY_AGENT_2,
    OP_AGENT_2
};
enum ACTION {
    MOVE,
    REMOVE,
    STAY,
};

struct Agent{
    int8_t x;
    int8_t y;
};

struct Step {
    int value;
    int parVal;
    int V;
    int8_t x, y;
    AGENT agent;
    int8_t flag[9][12];
    int8_t n, m;
    ACTION act;
    int8_t curColor;
    Step* parent;
    Step* child;
    ~Step(){
        delete child;
    }
    Step(AGENT a,  int8_t x, int8_t y, Step &par, int8_t v){
        agent = a;
        parent = NULL;
        child = NULL;
        this->x = x;
        this->y = y;

        this->n = par.n;
        this->m = par.m;
        for (int8_t i = 0; i < m; i++){
            for (int8_t j = 0; j < n; j++){
                flag[i][j] = par.flag[i][j];
            }
        }
        curColor = flag[y][x];
        value = v;
        parVal = par.value;
        switch(agent){
        case OP_AGENT_1:
        case OP_AGENT_2:
            // +TH xoa quan minh: xet them trong so, neu am thi xoa, > 0 thi di
            if (flag[y][x] == 2) {
                if (v < 0) {
                    ;//flag[y][x] = 0;
                    act = REMOVE;
                    //value = v;
                }else act = MOVE;
            }//else value = -v;
            if (flag[y][x] == 0) act = MOVE;
            // +Khi xoa thi vi tri agent khong doi
            if (flag[y][x] == 1) {
                //flag[y][x] = 0;
                act = REMOVE;
            }
            break;
        case MY_AGENT_1:
        case MY_AGENT_2:
            if (flag[y][x] == 1) {
                if (v < 0) {
                    //flag[y][x] = 0;
                    act = REMOVE;
                    //value = -v;
                }else act = MOVE;
            }
            if (flag[y][x] == 0) act = MOVE;
            if (flag[y][x] == 2) {
                act = REMOVE;
            }
            break;
        }
    }
    Step(int8_t f[][12], int8_t n, int8_t m){
        this->n = n;
        this->m = m;
        parent = NULL;
        child = NULL;
        for (int8_t i = 0; i < m; i++){
            for (int8_t j = 0; j < n; j++){
                flag[i][j] = f[i][j];
            }
        }
        value = 0;
    }
    int calcValue(Step &par){
        return par.value+this->value;
    }

    void perform(){
        switch (act){
        case MOVE:
            if (agent == MY_AGENT_1 || agent == MY_AGENT_2){
                if (flag[y][x] == 0){
                    flag[y][x] = 1;
                    value += parVal;
                } else if (flag[y][x] == 1){
                    value = parVal;
                }
            } else {
                if (flag[y][x] == 0){
                    flag[y][x] = 2;
                    value = parVal - value;
                } else if (flag[y][x] == 2){
                    value = parVal;
                }
            }
            break;
        case REMOVE:

            if (flag[y][x] == 1){
                value = parVal - value;
            } else if (flag[y][x] == 2){
                value = parVal + value;
            }
            flag[y][x] = 0;
            break;
        case STAY:
            value = parVal;
        }
        curColor = flag[y][x];
    }
    void paint(Step &prevMove){
        flag[prevMove.y][prevMove.x] = prevMove.curColor;
    }

};

struct AI{
    int8_t mapFlag[12][12];
    int8_t score[12][12];
    int8_t n, m;
    int8_t depth;
    Agent myAgent1, myAgent2, opAgent1, opAgent2;
    int maxValue;
    Step* root;
    int stepCnt = 1;
    Agent* agents[NUM_OF_AGENTS];
    pair<int8_t, int8_t> prevCood[4][NUM_OF_AGENTS];
    Step* steps[4][NUM_OF_AGENTS];
    pair<int, int> sugAgent1, sugAgent2;
    int8_t real_turn;

    // + int turn
    AI(int8_t depth, int8_t m, int8_t n, int8_t map[][12], int8_t flag[][12], Agent myA1, Agent myA2, Agent opA1, Agent opA2, int8_t _turn){
        this->depth = depth;
        this->n = n;
        this->m = m;
        this->real_turn = _turn;
        for(int i = 0; i < m; i++){
            for(int j = 0; j < n; j++){
                mapFlag[i][j] = flag[i][j];
                score[i][j] = map[i][j];
            }
        }
        //moves = depth%NUM_OF_AGENTS;
        myAgent1 = myA1;
        myAgent2 = myA2;
        opAgent1 = opA1;
        opAgent2 = opA2;
        agents[0] = &myAgent1;
        agents[1] = &opAgent1;
        agents[2] = &myAgent2;
        agents[3] = &opAgent2;
        root = new Step(mapFlag, n, m);
        int alpha = INT_MIN, beta = INT_MAX;

        maxValue = buildMinimaxTree(0, root, alpha, beta);

        out();
    }
    ~AI(){
        delete root;
    }

    //void evaluate(flagMap, agent1..agent4, turn)
    int evaluate(int8_t flagMap[][12], int8_t this_turn){
        int eval = 0;
        if(this_turn < 25){
            for(int i = 0; i < m; i ++){
                for(int j = 0; j < n; j++){
                    if((i == 0 && j == 0) || (i == 0 && j == n-1) || (i == m-1 && j == n-1) || (i == m-1 && j == 0)){
                        if(flagMap[i][j] == 1){
                            eval += 2;
                        }else if(flagMap[i][j] == 2){
                            eval -= 2;
                        }
                    }else if(i == 0 || j == 0 || i == m-1 || j == n-1){
                        if(flagMap[i][j] == 1){
                            eval += 1;
                        }else if(flagMap[i][j] == 2){
                            eval -= 1;
                        }
                    }
                }
            }
        }

        int tilePoint = 0;
        for(int i = 0; i < m; i++){
            for(int j = 0; j < n; j++){
                if(flagMap[i][j] == 1){
                    tilePoint += score[i][j];
                }else if(flagMap[i][j] == 2){
                    tilePoint -= score[i][j];
                }
            }
        }

        int mySurroundPoint = 0;
        int opSurroundPoint = 0;
        if(this_turn > 30){
            mySurroundPoint = calcSurrounded(1, flagMap);
            opSurroundPoint = calcSurrounded(2, flagMap);
        }
        return tilePoint + eval + (mySurroundPoint - opSurroundPoint);
    }



    int buildMinimaxTree(int8_t d, Step *s, int alpha, int beta){
        if (d == depth){
            return evaluate(s->flag, this->real_turn);
        }
        Agent* tmp;
        AGENT turn;
        int V;
        switch(d%NUM_OF_AGENTS){
        case MY_AGENT_1:
            tmp = &myAgent1;
            turn = MY_AGENT_1;
            V = INT_MIN;
            break;
        case MY_AGENT_2:
            tmp = &myAgent2;
            turn = MY_AGENT_2;
            V = INT_MIN;
            break;
        case OP_AGENT_1:
            tmp = &opAgent1;
            turn = OP_AGENT_1;
            V = INT_MAX;
            break;
        case OP_AGENT_2:
            tmp = &opAgent2;
            turn = OP_AGENT_2;
            V = INT_MAX;
            break;
        }
        Agent curAgent = *tmp;
        pair<int8_t, int8_t> pc(curAgent.x, curAgent.y);
        prevCood[d/NUM_OF_AGENTS][turn] = pc;
        for (int8_t i = curAgent.y-1; i <= curAgent.y+1; i++){
            if (i < 0 || i >= m) continue;
            for (int8_t j = curAgent.x-1; j <= curAgent.x+1; j++){
                if (j < 0 || j >= n) continue;
                // +Cat bo truong hop xay ra xung dot
                Step* st = new Step(turn, j, i, *s, score[i][j]);
                if (j == curAgent.x && i == curAgent.y) (*st).act = STAY;

                if ((*st).act == MOVE){
                    (*tmp).x = j;
                    (*tmp).y = i;
                }
                //agents[turn] = tmp;
                steps[d/NUM_OF_AGENTS][turn] = st;
                //(*st).print();
                //checkCollision
                if (turn == 3){
                    detectCollision(d/NUM_OF_AGENTS);
                    perform(d/NUM_OF_AGENTS);
                }
                
               // perform();
                int v = buildMinimaxTree(d+1,st,alpha, beta);
                (*tmp).x = curAgent.x;
                (*tmp).y = curAgent.y;
                //(*st).print();
                if (turn == MY_AGENT_1 || turn == MY_AGENT_2){ //MAX
                    if (v > V) {
                        V = v;
                        (*st).parent = s;
                        if ((*s).child) delete (*s).child;
                        (*s).child = st;
                        (*st).V = v;
                        stepCnt++;

                    }
                    if (v >= beta) return V;
                    if (v > alpha) alpha = v;

                } else { //MIN
                    if (v < V) {
                        V = v;
                        (*st).parent = s;
                        if ((*s).child) delete (*s).child;
                        (*s).child = st;
                        (*st).V = v;
                        stepCnt++;

                    }
                    if (v <= alpha) return V;
                    if (v < beta) beta = v;
                }
                if (!(*st).parent) {
                    //(*st).print();
                    delete st;
                }
               // printf("%d %d %d\n", turn, j, i);
                //(*st).print();

            }
        }
        return V;
    }
    /*
    * This function is to check if there are any collision in current turn
    * If collisions are found out, they will be handled by handler functions
    */
    void detectCollision(int moveNo){

        for (int i = 0; i < NUM_OF_AGENTS; i++){
            for (int j = i+1; j < NUM_OF_AGENTS; j++){
                if ((*steps[moveNo][i]).x == (*steps[moveNo][j]).x && (*steps[moveNo][i]).y == (*steps[moveNo][j]).y){
                    // detect collision type 1 between agents[i] and agents[j]
                    //cout << "handler 1 " << i << j << endl;
                    handle_type_1(i, j, moveNo);
                } else if ((*steps[moveNo][i]).x == (*agents[j]).x && (*steps[moveNo][i]).y == (*agents[j]).y){
                    //cout << "handler 2" << i << j << endl;
                    handle_type_3(i, moveNo);
                } else if ((*steps[moveNo][j]).x == (*agents[i]).x && (*steps[moveNo][j]).y == (*agents[i]).y){
                    //cout << "handler 2" << i << j << endl;
                    handle_type_3(j, moveNo);
                }
            }
        }
    }
    /*
    * The first collision handler function
    * Called when 2 agents move to 1 position
    * @Input: position of 2 agents in agents array
    * @Output: 2 agents maintain their position and their moving is disabled
    */
    void handle_type_1(int a1, int a2, int moveNo){

        (*agents[a1]).x = prevCood[moveNo][a1].first;
        (*agents[a1]).y = prevCood[moveNo][a1].second;
        (*agents[a2]).x = prevCood[moveNo][a2].first;
        (*agents[a2]).y = prevCood[moveNo][a2].second;
        // and stay still
        (*steps[moveNo][a1]).act = STAY;
        (*steps[moveNo][a2]).act = STAY;
        // Their moves is disabled
        /*for (int i = a1; i < NUM_OF_AGENTS; i++){
            (*steps[moveNo][i]).flag[(*steps[moveNo][a1]).y][(*steps[moveNo][a1]).x] = (*steps[moveNo][a1]).prevColor;
        }*/
        (*steps[moveNo][a1]).x = prevCood[moveNo][a1].first;
        (*steps[moveNo][a1]).y = prevCood[moveNo][a1].second;
        (*steps[moveNo][a2]).x = prevCood[moveNo][a2].first;
        (*steps[moveNo][a2]).y = prevCood[moveNo][a2].second;
    }

    void handle_type_3(int a1, int moveNo){
        (*steps[moveNo][a1]).act = STAY;
        (*steps[moveNo][a1]).x = prevCood[moveNo][a1].first;
        (*steps[moveNo][a1]).y = prevCood[moveNo][a1].second;
    }

    void perform(int moveNo){
        for (int i=0; i < NUM_OF_AGENTS; i++){
               // cout << "Performing " << i << endl;
            (*steps[moveNo][i]).perform();
            for (int j = i+1; j < NUM_OF_AGENTS; j++){
                (*steps[moveNo][j]).paint(*steps[moveNo][i]);
            }
            //(*steps[moveNo][i]).print();
        }
    }

    void out(){
        // for (int i = 0; i < m; i++){
        //     for (int j = 0; j < n; j++){
        //         printf("%d ", mapFlag[i][j]);
        //     }
        //     printf("\n");
        // }
        // printf("%d %d\n", myAgent1.x, myAgent1.y);
        // printf("%d %d\n", myAgent2.x, myAgent2.y);
        // printf("%d %d\n", opAgent1.x, opAgent1.y);
        // printf("%d %d\n", opAgent2.x, opAgent2.y);
        // cout << maxValue << endl;
        //Step* s = root;
        int cnt = 0;
        for (Step* s = root; s; s = (*s).child){
            //cout << cnt << endl;
            //(*s).print();
            pair<int, int> p((*s).x, (*s).y);
            if (cnt-1 == MY_AGENT_1) sugAgent1 = p;
            if (cnt-1 == MY_AGENT_2) sugAgent2 = p;
            cnt++;
        }
    //    cout << cnt << endl;
    //    cout << stepCnt << endl;
    }

    int calcSurrounded(int team, int8_t flag[][12]){
        int8_t tmp[12][12];
        for (int i = 0; i < m; i++){
            for (int j = 0; j < n; j++){
                if (flag[i][j] == team){
                    tmp[i][j] = 1;
                }else{
                    tmp[i][j] = 0;
                }
                
            }
        }
        int s = 0;
        for (int i = 1; i < m-1; i++){
            for (int j = 1; j < n-1; j++){
                if(tmp[i][j] == 0){
                    s += spreading(i, j, tmp);
                }
            }
        }
        return s;
    }

    int spreading(int x, int y, int8_t tmp[][12]){
        queue<int> q;
        int s = 0;
        int check = true;
        //int x = 0, y = 0;
        q.push(x*n+y);
        
        while (!q.empty()){
            int pos = q.front();
            q.pop();
            int i = pos/n, j= pos%n;
            tmp[i][j] = 2;
            
            if (i == 0 || j == 0 || i == m-1 || j == n-1) {
                check = false;
            }
            if (check){ 
                s += abs(score[i][j]);
            }
            if(j + 1 < n){
                if (tmp[i][j+1] == 0) {
                    q.push(i*n+j+1);
                    tmp[i][j+1] = 2;
                }
            }
            if(j - 1 >= 0){
            if (tmp[i][j-1] == 0) {
                q.push(i*n+j-1);
                tmp[i][j-1] = 2;
            }
            }

            if(i + 1 < m){
            if (tmp[i+1][j] == 0) {
                q.push((i+1)*n+j);
                tmp[i+1][j] = 2;
            }
            }

            if(i - 1 >= 0){
            if (tmp[i-1][j] == 0) {
                q.push((i-1)*n+j);
                tmp[i-1][j] = 2;
            }
            }
        }
        
        if(check){
            return s;
            
        }else{
            return 0;
        }
    }
};

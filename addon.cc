#include <node_api.h>
#include <cmath>
#include <vector>
#include <queue>
#include <limits.h>
#include "mylib.h"

int8_t mapOfWeight[12][12];
int8_t m;
int8_t n;
int8_t deep;
int8_t real_turn;

Agent myAgent1, myAgent2, opAgent1, opAgent2;

void minimax(int8_t flagMap[][12], int32_t go_on[4][2]){
    deep = 12;
    AI ai(deep, m, n, mapOfWeight, flagMap, myAgent1, myAgent2, opAgent1, opAgent2, real_turn);
    
    go_on[0][0] = ai.sugAgent1.first + 1;
    go_on[0][1] = ai.sugAgent1.second + 1;
    go_on[1][0] = ai.sugAgent2.first + 1;
    go_on[1][1] = ai.sugAgent2.second + 1;
}


namespace demo{ 
    napi_value Add(napi_env env, napi_callback_info info){
        napi_status status;

        napi_value greeting;
        status = napi_create_string_utf8(env, "Not Bug", NAPI_AUTO_LENGTH, &greeting);
        if(status != napi_ok) return nullptr;

        napi_value ex[13];
        napi_value *argv = ex;
        napi_value thisArg;
        size_t argc = 13;
        void * data;
        /*
        napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
        */
        if(napi_get_cb_info(env, info, &argc, argv, &thisArg, &data) != napi_ok) return nullptr;
        //return argv;

        /*
        napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
        */

        /*
        napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
        */
       //Read 12 input parameters

        //Read m and n
        int32_t m32, n32;
        //return argv[0];
        if(napi_get_value_int32(env, argv[0], &m32) != napi_ok) return nullptr;
        m = m32;
        //return argv[1];
        if(napi_get_value_int32(env, argv[1], &n32) != napi_ok) return nullptr;
        n = n32;


        napi_value row_napi;
        napi_value item_napi;
        int32_t item;
        //Read demention array
        //return argv[2];
        for(int i = 1; i <= m; i++){
            if(napi_get_element(env, argv[2], i, &row_napi) != napi_ok) return nullptr;
            // if(i == 2)
            //     return row_napi;
            for(int j = 1; j <= n; j++){
                if(napi_get_element(env, row_napi, j, &item_napi) != napi_ok) return nullptr;
                // if(j == 3)
                //     return item_napi;
                if(napi_get_value_int32(env, item_napi, &item) != napi_ok) return nullptr;

                mapOfWeight[i-1][j-1] = item;
            }
        }

        int8_t flagMap[m][12];
        for(int i = 1; i <= m; i++){
            if(napi_get_element(env, argv[3], i, &row_napi) != napi_ok) return nullptr;
            for(int j = 1; j <= n; j++){
                if(napi_get_element(env, row_napi, j, &item_napi) != napi_ok) return nullptr;
                if(napi_get_value_int32(env, item_napi, &item) != napi_ok) return nullptr;

                flagMap[i-1][j-1] = item;
            }
        }

        //get position of agent
        if(napi_get_value_int32(env, argv[4], &item) != napi_ok) return nullptr;
        myAgent1.x = item-1;
        if(napi_get_value_int32(env, argv[5], &item) != napi_ok) return nullptr;
        myAgent1.y = item-1;

        if(napi_get_value_int32(env, argv[6], &item) != napi_ok) return nullptr;
        myAgent2.x = item-1;
        if(napi_get_value_int32(env, argv[7], &item) != napi_ok) return nullptr;
        myAgent2.y = item-1;

        if(napi_get_value_int32(env, argv[8], &item) != napi_ok) return nullptr;
        opAgent1.x = item-1;
        if(napi_get_value_int32(env, argv[9], &item) != napi_ok) return nullptr;
        opAgent1.y = item-1;

        if(napi_get_value_int32(env, argv[10], &item) != napi_ok) return nullptr;
        opAgent2.x = item-1;
        if(napi_get_value_int32(env, argv[11], &item) != napi_ok) return nullptr;
        opAgent2.y = item-1;

        if(napi_get_value_int32(env, argv[12], &item) != napi_ok) return nullptr;
        //return argv[12];
        real_turn = item;

        int32_t go_on[2][2];

        minimax(flagMap, go_on);
        /*
        napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
        */

        /*
        napi_status napi_create_array(napi_env env, napi_value* result)
        */
        napi_value result;
        if(napi_create_array(env, &result) != napi_ok) return nullptr;

        /*
        napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
        */
        /*
        napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
        */

        napi_value two_nb;
        napi_value item_x;

        for(int i = 0; i < 2; i++){
            if(napi_create_array(env, &two_nb) != napi_ok) return nullptr;
            for(int j = 0; j < 2; j++){
                if(napi_create_int32(env, go_on[i][j], &item_x) != napi_ok) return nullptr;
                if(napi_set_element(env, two_nb, j, item_x) != napi_ok) return nullptr;
            }
            if(napi_set_element(env, result, i, two_nb) != napi_ok) return nullptr;
        }
        
        return result;
        //return greeting;
    }

    napi_value init(napi_env env, napi_value exports){
        napi_status status;
        napi_value fn;

        status = napi_create_function(env, nullptr, 0, Add, nullptr, &fn);
        if(status != napi_ok) return nullptr;

        status = napi_set_named_property(env, exports, "add", fn);
        if(status != napi_ok) return nullptr;

        return exports;
    }

    NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
}
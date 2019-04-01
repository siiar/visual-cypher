
import { createReducer } from 'reduxsauce' ;
import { IQueryObject, CQuery } from './CQuery';
const namespace = "queryRedux";

export const ActionTypes = {
    ADD_CLAUSE: `${namespace}.addClause`,

    SET_ITEM: `${namespace}.setItem`,

    SET_ARRAY_ITEM: `${namespace}.setArrayItem`,
    PUSH_ARRAY_ITEM: `${namespace}.pushArrayItem`,
    REMOVE_ARRAY_ITEM: `${namespace}.removeArrayItem`,
}
export const Actions = {
    addClause: (route: string[], clauseName: string, data?: any) => ({
        type: ActionTypes.ADD_CLAUSE,
        _route: route,
        _clauseName: clauseName,
        _data: data
    }),
    setItem: (route: string[], clauseName: string, data: any) => ({
        type: ActionTypes.SET_ITEM,
        _route: route,
        _clauseName: clauseName,
        _data: data
    }),

    setArrayItem: (route: string[], data: any, index: number) => ({
        type: ActionTypes.SET_ARRAY_ITEM,
        _route: route,
        _data: data,
        _index: index
    }),
    pushArrayItem: (route: string[], data: any) => ({
        type: ActionTypes.PUSH_ARRAY_ITEM,
        _route: route,
        _data: data
    }),
    removeArrayItem: (route: string[], index: number) => ({
        type: ActionTypes.REMOVE_ARRAY_ITEM,
        _route: route,
        _index: index
    })
}

const INITIAL_STATE: IQueryObject = { last_key_id: -1 };
/*
 * Reducers
 */
function addClauseReducer(state: IQueryObject, { _route, _clauseName, _data }: any): IQueryObject {
    let route = _route as string[];
    let clauseName = _clauseName as string;
    let data = _data as any | undefined;
    let nextState = {...state};
    console.log("Adding CLause");
    console.log("CLause Name: ", clauseName);
    console.log("Parent Route: ", route);
    /*
     *  To add subclause, route could be: 0, clausename
     */
    if (data == undefined)
        data = {};

    if (route == undefined || route.length <= 0) {
        // Add to the root of the query
        let key = nextState.last_key_id + 1;
        // Set the last_key_id to current one
        nextState.last_key_id = key;

        // Check if clause supports children
        if (CQuery.clauseMap[clauseName].child.length > 0) {
            nextState[key] = { [clauseName]: { last_key_id: -1 } };
        } else {
            nextState[key] = { [clauseName]: data };
        }// end if

    } else {
        // Add as a sub clause
        // TODO: Support multi level nested clauses
        console.log("QUERY BEFORE");
        console.log(nextState[parseInt(route[0])][route[1]]);
        let key = nextState[parseInt(route[0])][route[1]]['last_key_id'] + 1;
        nextState[parseInt(route[0])][route[1]][key] = { [clauseName]: data };
        nextState[0]["1"]
        // Set the last_key_id to current one
        nextState[parseInt(route[0])][route[1]]['last_key_id'] = key;
    }// end if

    console.log("QUERY");
    console.log(nextState);
    return nextState;
}
function setItemReducer(state: IQueryObject, { _route, _clauseName, _data }: any): IQueryObject {
    let route = _route as string[];
    let clauseName = _clauseName as string;
    let data = _data as any;

    let nextState = {...state};

    let clause = nextState[route[0]];
    for (let i = 1; i < route.length; i++) {
        clause = clause[route[i]]
    }// end for
    clause[clauseName] = data;
    return nextState;
}
function setArrayItemReducer(state: IQueryObject, { _route, _index, _data }: any): IQueryObject {
    let route = _route as string[];
    let index = _index as number;
    let data = _data as any;

    let nextState = {...state}

    var key: any = nextState;
        key = key[route[0]];
        for (let i = 1; i < route.length; i++) {
            key = key[route[i]]
        }// end for
        let arr = key as any[];
        arr[index] = data;
    return nextState;
}
function pushArrayItemReducer(state: IQueryObject, { _route, _data }: any): IQueryObject {
    let route = _route as string[];
    let data = _data as any;

    let nextState = {...state};
    console.log("PUSHING TO ROUTE: ", route);
        var key: any = nextState;
        key = key[route[0]];
        for (let i = 1; i < route.length; i++) {
            key = key[route[i]]
        }// end for

        let arr = key as any[];
        console.log("PUSING TO", arr);
        arr.push(data);
        console.log("AFTER PUSH", arr);
        console.log(nextState);
    return nextState;
}
function removeArrayItemReducer(state: IQueryObject, { type }: any): IQueryObject {
    return state;
}

export const reducer = createReducer(INITIAL_STATE, {
    [ActionTypes.ADD_CLAUSE]: addClauseReducer,
    [ActionTypes.SET_ITEM]: setItemReducer,
    [ActionTypes.SET_ARRAY_ITEM]: setArrayItemReducer,
    [ActionTypes.PUSH_ARRAY_ITEM]: pushArrayItemReducer,
    [ActionTypes.REMOVE_ARRAY_ITEM]: removeArrayItemReducer,
})
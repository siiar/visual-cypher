import { 
    MatchClause, ReturnClause, NodeClause, LinkClause, OrderByClause, 
    SkipClause, LimitClause, WithClause, WhereClause 
} from "./QueryBuilder";

export interface IQueryObject {
    /**
     *  Clause Route could be calculated or Added Whiel adding a clause
     */
    [clause_id: number]: {
        [clause_name: string]: IQueryObject | {}
    },
    last_key_id: number
}
export class CQuery {
    static clauseMap = {
        "match_clause": {
            child: ["node_clause", "link_clause"],
            sibling: ["return_clause", "where_clause"],
            class: MatchClause,
            name: "MATCH"
        },
        "where_clause": {
            child: ["plain_clause"],
            sibling: ["return_clause"],
            class: WhereClause,
            name: "WHERE"
        },
        "node_clause": {
            child: new Array<string>(),
            sibling: ["link_clause"],
            class: NodeClause,
            name: "NODE"
        },
        "link_clause": {
            child: new Array<string>(),
            sibling: ["node_clause"],
            class: LinkClause,
            name: "LINK"
        },

        "return_clause": {
            child: ["plain_clause", "return_value"],
            sibling: ["order_by_clause", "skip_clause", "limit_clause"],
            class: ReturnClause,
            name: "RETURN"
        },
        "return_value": {
            child: new Array<string>(),
            sibling: ["return_value"],
            name: "VALUE"
        },
        "order_by_clause": {
            child: new Array<string>(),
            sibling: ["skip_clause", "limit_clause"],
            class: OrderByClause,
            name: "ORDER BY"
        },
        "skip_clause": {
            child: new Array<string>(),
            sibling: ["limit_clause"],
            class: SkipClause,
            name: "SKIP"
        },
        "limit_clause": {
            child: new Array<string>(),
            sibling: new Array<string>(),
            class: LimitClause,
            name: "LIMIT"
        },

        "with_clause": {
            child: ["plain_clause"],
            sibling: ["order_by_clause", "skip_clause", "limit_clause"],
            class: WithClause,
            name: "WITH"
        }
    }
    static query: IQueryObject = { last_key_id: -1 };
    constructor() { }
    AddClause(clauseName: string, data?: {}, route?: string[]) {
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
            let key = CQuery.query.last_key_id + 1;
            // Set the last_key_id to current one
            CQuery.query.last_key_id = key;

            // Check if clause supports children
            if (CQuery.clauseMap[clauseName].child.length > 0) {
                CQuery.query[key] = { [clauseName]: { last_key_id: -1 } };
            } else {
                CQuery.query[key] = { [clauseName]: data };
            }// end if

        } else {
            // Add as a sub clause
            // TODO: Support multi level nested clauses
            console.log("QUERY BEFORE");
            console.log(CQuery.query[parseInt(route[0])][route[1]]);
            let key = CQuery.query[parseInt(route[0])][route[1]]['last_key_id'] + 1;
            CQuery.query[parseInt(route[0])][route[1]][key] = { [clauseName]: data };
            CQuery.query[0]["1"]
            // Set the last_key_id to current one
            CQuery.query[parseInt(route[0])][route[1]]['last_key_id'] = key;
        }// end if

        console.log("QUERY");
        console.log(CQuery.query);
    }// end AddClause()
    AddData(route: string[], key: string, value: any) {
        let clause = CQuery.query[route[0]];
        for (let i = 1; i < route.length; i++) {
            clause = clause[route[i]]
        }// end for
        clause[key] = value;
    }// end AddData
    PushData(route: string[], value: any) {
        console.log("PUSHING TO ROUTE: ", route);
        var key: any = CQuery.query;
        key = key[route[0]];
        for (let i = 1; i < route.length; i++) {
            key = key[route[i]]
        }// end for

        let arr = key as any[];
        console.log("PUSING TO", arr);
        arr.push(value);
        console.log("AFTER PUSH", arr);
        CQuery.query[value.toString()] = value;
        console.log(CQuery.query);
    }
    RemoveArrayItem(route: string[], index: number){
        var key: any = CQuery.query;
        key = key[route[0]];
        for (let i = 1; i < route.length; i++) {
            key = key[route[i]]
        }// end for
        let arr = key as any[];
        arr.splice(index);
    }
    SetArrayItem(route: string[], item: any, index: number){
        var key: any = CQuery.query;
        key = key[route[0]];
        for (let i = 1; i < route.length; i++) {
            key = key[route[i]]
        }// end for
        let arr = key as any[];
        arr[index] = item;
    }
    GetData(route: string[]) {
        let data = CQuery.query[route[0]];
        for (let i = 1; i < route.length; i++) {
            data = data[route[i]]
        }// end for
        return data;
    }// end GetData()
    GetQuery(): IQueryObject {
        return CQuery.query;
    }
}
import { IQueryObject } from './CQuery';
import { Order } from './OrderByComponent';

export class CypherBuilder{
    clauseMap = {
        "match_clause": {
            child: ["node_clause", "link_clause"],
            sibling: ["return_clause", "where_clause"],
            handler: this._MatchClause,
            name: "MATCH"
        },
        "where_clause": {
            child: ["plain_clause"],
            sibling: ["return_clause"],
            //handler: WhereClause,
            name: "WHERE"
        },
        "node_clause": {
            child: new Array<string>(),
            sibling: ["link_clause"],
            handler: this._NodeClause,
            name: "NODE"
        },
        "link_clause": {
            child: new Array<string>(),
            sibling: ["node_clause"],
            handler: this._LinkClause,
            name: "LINK"
        },

        "return_clause": {
            child: ["plain_clause", "return_value"],
            sibling: ["order_by_clause", "skip_clause", "limit_clause"],
            handler: this._ReturnClause,
            name: "RETURN"
        },
        "return_value": {
            child: new Array<string>(),
            sibling: ["return_value"],
            handler: this._ReturnValue,
            name: "VALUE"
        },
        "order_by_clause": {
            child: new Array<string>(),
            sibling: ["skip_clause", "limit_clause"],
            handler: this._OrderByClause,
            name: "ORDER BY"
        },
        "skip_clause": {
            child: new Array<string>(),
            sibling: ["limit_clause"],
            handler: this._SkipClause,
            name: "SKIP"
        },
        "limit_clause": {
            child: new Array<string>(),
            sibling: new Array<string>(),
            handler: this._LimitClause,
            name: "LIMIT"
        },

        "with_clause": {
            child: ["plain_clause"],
            sibling: ["order_by_clause", "skip_clause", "limit_clause"],
            //class: WithClause,
            name: "WITH"
        }
    }
    trav(query: IQueryObject): string{
        let cypher = "";
        let keys = Object.keys(query);
        for(let i=0; i < keys.length; i++){
            if(keys[i] == "last_key_id")
                continue;

            let clauseName = Object.keys(query[keys[i]])[0];
            let clause = query[keys[i]][clauseName];

            // If clause name is "return_value" then we should split them with ","
            // Translate clause to cypher
            cypher += this.clauseMap[clauseName].handler(clause);
            if(clauseName == "return_value" && i+2 != keys.length)
                cypher += ","

            // Check for child clauses
            if(clause["last_key_id"] != undefined){
                //traverse the children
                cypher += this.trav(clause);
            }// end if
            
        }//end for

        console.log(cypher);
        return cypher;
    }// end trav()
    private _OrderByClause(clause: any){
        let orders: Order[] = clause["orders"];
        let out = " ORDER BY ";
        orders.forEach((order, index) => {
            out += order.variable + "." + order.property_name + " " + order.type;
            if(index + 1 != orders.length)
                out += ", "
        });// end forEach()
        return out;
    }
    private _SkipClause(clause: any){
        return " SKIP " + clause["skip"];
    }
    private _LimitClause(clause: any){
        return " LIMIT " + clause["limit"];
    }
    private _MatchClause(clause: any){
        return "MATCH ";
    }
    private _NodeClause(clause: any){
        let out = "(";
        if(clause["variable_name"] && clause["variable_name"].length > 0)
            out += clause["variable_name"];
        if(clause["label_names"] && clause["label_names"].length > 0){
            out += ":" + clause["label_names"].join(":");
        }
        out += ")";
        console.log(clause);
        return out;
    }
    private _LinkClause(clause: any){
        let out = "-";
        // if it has variable name, label name, path length, or property map then get the syntax ready
        if(clause["variable_name"].length > 0 || clause["label_name"].length > 0)
            out += "[";
        
        if(clause["variable_name"] && clause["variable_name"].length > 0)
            out += clause["variable_name"];
        if(clause["label_name"] && clause["label_name"].length > 0){
            out += ":" + clause["label_name"];
        }

        // if it has variable name, label name, path length, or property map then get the close syntax
        if(clause["variable_name"].length > 0 || clause["label_name"].length > 0)
            out += "]";
        out += "->";
        console.log(clause);
        return out;
    }
    private _ReturnClause(clause: any){
        return " RETURN ";
    }
    private _ReturnValue(clause: any){
        let out = " ";
        if(clause["type"] == "literal")
            out += "'" + clause["literal"] + "'";

        if(clause["type"] == "variable")
            out += clause["variable_name"]
        
        if(clause["type"] == "variable" && clause["property_name"].length > 0)
            out += "." + clause["property_name"];

        // Get Operators
        if(clause["operators"].length > 0){
            for(let i=0; i < clause["operators"].length; i++){
                out += " " + clause["operators"][i]["operator"] + " ";

                let operand = clause["operators"][i]["operand"];
                if(operand["type"] == "literal"){
                    out += "'" + operand["value"] + "'";
                }
                if(operand["type"] == "variable"){
                    out += operand["variable"];
                    if(operand["property_name"].length > 0){
                        out += "." + operand["property_name"];
                    }// end if
                }// end if
            }// end for
        }// end if

        return out;
    }
}
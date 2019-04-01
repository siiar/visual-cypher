import { IQueryObject, CQuery } from './CQuery';
import { Actions as QueryActions } from "./QueryRedux";
import * as React from 'react';

import { connect } from 'react-redux';
import { NodeClauseComponent } from './NodeClauseComponent';
import { LinkClauseComponent } from './LinkClauseComponent';
import { SkipClauseComponent } from './SkipClauseComponent';
import { ReturnValueComponent, Operator } from './ReturnValueComponent';
import { CypherBuilder } from './CypherBuilder';
import { LimitClauseComponent } from './LimitClauseComponent';
import { OrderByComponent } from './OrderByComponent';

function generateData(clauseName: string){
    const data = {};
    if(clauseName == "return_value"){
        data["type"] = "literal"
        data["variable_name"]= "";
        data["property_name"]= "";
        data["literal"]= "";
        data["as"]= "";
        data["operators"] =[];
    }
    if(clauseName == "node_clause"){
        data['variable_name'] = "";
        data['label_names'] = [];
    }
    if(clauseName == "link_clause"){
        data["variable_name"] = "";
        data["label_name"] =  "";
    }
    if(clauseName == "order_by_clause"){
        data["orders"] = [];
    }
    if(clauseName == "skip_clause"){
        data["skip"] = 0;
    }
    if(clauseName == "limit_clause"){
        data["limit"] = 10;
    }
    return data;
}

interface IProps {
    query: IQueryObject;

    addClause: (route: string[], clauseName: string, data: any) => void;
    setItem: (route: string[], clauseName: string, data: any) => void;

    setArrayItem: (route: string[], data: any, index: number) => void;
    pushArrayItem: (route: string[], data: any) => void;
    removeArrayItem: (route: string[], index: number) => void;
};
interface IState {
};
class Main extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.props.addClause([], "match_clause", {});

    }
    componentDidMount() {
        console.log("Main.tsx: componentDidMount()");
    }
    componentWillReceiveProps(nextProps: IProps) {
        console.log("Main.tsx: componentWillReceiveProps()");
        console.log(nextProps);
    }
    GetData(route: string[]) {
        let data = this.props.query[route[0]];
        for (let i = 1; i < route.length; i++) {
            data = data[route[i]]
        }// end for
        return data;
    }// end GetData()
    GetVariables(): string[]{
        /* Variables are assigned in Match Clause */
        let variables: string[] = [];
        let lastKey = this.props.query.last_key_id;
        let matchClause;
        for(let i=0; i <= lastKey; i++){
            if(this.props.query[i]["match_clause"]){
                matchClause = this.props.query[i]["match_clause"]
                break;
            }// end if
        }// end for
        if(!matchClause || matchClause["last_key_id"] < 0)
            return variables;

        lastKey = matchClause["last_key_id"];
        for(let i=0; i <= lastKey; i++){
            let clause = matchClause[i];
            if(clause["node_clause"] && clause["node_clause"]["variable_name"].length){
                variables.push(clause["node_clause"]["variable_name"]);
            }// end if
            if(clause["link_clause"] && clause["link_clause"]["variable_name"].length > 0){
                variables.push(clause["link_clause"]["variable_name"]);
            }// end if
        }// end for
        return variables;
    }
    ReturnValueUpdateOperand(route: string[], operator: Operator, index: number) {

    }
    renderNodeClause(route: string[]) {
        console.log("AYYY");
        console.log(route);
        return (
            <NodeClauseComponent
                variableName={this.GetData([...route, "variable_name"])}
                labelNames={this.GetData([...route, "label_names"])}

                onLabelNew={(label) => this.props.pushArrayItem([...route, "label_names"], label)}
                onVariableNameChange={(variable) => this.props.setItem(route, "variable_name", variable)}
                onLabelRemove={(index) => this.props.removeArrayItem([...route, "label_names"], index)}
                onLabelChange={(label, index) => this.props.setArrayItem([...route, "label_names"], label, index)}
            />
        );// end return()
    }// end renderNodeClause()
    renderLinkClause(route: string[]) {
        console.log("AYYY");
        console.log(route);
        return (
            <LinkClauseComponent
                variableName={this.GetData([...route, "variable_name"])}
                labelName={this.GetData([...route, "label_name"])}
                onVariableNameChange={(variableName) => this.props.setItem(route, "variable_name", variableName)}
                onLabelChange={(labelName) => this.props.setItem(route, "label_name", labelName)}
            />
        );// end return()
    }// end renderLinkClause()
    renderOrderByClause(route: string[]){
        return (
            <OrderByComponent
                orders={this.GetData([...route, "orders"])}
                variableNames={this.GetVariables()}

                onOrderChange={(order, index) => this.props.setArrayItem([...route, "orders"], order, index)}
                onOrderNew={(order) => this.props.pushArrayItem([...route, "orders"], order)}
            />
        );// end return()
    }
    renderSkipClause(route: string[]) {
        console.log("RENDERING SKIP CLAUSE");
        return (
            <SkipClauseComponent
                skip={this.GetData([...route, "skip"])}
                onSkipChange={(skip) => this.props.setItem(route, "skip", skip)}
            />
        ); // end return()
    }// end renderSkipClause()
    renderLimitClause(route: string[]) {
        console.log("RENDERING SKIP CLAUSE");
        return (
            <LimitClauseComponent
                limit={this.GetData([...route, "limit"])}
                onLimitChange={(limit) => this.props.setItem(route, "limit", limit)}
            />
        ); // end return()
    }// end renderLimitClause()
    renderReturnValue(route: string[]) {
        console.log("AYYY");
        console.log(route);

        // Add to cquery
        return (
            <ReturnValueComponent
                variableNames={this.GetVariables()}
                operators={this.GetData([...route, "operators"])}

                type={this.GetData([...route, "type"])}
                literal={this.GetData([...route, "literal"])}
                variableName={this.GetData([...route, "variable_name"])}
                propertyName={this.GetData([...route, "property_name"])}

                onVariableNameChange={(variableName) => this.props.setItem(route, "variable_name", variableName)}
                onPropertyNameChange={(propertyName) => this.props.setItem(route, "property_name", propertyName)}
                onLiteralChange={(literal) => this.props.setItem(route, "literal", literal)}
                onTypeChange={(type) => this.props.setItem(route, "type", type)}
                
                onAsChange={() => console.log()}

                onNewOperator={(operator) => this.props.pushArrayItem([...route, "operators"], operator)}
                onUpdateOperand={(operator, index) => this.props.setArrayItem([...route, "operators"], operator, index)}
            />
        );// end return()
    }// end renderReturnValue()
    renderClause(name: string, route: string[], removable: boolean = false) {
        if (name == "node_clause")
            return this.renderNodeClause(route);
        if (name == "link_clause")
            return this.renderLinkClause(route);

        if (name == "order_by_clause")
            return this.renderOrderByClause(route);
        if (name == "skip_clause")
            return this.renderSkipClause(route);
        if (name == "limit_clause")
            return this.renderLimitClause(route);

        if (name == "return_value")
            return this.renderReturnValue(route);
        else
            return (
                <div className={name}>
                    {name}::{route.toString()}
                </div>
            );
    }

    onSelectSibling(event: any) {
        // first element contains the clause name
        // rest of the elements contain the parentRoute
        let value = event.target.value.split(",");
        let clauseName = value[0];
        let parentRoute = value.slice(1);

        this.props.addClause(parentRoute, clauseName, generateData(clauseName) );
    }
    renderChildrenOptions(clause: string, parentRoute: string[]) {
        if (!CQuery.clauseMap[clause])
            return null;

        let children: string[] = CQuery.clauseMap[clause].child;
        if (children == undefined || children.length == 0)
            return null;

        return (
            <div className="sibling-options">
                <select onChange={(event) => this.onSelectSibling(event)}>
                    <option value="" disabled={true} selected={true}>Select</option>
                    {children.map((clauseName, index) => {
                        return (<option key={index} value={[clauseName, ...parentRoute]}>{clauseName}</option>);
                    })}
                </select>
            </div>
        );;

    }// end renderChildrenOptions
    renderSiblingOptions(clause: string, parentRoute: string[]) {
        if (!CQuery.clauseMap[clause])
            return null;

        let siblings: string[] = CQuery.clauseMap[clause].sibling;
        if (siblings == undefined || siblings.length == 0)
            return null;
        return (
            <div className="sibling-options">
                <select onChange={(event) => this.onSelectSibling(event)}>
                    <option value="" disabled={true} selected={true}>Select</option>
                    {siblings.map((clauseName, index) => {
                        return (<option key={index} value={[clauseName, ...parentRoute]}>{clauseName}</option>);
                    })}
                </select>
            </div>
        );;

    }// end renderSiblingOptions

    trav(clause: IQueryObject, parentRoute: string[]): Array<any> | any {
        let out = [];
        let keys = Object.keys(clause);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == "last_key_id")
                continue;


            let route = [...parentRoute];
            let clauseName = Object.keys(clause[keys[i]])[0];
            route.push(keys[i], clauseName);

            // if this clause has a child then go for it
            if (clause[keys[i]][clauseName]["last_key_id"] != undefined) {
                let parentDiv;
                let title = <div className="clause_header">{CQuery.clauseMap[clauseName].name}</div>;
                // if parent clause has no child, then give option for child
                if (clause[keys[i]][clauseName]["last_key_id"] == -1) {
                    parentDiv = React.createElement("div", { "className": clauseName }, [title, this.renderChildrenOptions(clauseName, route)])
                } else {
                    parentDiv = React.createElement("div", { "className": clauseName }, [title, ...this.trav(clause[keys[i]][clauseName], route), <div key="9999" className="clear">x</div>])
                }

                out.push(parentDiv);
                // Generate Possible Sibling Options
                if (i + 2 == keys.length)
                    out.push(this.renderSiblingOptions(clauseName, parentRoute))
            } else {

                out.push(this.renderClause(clauseName, route));

                // Render Sibling Option for the last child
                // +2 because of last_key_id that we ignore
                if (i + 2 == keys.length)
                    out.push(this.renderSiblingOptions(clauseName, parentRoute));
            }// end if

        }// end for
        return out;
    }
    public render() {
        return (
            <div className="App">
                <div id="container">
                    {/*this.renderMatchOptions()*/}
                    {this.trav(this.props.query, [])}
                    <button onClick={() => {new CypherBuilder().trav(this.props.query)}}>CYPHER</button>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state: any) {
    console.log("Main.tsx: mapStateToProps()");
    console.log(state);
    return {
        query: state.query
    }//end return
}//end mapStateToProps()
function mapDispatchToProps(dispatch: any) {
    return {
        addClause: (route: string[], clauseName: string, data: any) => dispatch(QueryActions.addClause(route, clauseName, data)),

        setItem: (route: string[], clauseName: string, data: any) => dispatch(QueryActions.setItem(route, clauseName, data)),

        setArrayItem: (route: string[], data: any, index: number) => dispatch(QueryActions.setArrayItem(route, data, index)),
        pushArrayItem: (route: string[], data: any) => dispatch(QueryActions.pushArrayItem(route, data)),
        removeArrayItem: (route: string[], index: number) => dispatch(QueryActions.removeArrayItem(route, index))
    }//end return
}//end mapDispatchToProps()
export default connect(mapStateToProps, mapDispatchToProps)(Main);
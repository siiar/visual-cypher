import * as React from 'react';
export interface Operator {
    operator: "<=" | ">=" | "<" | ">" | "=" | "AND" | "OR" | "+" | "-";
    operand: { type: "variable", variable: string, property_name: string } | { type: "literal", value: string | number };
}
interface Props {
    variableNames: string[];
    operators: Operator[];

    type: "literal" | "variable";
    literal: string;
    variableName: string;
    propertyName: string;

    onTypeChange: (type: "literal" | "variable") => void,
    onVariableNameChange: (name: string) => void;
    onPropertyNameChange: (name: string) => void;
    onLiteralChange: (literal: string) => void;

    onAsChange: (key: string, as: string) => void;

    onNewOperator: (operator: Operator) => void;
    onUpdateOperand: (operator: Operator, index: number) => void;
}
interface State {
    labelName: string;
}
export class ReturnValueComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            labelName: ""
        }
    }// end constructor()
    renderVariableTypeInput() {

    }
    renderLiteralTypeInput() {

    }
    onOperatorTypeChange(type: "literal" | "variable", index: number) {
        let operator = {...this.props.operators[index]};
        if(type == "literal")
            operator.operand = {type: "literal", value: ""};
        if(type == "variable")
            operator.operand = {type: "variable", variable: "", property_name: ""}
        
        this.props.onUpdateOperand(operator, index);
    }
    onOperatorInputChange(input: string, index: number) {
        let operator = {...this.props.operators[index]};

        if(operator.operand.type == "literal")
            operator.operand.value = input;

        if(operator.operand.type == "variable")
            operator.operand.property_name = input;

        this.props.onUpdateOperand(operator, index);
    }
    onOperatorVariableChange(variable: string, index: number) {
        let operator = this.props.operators[index];
        if(operator.operand.type == "variable")
            operator.operand.variable = variable;

        this.props.onUpdateOperand(operator, index);
    }
    renderOperators() {
        return this.props.operators.map((op, index) => {
            if (op.operand.type == "literal")
                return (
                    <div key={index} className="row">
                        <div className="label">{op.operator}</div>
                        <div className="input_type">
                            <select onChange={(event) => this.onOperatorTypeChange(event.target.value as "variable" | "literal", index)}>
                                <option value="literal" selected={true}>literal</option>
                                <option value="variable">variable</option>
                            </select>
                        </div>
                        <div className="input">
                            <input onChange={(event) => this.onOperatorInputChange(event.target.value, index)} type="text" placeholder="value" value={op.operand.value} />
                        </div>
                    </div>
                );

            if (op.operand.type == "variable")
                return (
                    <div key={index} className="row">
                        <div className="label">{op.operator}</div>
                        <div className="input_type">
                            <select onChange={(event) => this.onOperatorTypeChange(event.target.value as "literal" | "variable", index)}>
                                <option value="literal">literal</option>
                                <option value="variable" selected={true}>variable</option>
                            </select>
                        </div>
                        <div className="input_variable">
                            <select onChange={(event) => this.onOperatorVariableChange(event.target.value, index)}>
                                {this.props.variableNames.map((variable, index) => {
                                    return <option key={index} value={variable}>{variable}</option>
                                })}
                            </select>
                        </div>
                        <div className="input">
                            <input onChange={(event) => this.onOperatorInputChange(event.target.value, index)} type="text" placeholder="value" value={op.operand.property_name} />
                        </div>
                    </div>
                );
            return null;
        }); // end map()
    }
    onNewOperator(operator: Operator){
        this.props.onNewOperator(operator);
    }
    renderOperatorOptions() {
        /*
         *  If last operator is comparison operator then next operator can be binary operators
         *  e.g, "AND" after "<="
         *  If last operator is binary operator then next operator must be comparison operator
         */
        const operators = ["<=", ">=", "<", ">", "=", "AND", "OR", "+", "-"];

        let lastOperator = "";
        if(this.props.operators.length >= 1)
            lastOperator = this.props.operators[this.props.operators.length-1].operator;

        let excludedOperators = {};
        switch (lastOperator) {
            case "AND":
            case "OR":
                excludedOperators["AND"] = true;
                excludedOperators["OR"] = true;
                break;
        }// end switch
        return (
            <select onChange={(event) => {this.onNewOperator({operator: event.target.value as "<=" | ">=" | "<" | ">" | "=" | "AND" | "OR" | "+" | "-", operand: {type: "literal", value: ""}})}}>
                {operators.map((op) => {
                    if (excludedOperators[op] == undefined) {
                        return (<option value={op}>{op}</option>)
                    }
                    return null;
                })}
            </select>
        );// end return()
    }
    render() {
        return (
            <div className="return_value" >
                <div className="clause_header">
                    <h1 className="clause_title">VALUE</h1>
                </div>
                <div className="clause_body">
                    {/* Return Type */}
                    <div className="return-type" >
                        <select onChange={(event) => this.props.onTypeChange(event.target.value as "literal" | "variable")}>
                            <option selected={(this.props.type == "literal")?true: false} value="literal">Literal</option>
                            <option selected={(this.props.type == "variable")?true: false} value="variable">Variable</option>
                        </select>
                        {(this.props.type == "literal")? 
                            <input type="text" placeholder="literal" onChange={(event) => this.props.onLiteralChange(event.target.value)}/>
                            : null
                        }
                        {(this.props.type == "variable")? 
                            <div>
                                <select onChange={(event) => this.props.onVariableNameChange(event.target.value)}>
                                    <option value="" disabled={true} selected={true}>Variable</option>
                                    {this.props.variableNames.map((variable, index) => {
                                        return <option key={index} value={variable}>{variable}</option>
                                    })}
                                </select>
                                <input type="text" placeholder="Property" onChange={(event) => this.props.onPropertyNameChange(event.target.value)}/>
                            </div>
                            : null
                        }
                    </div>

                    {/* Compare */}
                    <div className="comparator">
                        {this.renderOperators()}
                        {this.renderOperatorOptions()}

                    </div>
                    {/* AS */}
                    <div className="row">
                        <div className="label">AS</div>
                        <div className="input">
                            <input type="text" placeholder="AS" />
                        </div>
                    </div>
                </div>
            </div>
        ); // end return()
    }// end render()
}
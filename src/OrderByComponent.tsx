import * as React from 'react';
export interface Order {
    variable: string;
    property_name: string;
    type: "DESC" | "ASC";
}
interface Props {
    orders: Order[];
    variableNames: string[];

    onOrderNew: (order: Order) => void;
    onOrderChange: (order: Order, index: number) => void;
}
interface State {
}
export class OrderByComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }// end constructor()
    onOrderVariableChange(variable: string, index: number){
        let order = this.props.orders[index];
        order.variable = variable;
        this.props.onOrderChange(order, index);
    }
    onOrderPropertyNameChange(propertyName: string, index: number){
        let order = this.props.orders[index];
        order.property_name = propertyName;
        this.props.onOrderChange(order, index);
    }
    renderOrders() {
        return this.props.orders.map((order, index) => {
            return (
                <div key={index} className="row">
                    <div className="label">{order.type}</div>
                    <div className="input_variable">
                        <select onChange={(event) => this.onOrderVariableChange(event.target.value, index)}>
                            {this.props.variableNames.map((variable, index) => {
                                return <option key={index} value={variable}>{variable}</option>
                            })}
                        </select>
                    </div>
                    <div className="input">
                        <input 
                            onChange={(event) => this.onOrderPropertyNameChange(event.target.value, index)} 
                            type="text" 
                            placeholder="Property Name" 
                            value={order.property_name} />
                    </div>
                </div>
            );
        }); // end map()
    }
    renderOrderOptions() {
        return (
            <select 
            onChange={(event) => { this.props.onOrderNew({variable: "", property_name: "", type: event.target.value as "ASC" | "DESC"}) }}>
                <option value="" selected={true} disabled={true}>Select</option>
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
            </select>
        );// end return()
    }
    render() {
        return (
            <div className="order_by_clause" >
                <div className="clause_header">
                    <h1 className="clause_title">ORDER</h1>
                </div>
                <div className="clause_body">
                    {this.renderOrders()}
                    {this.renderOrderOptions()}
                </div>
            </div>
        ); // end return()
    }// end render()
}
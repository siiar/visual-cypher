import * as React from 'react';
interface Props {
    limit: number;

    onLimitChange: (limit: number) => void;
}
interface State { 
}
export class LimitClauseComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }// end constructor()
    render() {
        return (
            <div className="limit_clause" >
                {/* Clause Label */}
                <div className="clause_title">LIMIT</div>
                {/* limit Input */}
                <div className="input-limit" >
                    <input
                        defaultValue={this.props.limit.toString()} 
                        type="text" 
                        placeholder="Limit" 
                        onChange={(event) => this.props.onLimitChange(parseInt(event.target.value))} />
                </div>

            </div>
        ); // end return()
    }// end render()
}
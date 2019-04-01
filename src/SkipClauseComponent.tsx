import * as React from 'react';
interface Props {
    skip: number;

    onSkipChange: (skip: number) => void;
}
interface State { 
}
export class SkipClauseComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }// end constructor()
    render() {
        return (
            <div className="skip_clause" >
                {/* Clause Label */}
                <div className="clause_title">SKIP</div>
                {/* skip Input */}
                <div className="input-skip" >
                    <input
                        defaultValue={this.props.skip.toString()} 
                        type="text" 
                        placeholder="Skip" 
                        onChange={(event) => this.props.onSkipChange(parseInt(event.target.value))} />
                </div>

            </div>
        ); // end return()
    }// end render()
}
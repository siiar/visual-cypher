import * as React from 'react';
import Editor from 'react-simple-code-editor';

var Prism = require('prismjs');
interface Props {
    variableName: string;
    labelNames: string[];

    onVariableNameChange: (name: string) => void;
    onLabelNew: (name: string) => void;
    onLabelChange: (label: string, index: number) => void;
    onLabelRemove: (index: number) => void;
}
interface State {
    labelName: string;
}
export class NodeClauseComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            labelName: ""
        }
    }// end constructor()
    renderLabel(name: string, index: number) {
        return (
            <div className="label">
                <input onChange={(event) => this.props.onLabelChange(event.target.value, index)} type="text" defaultValue={name} />
            </div>
        ); // end return()
    }// end renderLabel()
    render() {
        return (
            <div className="node_clause" >
                <div className="clause_header">
                    <h1 className="clause_title">NODE</h1>
                </div>
                <div className="clause_body">
                    {/* Variable Name Input */}
                    <div className="input-variable" >
                        <input type="text" placeholder="Variable Name" onChange={(event) => this.props.onVariableNameChange(event.target.value)} />
                    </div>

                    {/* Labels Input */}
                    <div className="input-labels">
                        {this.props.labelNames.map((label, index) => { return this.renderLabel(label, index) })}
                        <input
                            type="text"
                            placeholder="Label Name"
                            value={this.state.labelName}
                            onChange={(event) => this.setState({ labelName: event.target.value })}
                            onKeyPress={(event) => { if (event.key == 'Enter') { this.props.onLabelNew(this.state.labelName); this.setState({ labelName: "" }) } }} />
                    </div>

                    {/* Properties Input */}
                    <div className="input-properties">
                        <Editor
                            value={""}
                            onValueChange={code => console.log(code)}
                            highlight={code => Prism.highlight("{code: 'value'}", Prism.languages.javascript, "javascript")}
                            padding={10}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 12,
                            }}
                        />
                    </div>
                </div>
            </div>
        ); // end return()
    }// end render()
}
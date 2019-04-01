import * as React from 'react';
import Editor from 'react-simple-code-editor';

var Prism = require('prismjs');
interface Props {
    variableName: string;
    labelName: string;

    onVariableNameChange: (name: string) => void;
    onLabelChange: (name: string) => void;
}
interface State {
}
export class LinkClauseComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }// end constructor()
    render() {
        return (
            <div className="link_clause" >
                <div className="clause_header">
                    <h1 className="clause_title">LINK</h1>
                </div>
                <div className="clause_body">
                    {/* Variable Name Input */}
                    <div className="input-variable" >
                        <input type="text" placeholder="Variable Name" onChange={(event) => this.props.onVariableNameChange(event.target.value)} />
                    </div>

                    {/* Labels Input */}
                    <div className="input-labels">
                        <input
                            type="text"
                            placeholder="Label Name"
                            onChange={(event) => this.props.onLabelChange(event.target.value)}
                        />
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
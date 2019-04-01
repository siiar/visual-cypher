class Clause<T_CHILD, T_SIBLING> {
    private id: string;
    private child: T_CHILD;
    private sibling: T_SIBLING;
    constructor(id: string){
        this.id = id;
    }
    public SetSibling(sibling: T_SIBLING): this {
        this.sibling = sibling;
        return this;
    }
    public SetSiblingAt(index: number, sibling: T_SIBLING): this {
        if(index == 0)
            this.sibling = sibling;
        else{
            if(this.GetSiblingAt(index) == undefined)
                index = index -1;
            
            this.GetSiblingAt(index).SetSibling(sibling);
        }
            
        return this;
    }
    public SetChild(child: T_CHILD): this {
        this.child = child;
        return this;
    }
    public SetChildAt(index: number, child: T_CHILD): this {
        if(index == 0)
            this.child = child;
        else{
            if(this.GetChildAt(index) == undefined)
                index = index -1;
            
            this.GetChildAt(index).SetSibling(child);
        }
            
        return this;
    }

    public GetId(): string {
        return this.id;
    }
    public GetSibling(): T_SIBLING {
        return this.sibling;
    }
    
    public GetSiblingAt(index: number): any{
        let sibling = this.GetSibling() as unknown as Clause<any,any>;
        for(let i=1; i<=index; i++){
            sibling = sibling.GetSibling();
        }
        return sibling;
    }
    public GetLastSibling(){
        let lastSibling = this.GetSibling() as unknown as Clause<any,any>;
        let sibling = lastSibling;
        while(sibling){
            lastSibling = sibling;
            sibling = sibling.GetSibling();
        }
        return lastSibling;
    }
    public GetChild(): T_CHILD {
        return this.child;
    }
    public GetChildAt(index: number): any{
        let child = this.GetChild() as unknown as Clause<any,any>;
        for(let i=1; i<=index; i++){
            child = child.GetSibling(); // children to eachother are added as siblings
        }
        return child;
    }
    public GetLastChild(){
        let lastChild = this.GetChild() as unknown as Clause<any,any>;
        let child = lastChild;
        while(child){
            lastChild = child;
            child = child.GetChild();
        }
        return lastChild;
    }

}
export class PlainClause extends Clause<undefined, undefined>{
    input: string;
    constructor(input: string){
        super("plain_clause");
        this.input = input;
    }
    public GetCypher(): string {
        return this.input;
    }
}
export class NodeClause extends Clause<undefined, LinkClause>{
    public varName: string;
    public labelNames: string[];
    constructor(varName: string, labelNames: string[]){
        super("node_child");
        this.varName = varName;
        this.labelNames = labelNames;
    }
    public GetCypher(): string {
        let output = "(";
        if(this.varName) {
            output += this.varName;
        }
        if(this.labelNames) {
            this.labelNames.forEach( label => {
                output += `:${label}`;
            });
        }
        output += ")";
        return output;
    }
    public GetUIOptions(){

    }
}
export class LinkClause extends Clause<undefined, NodeClause>{
    public varName: string;
    public labelName: string;
    public constructor(varName: string, labelName: string){
        super("link_child");
        this.varName = varName;
        this.labelName = labelName;
    }

    public GetCypher(): string {
        let output = "";
        if(this.varName && this.labelName){
            output += `-[${this.varName}:${this.labelName}]->`;
        }else if(this.varName) {
            output += `-[${this.varName}]->`;
        }else if(this.labelName) {
            output += `-[:${this.labelName}]->`;
        } else {
            output += `-->`;
        }
        return output;
    }
}
export class LimitClause extends Clause<PlainClause, undefined>{
    constructor(child: PlainClause){
        super("limit_clause");
        this.SetChild(child);
    }// end constructor()
    public GetCypher(): string {
        return "LIMIT";
    }
}// end LimitClause()
export class SkipClause extends Clause<PlainClause, LimitClause>{
    constructor(child: PlainClause, sibling: LimitClause){
        super("skip_clause");
        this.SetChild(child);
        this.SetSibling(sibling);

    }// end constructor()
    public GetCypher(): string {
        return "SKIP";
    }
}// end SkipClause()
export class WithClause extends Clause<PlainClause, OrderByClause | SkipClause | LimitClause | ReturnClause>{
    constructor(child: PlainClause, sibling: OrderByClause | SkipClause | LimitClause | ReturnClause){
        super("with_clause");
        this.SetChild(child);
        this.SetSibling(sibling);
    }// end constructor()
    public GetCypher(): string {
        return "WITH";
    }
}// end WithClause()
/* Optional Child b/w DESC and ASC */
export class OrderByClause extends Clause<PlainClause, SkipClause | LimitClause> {
    constructor(child: PlainClause, sibling: SkipClause | LimitClause){
        super("order_by_clause");
        this.SetChild(child);
        this.SetSibling(sibling);
    }// end constructor()
    public GetCypher(): string {
        return "ORDER BY";
    }
}// end OrderByClause()
export class WhereClause extends Clause<PlainClause, WithClause | ReturnClause>{
    constructor(child: PlainClause, sibling: WithClause | ReturnClause){
        super("where_clause");
        this.SetChild(child);
        this.SetSibling(sibling);
    }// end constructor()
    public GetCypher(): string {
        return "WHERE";
    }
}// end WhereClause
export class ReturnClause extends Clause<PlainClause, OrderByClause | SkipClause | LimitClause> {
    constructor(child: PlainClause, sibling: OrderByClause | SkipClause | LimitClause) {
        super("return");
        this.SetChild(child);
        this.SetSibling(sibling);
    }
    public GetCypher(): string {
        return "RETURN";
    }
}
export class MatchClause extends Clause<NodeClause | LinkClause, ReturnClause | WhereClause> {
    constructor(child: NodeClause | LinkClause, sibling: ReturnClause | WhereClause){
        super("match");
        this.SetChild(child);
        this.SetSibling(sibling);
    }
    public GetCypher(): string {
        return "MATCH";
    }
    public dump(){
        console.log("Dumping");
        let cypher = this.GetCypher();

        let clause: any = this;
        //let child = clause.GetChild();

        let next = this.GetChild();
        while(next != undefined){
            cypher += " " + next.GetCypher();

            next = next.GetSibling();
            if(next == undefined || next == null) {
                next = undefined;
                clause = clause.GetSibling();
                if(clause != undefined) {
                    cypher += " " + clause.GetCypher();
                    next = clause.GetChild();
                }
            }
        }
        console.log(cypher);
        return cypher;
    }
}
export class QueryBuilder{

    public constructor(){
        const match = new MatchClause(
            new NodeClause("x", ["User"])
                .SetSibling(
                    new LinkClause("l", "knows")
                        .SetSibling(
                            new NodeClause("f", ["User"])
                        )
                ),
            new WhereClause(new PlainClause("x.name != l.name"), new ReturnClause(new PlainClause("r"), undefined))
            
        );
        match.dump();
        //console.log(match.GetSiblingAt(0));
    }
}
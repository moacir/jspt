require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"jspt":[function(require,module,exports){
module.exports=require('/uJC/q');
},{}],2:[function(require,module,exports){
/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

(function () {

'use strict';

var AST = {
    AlgorithmNode: function (name, varList, funcList, body) {
        this.node = 'Algorithm';
        this.name = name;
        this.variables = varList || null;
        this.functions = funcList || null;
        this.body = body;
    },
    VariablesBlockNode: function (variablesList) {
        this.node = 'VariablesBlock';
        this.list = variablesList;
    },
    VariableDeclarationNode: function (id, type) {
        this.node = 'VariableDeclaration';
        this.id = id;
        this.type = type;
    },
    ExpressionNode: function (expression) {
        this.node = 'Expression';
        this.expression = expression;
    },
    AssignmentExpressionNode: function (operator, left, right) {
        this.node = 'AssignmentExpression';
        this.operator = operator;
        this.left = left;
        this.right = right; 
    },
    UnaryExpressionNode: function (operator, argument) {
        this.node = 'UnaryExpression';
        this.operator = operator;
        this.argument = argument;
    },
    BinaryExpressionNode: function (operator, left, right) {
        this.node = 'BinaryExpression';
        this.operator = operator;
        this.left = left;
        this.right = right; 
    },
    LogicalExpressionNode: function (operator, left, right) {
        this.node = 'LogicalExpression';
        this.operator = operator;
        this.left = left;
        this.right = right; 
    },
    FunctionCallNode: function (id, args) {
        this.node = 'FunctionCall';
        this.id = id;
        this.args = args;
    },
    FunctionStatementNode: function (call) {
        this.node = 'FunctionStatement';
        this.call = call;
    }, 
    FunctionDeclarationNode: function (id, type, params, variables, body) {
        this.node = 'FunctionDeclaration';
        this.id = id;
        this.type = type;
        this.params = params || [];
        this.variables = variables || [];
        this.body = body;
    }, 
    FunctionParameterNode: function (id, type) {
        this.node = 'FunctionParameter';
        this.id = id;
        this.type = type;
    }, 
    FunctionDeclarationListNode: function (list) {
        this.node = 'FunctionDeclarationList';
        this.list = list || [];
    },
    ReturnStatementNode: function (argument) {
        this.node = 'ReturnStatement';
        this.argument = argument;
    }, 
    StatementListNode: function (list) {
        this.node = 'StatementList';
        this.list = list || [];
    },
    IfStatementNode: function (test, consequent, alternate) {
        this.node = 'IfStatement';
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate || null;
    },
    WhileStatementNode: function (test, body) {
        this.node = 'WhileStatement';
        this.test = test;
        this.body = body;
    }, 
    ForStatementNode: function (variable, start, end, update, body) {
        this.node = 'ForStatement';
        this.variable = variable;
        this.start = start;
        this.end = end;
        this.update = update;
        this.body = body;
    },
    LiteralNode: function (type, value, raw) {
        this.node = 'Literal';
        this.type = type;
        this.value = value;
        this.raw = raw;
    },
    IdentifierNode: function (id) {
        this.node = 'Identifier';
        this.id = id;
    }
};

AST.Util = {
    createVariableDeclarationList: function (ids, type) {
        var list = [];

        for (var i=0; i<ids.length; i++) {
            list.push(new AST.VariableDeclarationNode(ids[i], type));
        }

        return list;
    },
    createNumberFromRawString: function (numberRaw) {
        if (numberRaw.match(/[c|C]/)) {
            return parseInt(numberRaw.replace(/[c|C]/, ''), 8);
        }
        if (numberRaw.match(/[b|B]/)) {
            return parseInt(numberRaw.replace(/0[b|B]/, ''), 2);
        }
        if (numberRaw.match(/[x|X]/)) {
            return parseInt(numberRaw, 16);
        }

        return parseInt(numberRaw, 10);
    }
};

exports.ast = AST;

})();

},{}],3:[function(require,module,exports){
/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

(function () {

'use strict';

function Buffer() {
    this.str = '';
}

Buffer.prototype = {
    write: function (text) {
        this.str += (text !== undefined) ? text : '';
    },
    writeLine: function (text) {
        this.str += '\n' + ((text !== undefined) ? text : '');
    },
    clear: function () {
        this.str = '';
    },
    toString: function () {
        return this.str;
    }
};

exports.buffer = Buffer;

})();

},{}],4:[function(require,module,exports){
/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

(function () {

'use strict';

function Compiler(ast, buffer) {
    this.ast = ast;
    this.buffer = buffer;
    this.idPrefix = '';
}

Compiler.prototype = {
    compile: function () {
        this.compileAlgorithmNode(this.ast);
        return this.buffer.toString();
    },
    compileAlgorithmNode: function (node) {
        this.buffer.clear();
        this.buffer.write('/* algoritmo: ' + node.name + ' */');

        this.buffer.writeLine('(function () {');
        this.buffer.writeLine('"use strict";');

        this.compileVariablesBlockNode(node.variables);
        this.compileFunctionDeclarationListNode(node.functions);

        this.buffer.writeLine('/* início */');
        this.compileStatementListNode(node.body);
        this.buffer.writeLine('/* fim */');

        this.buffer.writeLine('})();');
    },
    compileVariablesBlockNode: function (node) {
        this.buffer.writeLine('/* variáveis */');

        var list = node.list || [],
            ids = [];

        for (var i=0; i<list.length; i++) {
            ids.push(list[i].id);
        }

        if (ids.length > 0) {
            this.buffer.writeLine('var ' + ids.join(', ') + ';');
        }

        this.buffer.writeLine('/* fim-variáveis */');
    },
    compileAssignmentExpressionNode: function (node) {
        this.buffer.writeLine();
        this.compileIdentifierNode(node.left);

         //we currently have only one assignment operator
        this.buffer.write('=');

        this.compileExpressionNode(node.right);
        this.buffer.write(';');
    },
    compileFunctionDeclarationListNode: function (node) {
        for (var i=0; i<node.list.length; i++) {
            this.compileFunctionDeclarationNode(node.list[i]);
        }
    },
    compileFunctionDeclarationNode: function (node) {
        this.buffer.writeLine('function ' + node.id + ' (');

        var ids = [];

        for (var i=0; i<node.params.length; i++) {
            ids.push(this.idPrefix + node.params[i].id);
        }

        this.buffer.write(ids.join(', ') + ') {');
        this.compileVariablesBlockNode({list: node.variables});
        this.compileStatementListNode(node.body);
        this.buffer.writeLine('}');
    },
    compileFunctionCallNode: function (node) {
        this.buffer.write(node.id);
        this.buffer.write('(');

        for (var i=0; i<node.args.length; i++) {
            this.compileExpressionNode(node.args[i]);

            if (i+1 < node.args.length) {
                this.buffer.write(', ');
            }
        }

        this.buffer.write(')');
    },
    compileFunctionStatementNode: function (node) {
        this.buffer.writeLine();
        this.compileFunctionCallNode(node.call);
        this.buffer.write(';');
    },
    compileReturnStatementNode: function (node) {
        this.buffer.writeLine('return ');
        this.compileExpressionNode(node.argument);
        this.buffer.write(';');
    },
    compileIfStatementNode: function (node) {
        this.buffer.writeLine('if (');
        this.compileExpressionNode(node.test);
        this.buffer.write(') {');
        this.compileStatementListNode(node.consequent);
        this.buffer.writeLine('}');

        if (node.alternate) {
            this.buffer.writeLine('else {');
            this.compileStatementListNode(node.alternate);
            this.buffer.writeLine('}');
        }
    },
    compileWhileStatementNode: function (node) {
        this.buffer.writeLine('while (');
        this.compileExpressionNode(node.test);
        this.buffer.write(') {');
        this.compileStatementListNode(node.body);
        this.buffer.writeLine('}');
    }, 
    compileForStatementNode: function (node) {
        this.buffer.writeLine('for (');
        this.compileExpressionNode(node.variable);
        this.buffer.write('=');
        this.compileExpressionNode(node.start);
        this.buffer.write('; ');
        this.compileExpressionNode(node.variable);
        this.buffer.write('<=');
        this.compileExpressionNode(node.end);
        this.buffer.write('; ');

        this.compileExpressionNode(node.variable);

        if (!node.update) {
            this.buffer.write('++');
        } else {
            this.buffer.write('+=');
            this.compileLiteralNode(node.update);
        }

        this.buffer.write(') {');
        this.compileStatementListNode(node.body);
        this.buffer.writeLine('}');
    },
    compileUnaryExpressionNode: function (node) {
        var op;

        if (node.operator === '~' || node.operator == 'não') {
            op = '!';
        } else {
            op = node.operator;
        }

        this.buffer.write(op);
        this.compileExpressionNode(node.argument);
    },
    compileBinaryExpressionNode: function (node) {
        var op;

        if (node.operator === '=') {
            op = '==';
        } else if (node.operator == '<>') {
            op = '!=';
        } else if (node.operator == 'e') {
            op = '&&';
        } else if (node.operator == 'ou') {
            op = '||';
        } else {
            op = node.operator;
        }

        this.buffer.write('(');
        this.compileExpressionNode(node.left);
        this.buffer.write(')');

        this.buffer.write(op);

        this.buffer.write('(');
        this.compileExpressionNode(node.right);
        this.buffer.write(')');
    },
    compileLogicalExpressionNode: function (node) {
        this.compileBinaryExpressionNode(node);
    },
    compileLiteralNode: function (node) {
        if (node.type == 'Boolean') {
            this.compileBooleanLiteral(node.value);
        } else {
            this.buffer.write(node.value);
        }
    },
    compileIdentifierNode: function (node) {
        this.buffer.write(this.idPrefix + node.id);
    },
    compileBooleanLiteral: function (value) {
        if (value == 'verdadeiro') {
            this.buffer.write('true');
        } else if (value == 'falso') {
            this.buffer.write('false');
        } else {
            throw new Error('Invalid Boolean: ' + value);
        } 
    },
    compileExpressionNode: function (node) {
        var name = '',
            exp = node.expression || node;

        name = 'compile' + exp.node + 'Node';

        if (this[name] !== undefined) {
            this[name].call(this, exp);
        }
    },
    compileStatementListNode: function (node) {
        var name = '',
            list = node.list || [];

        for (var i=0; i<list.length; i++) {
            name = 'compile' + list[i].node + 'Node';

            if (this[name] !== undefined) {
                this[name].call(this, list[i]);
            }
        }
    }
};

exports.compiler = Compiler;

})();

},{}],5:[function(require,module,exports){
/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

(function () {

'use strict';

function Context(items) {
    this.items = items || {};
}

Context.prototype = {
    setVariable: function (id, type, value) {
        this.items[id] = new ContextItem(id, type, value);
    },
    setFunction: function (id, fn) {
        this.items[id] = new ContextItem(id, 'Function', fn);
    },
    exists: function (id) {
        return this.items[id] !== undefined;
    },
    getItem: function (id) {
        return this.items[id];
    },
    getItemValue: function (id) {
        return (this.items[id] && this.items[id].value) || this.items[id];
    },
    copy: function () {
        var copied = {};
        
        for (var i in this.items) {
            if (this.items.hasOwnProperty(i)) {
                copied[i] = this.items[i];
            }
        }

        return new Context(copied);
    },
    attach: function (ctx) {
        if (!(ctx instanceof Context)) {
            throw new Error('A module needs to extends Context');
        }

        for (var i in ctx.items) {
            if (ctx.items.hasOwnProperty(i)) {
                if (this.items[i] !== undefined) {
                    throw new Error('The module property is already defined: ' + i);
                }
                this.items[i] = ctx.items[i];
            }
        }
    }
};

function ContextItem(id, type, value) {
    this.id = id;
    this.type = type;
    this.value = (value !== undefined) ? value : null;
}

exports.context = Context;

})();

},{}],6:[function(require,module,exports){
var process=require("__browserify_process");/* parser generated by jison 0.4.10 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var grammar = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"algorithm":3,"stm_algorithm":4,"stm_block":5,"EOF":6,"var_decl_block":7,"func_decl_list":8,"ALGORITMO":9,"T_IDENTIFICADOR":10,";":11,"VARIAVEIS":12,"FIM_VARIAVEIS":13,"var_decl_list":14,"var_decl":15,"var_decl_id":16,",":17,"var_decl_type":18,"tp_primitivo":19,"tp_matriz":20,":":21,"INTEIRO":22,"REAL":23,"CARACTERE":24,"LITERAL":25,"LOGICO":26,"tp_prim_pl":27,"INTEIROS":28,"REAIS":29,"CARACTERES":30,"LITERAIS":31,"LOGICOS":32,"tp_matriz_index_literal":33,"[":34,"T_INT_LIT":35,"]":36,"tp_matriz_index":37,"MATRIZ":38,"DE":39,"INICIO":40,"stm_list":41,"FIM":42,"stm":43,"stm_attr":44,"stm_fcall":45,"stm_ret":46,"stm_se":47,"stm_enquanto":48,"stm_para":49,"fcall":50,"RETORNE":51,"expr":52,"lvalue":53,"lvalue_array":54,":=":55,"SE":56,"ENTAO":57,"FIM_SE":58,"SENAO":59,"ENQUANTO":60,"FACA":61,"FIM_ENQUANTO":62,"PARA":63,"ATE":64,"stm_para_block":65,"passo":66,"FIM_PARA":67,"PASSO":68,"unary_pos_neg":69,"termo":70,"literal":71,"(":72,")":73,"+":74,"-":75,"unary_op":76,"~":77,"NAO":78,"expr_unary":79,"expr_multiply":80,"*":81,"/":82,"%":83,"expr_additive":84,"expr_relational":85,">":86,">=":87,"<":88,"<=":89,"expr_equal":90,"=":91,"<>":92,"expr_and":93,"&":94,"expr_or_exclusive":95,"^":96,"expr_or":97,"|":98,"expr_logical_and":99,"&&":100,"E":101,"expr_logical_or":102,"||":103,"OU":104,"fcall_args":105,"fcall_arg_list":106,"T_STRING_LIT":107,"T_REAL_LIT":108,"T_CARAC_LIT":109,"T_BOOL_LIT":110,"func_decl":111,"FUNCAO":112,"func_params":113,"func_type":114,"func_param_list":115,"func_param_decl":116,"$accept":0,"$end":1},
terminals_: {2:"error",6:"EOF",9:"ALGORITMO",10:"T_IDENTIFICADOR",11:";",12:"VARIAVEIS",13:"FIM_VARIAVEIS",17:",",21:":",22:"INTEIRO",23:"REAL",24:"CARACTERE",25:"LITERAL",26:"LOGICO",28:"INTEIROS",29:"REAIS",30:"CARACTERES",31:"LITERAIS",32:"LOGICOS",34:"[",35:"T_INT_LIT",36:"]",38:"MATRIZ",39:"DE",40:"INICIO",42:"FIM",51:"RETORNE",55:":=",56:"SE",57:"ENTAO",58:"FIM_SE",59:"SENAO",60:"ENQUANTO",61:"FACA",62:"FIM_ENQUANTO",63:"PARA",64:"ATE",67:"FIM_PARA",68:"PASSO",72:"(",73:")",74:"+",75:"-",77:"~",78:"NAO",81:"*",82:"/",83:"%",86:">",87:">=",88:"<",89:"<=",91:"=",92:"<>",94:"&",96:"^",98:"|",100:"&&",101:"E",103:"||",104:"OU",107:"T_STRING_LIT",108:"T_REAL_LIT",109:"T_CARAC_LIT",110:"T_BOOL_LIT",112:"FUNCAO"},
productions_: [0,[3,3],[3,5],[3,4],[3,4],[4,3],[7,2],[7,3],[14,1],[14,2],[16,1],[16,3],[18,1],[18,1],[15,4],[19,1],[19,1],[19,1],[19,1],[19,1],[27,1],[27,1],[27,1],[27,1],[27,1],[33,3],[37,1],[37,2],[20,4],[5,3],[5,2],[41,1],[41,2],[43,1],[43,1],[43,1],[43,1],[43,1],[43,1],[45,2],[46,3],[53,1],[53,2],[54,3],[54,4],[44,4],[47,4],[47,5],[47,7],[47,6],[47,6],[47,5],[48,5],[48,4],[49,7],[49,8],[65,2],[65,3],[66,2],[66,3],[70,1],[70,1],[70,1],[70,3],[69,1],[69,1],[76,1],[76,1],[76,1],[79,1],[79,2],[80,1],[80,3],[80,3],[80,3],[84,1],[84,3],[84,3],[85,1],[85,3],[85,3],[85,3],[85,3],[90,1],[90,3],[90,3],[93,1],[93,3],[95,1],[95,3],[97,1],[97,3],[99,1],[99,3],[99,3],[102,1],[102,3],[102,3],[52,1],[50,2],[105,2],[105,3],[106,1],[106,3],[71,1],[71,1],[71,1],[71,1],[71,1],[8,1],[8,2],[111,4],[111,5],[111,5],[111,6],[114,2],[113,2],[113,3],[115,1],[115,3],[116,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: return new yy.AlgorithmNode($$[$0-2], null, null, $$[$0-1]); 
break;
case 2: return new yy.AlgorithmNode($$[$0-4], $$[$0-3], $$[$0-1], $$[$0-2]); 
break;
case 3: return new yy.AlgorithmNode($$[$0-3], null, $$[$0-1], $$[$0-2]); 
break;
case 4: return new yy.AlgorithmNode($$[$0-3], $$[$0-2], null, $$[$0-1]); 
break;
case 5: this.$ = $$[$0-1]; 
break;
case 6: this.$ = new yy.VariablesBlockNode([]); 
break;
case 7: this.$ = new yy.VariablesBlockNode($$[$0-1]); 
break;
case 8: this.$ = $$[$0]; 
break;
case 9: this.$ = $$[$0-1].concat($$[$0]); 
break;
case 10: this.$ = [$$[$0]]; 
break;
case 11: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 14: this.$ = yy.Util.createVariableDeclarationList($$[$0-3], $$[$0-1]); 
break;
case 29: this.$ = $$[$0-1]; 
break;
case 30: this.$ = []; 
break;
case 31: this.$ = new yy.StatementListNode([$$[$0]]); 
break;
case 32: $$[$0-1].list.push($$[$0]); this.$ = $$[$0-1]; 
break;
case 39: this.$ = new yy.FunctionStatementNode($$[$0-1]); 
break;
case 40: this.$ = new yy.ReturnStatementNode($$[$0-1]); 
break;
case 41: this.$ = new yy.IdentifierNode($$[$0]); 
break;
case 45: this.$ = new yy.AssignmentExpressionNode($$[$0-2], $$[$0-3], $$[$0-1]); 
break;
case 46: this.$ = new yy.IfStatementNode($$[$0-2], []); 
break;
case 47: this.$ = new yy.IfStatementNode($$[$0-3], $$[$0-1]); 
break;
case 48: this.$ = new yy.IfStatementNode($$[$0-5], $$[$0-3], $$[$0-1]); 
break;
case 49: this.$ = new yy.IfStatementNode($$[$0-4], [], $$[$0-1]); 
break;
case 50: this.$ = new yy.IfStatementNode($$[$0-4], $$[$0-2], []); 
break;
case 51: this.$ = new yy.IfStatementNode($$[$0-3], [], []); 
break;
case 52: this.$ = new yy.WhileStatementNode($$[$0-3], $$[$0-1]); 
break;
case 53: this.$ = new yy.WhileStatementNode($$[$0-2], []); 
break;
case 54: this.$ = new yy.ForStatementNode($$[$0-5], $$[$0-3], $$[$0-1], null, $$[$0]); 
break;
case 55: this.$ = new yy.ForStatementNode($$[$0-6], $$[$0-4], $$[$0-2], $$[$0-1], $$[$0]); 
break;
case 56: this.$ = []; 
break;
case 57: this.$ = $$[$0-1]; 
break;
case 58: this.$ = new yy.LiteralNode('Integer', yy.Util.createNumberFromRawString($$[$0]), $$[$0]); 
break;
case 59: this.$ = new yy.LiteralNode('Integer', yy.Util.createNumberFromRawString($$[$0-1] + $$[$0]), $$[$0-1] + $$[$0]); 
break;
case 63: this.$ = $$[$0-1]; 
break;
case 70: this.$ = new yy.UnaryExpressionNode($$[$0-1], $$[$0]); 
break;
case 72: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 73: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 74: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 76: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 77: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 79: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 80: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 81: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 82: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 84: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 85: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 87: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 89: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 91: this.$ = new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 93: this.$ = new yy.LogicalExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 94: this.$ = new yy.LogicalExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 96: this.$ = new yy.LogicalExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 97: this.$ = new yy.LogicalExpressionNode($$[$0-1], $$[$0-2], $$[$0]); 
break;
case 98: this.$ = new yy.ExpressionNode($$[$0]); 
break;
case 99: this.$ = new yy.FunctionCallNode($$[$0-1], $$[$0]); 
break;
case 100: this.$ = []; 
break;
case 101: this.$ = $$[$0-1]; 
break;
case 102: this.$ = [$$[$0]]; 
break;
case 103: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 104: this.$ = new yy.LiteralNode('literal', $$[$0], $$[$0]); 
break;
case 105: this.$ = new yy.LiteralNode('inteiro', yy.Util.createNumberFromRawString($$[$0]), $$[$0]); 
break;
case 106: this.$ = new yy.LiteralNode('real', new Number($$[$0]), $$[$0]); 
break;
case 107: this.$ = new yy.LiteralNode('caractere', $$[$0], $$[$0]); 
break;
case 108: this.$ = new yy.LiteralNode('lógico', $$[$0], $$[$0]); 
break;
case 109: this.$ = new yy.FunctionDeclarationListNode([$$[$0]]); 
break;
case 110: $$[$0-1].list.push($$[$0]); this.$ = $$[$0-1]; 
break;
case 111: this.$ = new yy.FunctionDeclarationNode($$[$0-2], null, $$[$0-1], [], $$[$0]); 
break;
case 112: this.$ = new yy.FunctionDeclarationNode($$[$0-3], null, $$[$0-2], $$[$0-1], $$[$0]); 
break;
case 113: this.$ = new yy.FunctionDeclarationNode($$[$0-3], $$[$0-1], $$[$0-2], [], $$[$0]); 
break;
case 114: this.$ = new yy.FunctionDeclarationNode($$[$0-4], $$[$0-2], $$[$0-3], $$[$0-1], $$[$0]); 
break;
case 115: this.$ = $$[$0]; 
break;
case 116: this.$ = []; 
break;
case 117: this.$ = $$[$0-1]; 
break;
case 118: this.$ = [$$[$0]]; 
break;
case 119: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 120: this.$ = new yy.FunctionParameterNode($$[$0-2], $$[$0]); 
break;
}
},
table: [{3:1,4:2,9:[1,3]},{1:[3]},{5:4,7:5,12:[1,7],40:[1,6]},{10:[1,8]},{6:[1,9],8:10,111:11,112:[1,12]},{5:13,40:[1,6]},{10:[1,29],41:14,42:[1,15],43:16,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],60:[1,27],63:[1,28]},{10:[1,34],13:[1,30],14:31,15:32,16:33},{11:[1,35]},{1:[2,1]},{6:[1,36],111:37,112:[1,12]},{6:[2,109],112:[2,109]},{10:[1,38]},{6:[1,40],8:39,111:11,112:[1,12]},{10:[1,29],42:[1,41],43:42,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],60:[1,27],63:[1,28]},{6:[2,30],112:[2,30]},{10:[2,31],42:[2,31],51:[2,31],56:[2,31],58:[2,31],59:[2,31],60:[2,31],62:[2,31],63:[2,31],67:[2,31]},{10:[2,33],42:[2,33],51:[2,33],56:[2,33],58:[2,33],59:[2,33],60:[2,33],62:[2,33],63:[2,33],67:[2,33]},{10:[2,34],42:[2,34],51:[2,34],56:[2,34],58:[2,34],59:[2,34],60:[2,34],62:[2,34],63:[2,34],67:[2,34]},{10:[2,35],42:[2,35],51:[2,35],56:[2,35],58:[2,35],59:[2,35],60:[2,35],62:[2,35],63:[2,35],67:[2,35]},{10:[2,36],42:[2,36],51:[2,36],56:[2,36],58:[2,36],59:[2,36],60:[2,36],62:[2,36],63:[2,36],67:[2,36]},{10:[2,37],42:[2,37],51:[2,37],56:[2,37],58:[2,37],59:[2,37],60:[2,37],62:[2,37],63:[2,37],67:[2,37]},{10:[2,38],42:[2,38],51:[2,38],56:[2,38],58:[2,38],59:[2,38],60:[2,38],62:[2,38],63:[2,38],67:[2,38]},{55:[1,43]},{11:[1,44]},{10:[1,29],35:[1,66],50:58,52:45,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,52:72,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,52:73,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,75],53:74},{11:[2,41],17:[2,41],34:[1,78],36:[2,41],54:76,55:[2,41],57:[2,41],61:[2,41],64:[2,41],68:[2,41],72:[1,79],73:[2,41],74:[2,41],75:[2,41],81:[2,41],82:[2,41],83:[2,41],86:[2,41],87:[2,41],88:[2,41],89:[2,41],91:[2,41],92:[2,41],94:[2,41],96:[2,41],98:[2,41],100:[2,41],101:[2,41],103:[2,41],104:[2,41],105:77},{40:[2,6]},{10:[1,34],13:[1,80],15:81,16:33},{10:[2,8],13:[2,8],40:[2,8]},{17:[1,83],21:[1,82]},{17:[2,10],21:[2,10]},{12:[2,5],40:[2,5]},{1:[2,3]},{6:[2,110],112:[2,110]},{72:[1,85],113:84},{6:[1,86],111:37,112:[1,12]},{1:[2,4]},{6:[2,29],112:[2,29]},{10:[2,32],42:[2,32],51:[2,32],56:[2,32],58:[2,32],59:[2,32],60:[2,32],62:[2,32],63:[2,32],67:[2,32]},{10:[1,29],35:[1,66],50:58,52:87,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[2,39],42:[2,39],51:[2,39],56:[2,39],58:[2,39],59:[2,39],60:[2,39],62:[2,39],63:[2,39],67:[2,39]},{11:[1,88]},{11:[2,98],17:[2,98],36:[2,98],57:[2,98],61:[2,98],64:[2,98],68:[2,98],73:[2,98],103:[1,89],104:[1,90]},{11:[2,95],17:[2,95],36:[2,95],57:[2,95],61:[2,95],64:[2,95],68:[2,95],73:[2,95],100:[1,91],101:[1,92],103:[2,95],104:[2,95]},{11:[2,92],17:[2,92],36:[2,92],57:[2,92],61:[2,92],64:[2,92],68:[2,92],73:[2,92],98:[1,93],100:[2,92],101:[2,92],103:[2,92],104:[2,92]},{11:[2,90],17:[2,90],36:[2,90],57:[2,90],61:[2,90],64:[2,90],68:[2,90],73:[2,90],96:[1,94],98:[2,90],100:[2,90],101:[2,90],103:[2,90],104:[2,90]},{11:[2,88],17:[2,88],36:[2,88],57:[2,88],61:[2,88],64:[2,88],68:[2,88],73:[2,88],94:[1,95],96:[2,88],98:[2,88],100:[2,88],101:[2,88],103:[2,88],104:[2,88]},{11:[2,86],17:[2,86],36:[2,86],57:[2,86],61:[2,86],64:[2,86],68:[2,86],73:[2,86],91:[1,96],92:[1,97],94:[2,86],96:[2,86],98:[2,86],100:[2,86],101:[2,86],103:[2,86],104:[2,86]},{11:[2,83],17:[2,83],36:[2,83],57:[2,83],61:[2,83],64:[2,83],68:[2,83],73:[2,83],86:[1,98],87:[1,99],88:[1,100],89:[1,101],91:[2,83],92:[2,83],94:[2,83],96:[2,83],98:[2,83],100:[2,83],101:[2,83],103:[2,83],104:[2,83]},{11:[2,78],17:[2,78],36:[2,78],57:[2,78],61:[2,78],64:[2,78],68:[2,78],73:[2,78],74:[1,102],75:[1,103],86:[2,78],87:[2,78],88:[2,78],89:[2,78],91:[2,78],92:[2,78],94:[2,78],96:[2,78],98:[2,78],100:[2,78],101:[2,78],103:[2,78],104:[2,78]},{11:[2,75],17:[2,75],36:[2,75],57:[2,75],61:[2,75],64:[2,75],68:[2,75],73:[2,75],74:[2,75],75:[2,75],81:[1,104],82:[1,105],83:[1,106],86:[2,75],87:[2,75],88:[2,75],89:[2,75],91:[2,75],92:[2,75],94:[2,75],96:[2,75],98:[2,75],100:[2,75],101:[2,75],103:[2,75],104:[2,75]},{11:[2,71],17:[2,71],36:[2,71],57:[2,71],61:[2,71],64:[2,71],68:[2,71],73:[2,71],74:[2,71],75:[2,71],81:[2,71],82:[2,71],83:[2,71],86:[2,71],87:[2,71],88:[2,71],89:[2,71],91:[2,71],92:[2,71],94:[2,71],96:[2,71],98:[2,71],100:[2,71],101:[2,71],103:[2,71],104:[2,71]},{11:[2,69],17:[2,69],36:[2,69],57:[2,69],61:[2,69],64:[2,69],68:[2,69],73:[2,69],74:[2,69],75:[2,69],81:[2,69],82:[2,69],83:[2,69],86:[2,69],87:[2,69],88:[2,69],89:[2,69],91:[2,69],92:[2,69],94:[2,69],96:[2,69],98:[2,69],100:[2,69],101:[2,69],103:[2,69],104:[2,69]},{10:[1,29],35:[1,66],50:58,53:59,70:107,71:60,72:[1,61],107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{11:[2,60],17:[2,60],36:[2,60],57:[2,60],61:[2,60],64:[2,60],68:[2,60],73:[2,60],74:[2,60],75:[2,60],81:[2,60],82:[2,60],83:[2,60],86:[2,60],87:[2,60],88:[2,60],89:[2,60],91:[2,60],92:[2,60],94:[2,60],96:[2,60],98:[2,60],100:[2,60],101:[2,60],103:[2,60],104:[2,60]},{11:[2,61],17:[2,61],36:[2,61],57:[2,61],61:[2,61],64:[2,61],68:[2,61],73:[2,61],74:[2,61],75:[2,61],81:[2,61],82:[2,61],83:[2,61],86:[2,61],87:[2,61],88:[2,61],89:[2,61],91:[2,61],92:[2,61],94:[2,61],96:[2,61],98:[2,61],100:[2,61],101:[2,61],103:[2,61],104:[2,61]},{11:[2,62],17:[2,62],36:[2,62],57:[2,62],61:[2,62],64:[2,62],68:[2,62],73:[2,62],74:[2,62],75:[2,62],81:[2,62],82:[2,62],83:[2,62],86:[2,62],87:[2,62],88:[2,62],89:[2,62],91:[2,62],92:[2,62],94:[2,62],96:[2,62],98:[2,62],100:[2,62],101:[2,62],103:[2,62],104:[2,62]},{10:[1,29],35:[1,66],50:58,52:108,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[2,66],35:[2,66],72:[2,66],107:[2,66],108:[2,66],109:[2,66],110:[2,66]},{10:[2,67],35:[2,67],72:[2,67],107:[2,67],108:[2,67],109:[2,67],110:[2,67]},{10:[2,68],35:[2,68],72:[2,68],107:[2,68],108:[2,68],109:[2,68],110:[2,68]},{11:[2,104],17:[2,104],36:[2,104],57:[2,104],61:[2,104],64:[2,104],68:[2,104],73:[2,104],74:[2,104],75:[2,104],81:[2,104],82:[2,104],83:[2,104],86:[2,104],87:[2,104],88:[2,104],89:[2,104],91:[2,104],92:[2,104],94:[2,104],96:[2,104],98:[2,104],100:[2,104],101:[2,104],103:[2,104],104:[2,104]},{11:[2,105],17:[2,105],36:[2,105],57:[2,105],61:[2,105],64:[2,105],68:[2,105],73:[2,105],74:[2,105],75:[2,105],81:[2,105],82:[2,105],83:[2,105],86:[2,105],87:[2,105],88:[2,105],89:[2,105],91:[2,105],92:[2,105],94:[2,105],96:[2,105],98:[2,105],100:[2,105],101:[2,105],103:[2,105],104:[2,105]},{11:[2,106],17:[2,106],36:[2,106],57:[2,106],61:[2,106],64:[2,106],68:[2,106],73:[2,106],74:[2,106],75:[2,106],81:[2,106],82:[2,106],83:[2,106],86:[2,106],87:[2,106],88:[2,106],89:[2,106],91:[2,106],92:[2,106],94:[2,106],96:[2,106],98:[2,106],100:[2,106],101:[2,106],103:[2,106],104:[2,106]},{11:[2,107],17:[2,107],36:[2,107],57:[2,107],61:[2,107],64:[2,107],68:[2,107],73:[2,107],74:[2,107],75:[2,107],81:[2,107],82:[2,107],83:[2,107],86:[2,107],87:[2,107],88:[2,107],89:[2,107],91:[2,107],92:[2,107],94:[2,107],96:[2,107],98:[2,107],100:[2,107],101:[2,107],103:[2,107],104:[2,107]},{11:[2,108],17:[2,108],36:[2,108],57:[2,108],61:[2,108],64:[2,108],68:[2,108],73:[2,108],74:[2,108],75:[2,108],81:[2,108],82:[2,108],83:[2,108],86:[2,108],87:[2,108],88:[2,108],89:[2,108],91:[2,108],92:[2,108],94:[2,108],96:[2,108],98:[2,108],100:[2,108],101:[2,108],103:[2,108],104:[2,108]},{10:[2,64],35:[2,64],72:[2,64],107:[2,64],108:[2,64],109:[2,64],110:[2,64]},{10:[2,65],35:[2,65],72:[2,65],107:[2,65],108:[2,65],109:[2,65],110:[2,65]},{57:[1,109]},{61:[1,110]},{39:[1,111]},{34:[1,78],39:[2,41],54:76},{11:[2,42],17:[2,42],34:[1,112],36:[2,42],39:[2,42],55:[2,42],57:[2,42],61:[2,42],64:[2,42],68:[2,42],73:[2,42],74:[2,42],75:[2,42],81:[2,42],82:[2,42],83:[2,42],86:[2,42],87:[2,42],88:[2,42],89:[2,42],91:[2,42],92:[2,42],94:[2,42],96:[2,42],98:[2,42],100:[2,42],101:[2,42],103:[2,42],104:[2,42]},{11:[2,99],17:[2,99],36:[2,99],57:[2,99],61:[2,99],64:[2,99],68:[2,99],73:[2,99],74:[2,99],75:[2,99],81:[2,99],82:[2,99],83:[2,99],86:[2,99],87:[2,99],88:[2,99],89:[2,99],91:[2,99],92:[2,99],94:[2,99],96:[2,99],98:[2,99],100:[2,99],101:[2,99],103:[2,99],104:[2,99]},{10:[1,29],35:[1,66],50:58,52:113,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,52:116,53:59,69:62,70:56,71:60,72:[1,61],73:[1,114],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,106:115,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{40:[2,7]},{10:[2,9],13:[2,9],40:[2,9]},{18:117,19:118,20:119,22:[1,120],23:[1,121],24:[1,122],25:[1,123],26:[1,124],38:[1,125]},{10:[1,126]},{5:127,10:[1,34],14:128,15:32,16:33,21:[1,130],40:[1,6],114:129},{10:[1,134],73:[1,131],115:132,116:133},{1:[2,2]},{11:[1,135]},{10:[2,40],42:[2,40],51:[2,40],56:[2,40],58:[2,40],59:[2,40],60:[2,40],62:[2,40],63:[2,40],67:[2,40]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:136,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:137,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:138,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:139,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:140,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:141,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:142,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:143,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:144,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:145,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:146,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:147,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:148,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:149,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:150,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:151,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:152,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:153,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{11:[2,70],17:[2,70],36:[2,70],57:[2,70],61:[2,70],64:[2,70],68:[2,70],73:[2,70],74:[2,70],75:[2,70],81:[2,70],82:[2,70],83:[2,70],86:[2,70],87:[2,70],88:[2,70],89:[2,70],91:[2,70],92:[2,70],94:[2,70],96:[2,70],98:[2,70],100:[2,70],101:[2,70],103:[2,70],104:[2,70]},{73:[1,154]},{10:[1,29],41:156,43:16,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],58:[1,155],59:[1,157],60:[1,27],63:[1,28]},{10:[1,29],41:158,43:16,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],60:[1,27],62:[1,159],63:[1,28]},{10:[1,29],35:[1,66],50:58,52:160,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[1,29],35:[1,66],50:58,52:161,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{36:[1,162]},{11:[2,100],17:[2,100],36:[2,100],57:[2,100],61:[2,100],64:[2,100],68:[2,100],73:[2,100],74:[2,100],75:[2,100],81:[2,100],82:[2,100],83:[2,100],86:[2,100],87:[2,100],88:[2,100],89:[2,100],91:[2,100],92:[2,100],94:[2,100],96:[2,100],98:[2,100],100:[2,100],101:[2,100],103:[2,100],104:[2,100]},{17:[1,164],73:[1,163]},{17:[2,102],73:[2,102]},{11:[1,165]},{11:[2,12],17:[2,12],73:[2,12]},{11:[2,13],17:[2,13],73:[2,13]},{10:[2,15],11:[2,15],17:[2,15],40:[2,15],73:[2,15]},{10:[2,16],11:[2,16],17:[2,16],40:[2,16],73:[2,16]},{10:[2,17],11:[2,17],17:[2,17],40:[2,17],73:[2,17]},{10:[2,18],11:[2,18],17:[2,18],40:[2,18],73:[2,18]},{10:[2,19],11:[2,19],17:[2,19],40:[2,19],73:[2,19]},{33:167,34:[1,168],37:166},{17:[2,11],21:[2,11]},{6:[2,111],112:[2,111]},{5:169,10:[1,34],15:81,16:33,40:[1,6]},{5:170,10:[1,34],14:171,15:32,16:33,40:[1,6]},{19:172,22:[1,120],23:[1,121],24:[1,122],25:[1,123],26:[1,124]},{10:[2,116],21:[2,116],40:[2,116]},{17:[1,174],73:[1,173]},{17:[2,118],73:[2,118]},{21:[1,175]},{10:[2,45],42:[2,45],51:[2,45],56:[2,45],58:[2,45],59:[2,45],60:[2,45],62:[2,45],63:[2,45],67:[2,45]},{11:[2,96],17:[2,96],36:[2,96],57:[2,96],61:[2,96],64:[2,96],68:[2,96],73:[2,96],100:[1,91],101:[1,92],103:[2,96],104:[2,96]},{11:[2,97],17:[2,97],36:[2,97],57:[2,97],61:[2,97],64:[2,97],68:[2,97],73:[2,97],100:[1,91],101:[1,92],103:[2,97],104:[2,97]},{11:[2,93],17:[2,93],36:[2,93],57:[2,93],61:[2,93],64:[2,93],68:[2,93],73:[2,93],98:[1,93],100:[2,93],101:[2,93],103:[2,93],104:[2,93]},{11:[2,94],17:[2,94],36:[2,94],57:[2,94],61:[2,94],64:[2,94],68:[2,94],73:[2,94],98:[1,93],100:[2,94],101:[2,94],103:[2,94],104:[2,94]},{11:[2,91],17:[2,91],36:[2,91],57:[2,91],61:[2,91],64:[2,91],68:[2,91],73:[2,91],96:[1,94],98:[2,91],100:[2,91],101:[2,91],103:[2,91],104:[2,91]},{11:[2,89],17:[2,89],36:[2,89],57:[2,89],61:[2,89],64:[2,89],68:[2,89],73:[2,89],94:[1,95],96:[2,89],98:[2,89],100:[2,89],101:[2,89],103:[2,89],104:[2,89]},{11:[2,87],17:[2,87],36:[2,87],57:[2,87],61:[2,87],64:[2,87],68:[2,87],73:[2,87],91:[1,96],92:[1,97],94:[2,87],96:[2,87],98:[2,87],100:[2,87],101:[2,87],103:[2,87],104:[2,87]},{11:[2,84],17:[2,84],36:[2,84],57:[2,84],61:[2,84],64:[2,84],68:[2,84],73:[2,84],86:[1,98],87:[1,99],88:[1,100],89:[1,101],91:[2,84],92:[2,84],94:[2,84],96:[2,84],98:[2,84],100:[2,84],101:[2,84],103:[2,84],104:[2,84]},{11:[2,85],17:[2,85],36:[2,85],57:[2,85],61:[2,85],64:[2,85],68:[2,85],73:[2,85],86:[1,98],87:[1,99],88:[1,100],89:[1,101],91:[2,85],92:[2,85],94:[2,85],96:[2,85],98:[2,85],100:[2,85],101:[2,85],103:[2,85],104:[2,85]},{11:[2,79],17:[2,79],36:[2,79],57:[2,79],61:[2,79],64:[2,79],68:[2,79],73:[2,79],74:[1,102],75:[1,103],86:[2,79],87:[2,79],88:[2,79],89:[2,79],91:[2,79],92:[2,79],94:[2,79],96:[2,79],98:[2,79],100:[2,79],101:[2,79],103:[2,79],104:[2,79]},{11:[2,80],17:[2,80],36:[2,80],57:[2,80],61:[2,80],64:[2,80],68:[2,80],73:[2,80],74:[1,102],75:[1,103],86:[2,80],87:[2,80],88:[2,80],89:[2,80],91:[2,80],92:[2,80],94:[2,80],96:[2,80],98:[2,80],100:[2,80],101:[2,80],103:[2,80],104:[2,80]},{11:[2,81],17:[2,81],36:[2,81],57:[2,81],61:[2,81],64:[2,81],68:[2,81],73:[2,81],74:[1,102],75:[1,103],86:[2,81],87:[2,81],88:[2,81],89:[2,81],91:[2,81],92:[2,81],94:[2,81],96:[2,81],98:[2,81],100:[2,81],101:[2,81],103:[2,81],104:[2,81]},{11:[2,82],17:[2,82],36:[2,82],57:[2,82],61:[2,82],64:[2,82],68:[2,82],73:[2,82],74:[1,102],75:[1,103],86:[2,82],87:[2,82],88:[2,82],89:[2,82],91:[2,82],92:[2,82],94:[2,82],96:[2,82],98:[2,82],100:[2,82],101:[2,82],103:[2,82],104:[2,82]},{11:[2,76],17:[2,76],36:[2,76],57:[2,76],61:[2,76],64:[2,76],68:[2,76],73:[2,76],74:[2,76],75:[2,76],81:[1,104],82:[1,105],83:[1,106],86:[2,76],87:[2,76],88:[2,76],89:[2,76],91:[2,76],92:[2,76],94:[2,76],96:[2,76],98:[2,76],100:[2,76],101:[2,76],103:[2,76],104:[2,76]},{11:[2,77],17:[2,77],36:[2,77],57:[2,77],61:[2,77],64:[2,77],68:[2,77],73:[2,77],74:[2,77],75:[2,77],81:[1,104],82:[1,105],83:[1,106],86:[2,77],87:[2,77],88:[2,77],89:[2,77],91:[2,77],92:[2,77],94:[2,77],96:[2,77],98:[2,77],100:[2,77],101:[2,77],103:[2,77],104:[2,77]},{11:[2,72],17:[2,72],36:[2,72],57:[2,72],61:[2,72],64:[2,72],68:[2,72],73:[2,72],74:[2,72],75:[2,72],81:[2,72],82:[2,72],83:[2,72],86:[2,72],87:[2,72],88:[2,72],89:[2,72],91:[2,72],92:[2,72],94:[2,72],96:[2,72],98:[2,72],100:[2,72],101:[2,72],103:[2,72],104:[2,72]},{11:[2,73],17:[2,73],36:[2,73],57:[2,73],61:[2,73],64:[2,73],68:[2,73],73:[2,73],74:[2,73],75:[2,73],81:[2,73],82:[2,73],83:[2,73],86:[2,73],87:[2,73],88:[2,73],89:[2,73],91:[2,73],92:[2,73],94:[2,73],96:[2,73],98:[2,73],100:[2,73],101:[2,73],103:[2,73],104:[2,73]},{11:[2,74],17:[2,74],36:[2,74],57:[2,74],61:[2,74],64:[2,74],68:[2,74],73:[2,74],74:[2,74],75:[2,74],81:[2,74],82:[2,74],83:[2,74],86:[2,74],87:[2,74],88:[2,74],89:[2,74],91:[2,74],92:[2,74],94:[2,74],96:[2,74],98:[2,74],100:[2,74],101:[2,74],103:[2,74],104:[2,74]},{11:[2,63],17:[2,63],36:[2,63],57:[2,63],61:[2,63],64:[2,63],68:[2,63],73:[2,63],74:[2,63],75:[2,63],81:[2,63],82:[2,63],83:[2,63],86:[2,63],87:[2,63],88:[2,63],89:[2,63],91:[2,63],92:[2,63],94:[2,63],96:[2,63],98:[2,63],100:[2,63],101:[2,63],103:[2,63],104:[2,63]},{10:[2,46],42:[2,46],51:[2,46],56:[2,46],58:[2,46],59:[2,46],60:[2,46],62:[2,46],63:[2,46],67:[2,46]},{10:[1,29],43:42,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],58:[1,176],59:[1,177],60:[1,27],63:[1,28]},{10:[1,29],41:178,43:16,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],58:[1,179],60:[1,27],63:[1,28]},{10:[1,29],43:42,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],60:[1,27],62:[1,180],63:[1,28]},{10:[2,53],42:[2,53],51:[2,53],56:[2,53],58:[2,53],59:[2,53],60:[2,53],62:[2,53],63:[2,53],67:[2,53]},{64:[1,181]},{36:[1,182]},{11:[2,43],17:[2,43],34:[2,43],36:[2,43],39:[2,43],55:[2,43],57:[2,43],61:[2,43],64:[2,43],68:[2,43],73:[2,43],74:[2,43],75:[2,43],81:[2,43],82:[2,43],83:[2,43],86:[2,43],87:[2,43],88:[2,43],89:[2,43],91:[2,43],92:[2,43],94:[2,43],96:[2,43],98:[2,43],100:[2,43],101:[2,43],103:[2,43],104:[2,43]},{11:[2,101],17:[2,101],36:[2,101],57:[2,101],61:[2,101],64:[2,101],68:[2,101],73:[2,101],74:[2,101],75:[2,101],81:[2,101],82:[2,101],83:[2,101],86:[2,101],87:[2,101],88:[2,101],89:[2,101],91:[2,101],92:[2,101],94:[2,101],96:[2,101],98:[2,101],100:[2,101],101:[2,101],103:[2,101],104:[2,101]},{10:[1,29],35:[1,66],50:58,52:183,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{10:[2,14],13:[2,14],40:[2,14]},{33:185,34:[1,168],39:[1,184]},{34:[2,26],39:[2,26]},{35:[1,186]},{6:[2,112],112:[2,112]},{6:[2,113],112:[2,113]},{5:187,10:[1,34],15:81,16:33,40:[1,6]},{10:[2,115],40:[2,115]},{10:[2,117],21:[2,117],40:[2,117]},{10:[1,134],116:188},{18:189,19:118,20:119,22:[1,120],23:[1,121],24:[1,122],25:[1,123],26:[1,124],38:[1,125]},{10:[2,47],42:[2,47],51:[2,47],56:[2,47],58:[2,47],59:[2,47],60:[2,47],62:[2,47],63:[2,47],67:[2,47]},{10:[1,29],41:190,43:16,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],58:[1,191],60:[1,27],63:[1,28]},{10:[1,29],43:42,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],58:[1,192],60:[1,27],63:[1,28]},{10:[2,51],42:[2,51],51:[2,51],56:[2,51],58:[2,51],59:[2,51],60:[2,51],62:[2,51],63:[2,51],67:[2,51]},{10:[2,52],42:[2,52],51:[2,52],56:[2,52],58:[2,52],59:[2,52],60:[2,52],62:[2,52],63:[2,52],67:[2,52]},{10:[1,29],35:[1,66],50:58,52:193,53:59,69:62,70:56,71:60,72:[1,61],74:[1,70],75:[1,71],76:57,77:[1,63],78:[1,64],79:55,80:54,84:53,85:52,90:51,93:50,95:49,97:48,99:47,102:46,107:[1,65],108:[1,67],109:[1,68],110:[1,69]},{11:[2,44],17:[2,44],34:[2,44],36:[2,44],39:[2,44],55:[2,44],57:[2,44],61:[2,44],64:[2,44],68:[2,44],73:[2,44],74:[2,44],75:[2,44],81:[2,44],82:[2,44],83:[2,44],86:[2,44],87:[2,44],88:[2,44],89:[2,44],91:[2,44],92:[2,44],94:[2,44],96:[2,44],98:[2,44],100:[2,44],101:[2,44],103:[2,44],104:[2,44]},{17:[2,103],73:[2,103]},{27:194,28:[1,195],29:[1,196],30:[1,197],31:[1,198],32:[1,199]},{34:[2,27],39:[2,27]},{36:[1,200]},{6:[2,114],112:[2,114]},{17:[2,119],73:[2,119]},{17:[2,120],73:[2,120]},{10:[1,29],43:42,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],58:[1,201],60:[1,27],63:[1,28]},{10:[2,50],42:[2,50],51:[2,50],56:[2,50],58:[2,50],59:[2,50],60:[2,50],62:[2,50],63:[2,50],67:[2,50]},{10:[2,49],42:[2,49],51:[2,49],56:[2,49],58:[2,49],59:[2,49],60:[2,49],62:[2,49],63:[2,49],67:[2,49]},{61:[1,204],65:202,66:203,68:[1,205]},{11:[2,28],17:[2,28],73:[2,28]},{11:[2,20],17:[2,20],73:[2,20]},{11:[2,21],17:[2,21],73:[2,21]},{11:[2,22],17:[2,22],73:[2,22]},{11:[2,23],17:[2,23],73:[2,23]},{11:[2,24],17:[2,24],73:[2,24]},{34:[2,25],39:[2,25]},{10:[2,48],42:[2,48],51:[2,48],56:[2,48],58:[2,48],59:[2,48],60:[2,48],62:[2,48],63:[2,48],67:[2,48]},{10:[2,54],42:[2,54],51:[2,54],56:[2,54],58:[2,54],59:[2,54],60:[2,54],62:[2,54],63:[2,54],67:[2,54]},{61:[1,204],65:206},{10:[1,29],41:208,43:16,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],60:[1,27],63:[1,28],67:[1,207]},{35:[1,209],69:210,74:[1,70],75:[1,71]},{10:[2,55],42:[2,55],51:[2,55],56:[2,55],58:[2,55],59:[2,55],60:[2,55],62:[2,55],63:[2,55],67:[2,55]},{10:[2,56],42:[2,56],51:[2,56],56:[2,56],58:[2,56],59:[2,56],60:[2,56],62:[2,56],63:[2,56],67:[2,56]},{10:[1,29],43:42,44:17,45:18,46:19,47:20,48:21,49:22,50:24,51:[1,25],53:23,56:[1,26],60:[1,27],63:[1,28],67:[1,211]},{61:[2,58]},{35:[1,212]},{10:[2,57],42:[2,57],51:[2,57],56:[2,57],58:[2,57],59:[2,57],60:[2,57],62:[2,57],63:[2,57],67:[2,57]},{61:[2,59]}],
defaultActions: {9:[2,1],30:[2,6],36:[2,3],40:[2,4],80:[2,7],86:[2,2],209:[2,58],212:[2,59]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: /* ignore comment */ 
break;
case 1: this.begin('comment'); 
break;
case 2: this.popState(); 
break;
case 3: /* ignore comment */ 
break;
case 4: /* ignore space */ 
break;
case 5: return 6; 
break;
case 6: return "T_INT_LIT" 
break;
case 7: return "T_REAL_LIT" 
break;
case 8: return "T_STRING_LIT"; 
break;
case 9: return "T_STRING_LIT"; 
break;
case 10: return "T_CARAC_LIT"; 
break;
case 11: return "T_BOOL_LIT"; 
break;
case 12: return "T_BOOL_LIT"; 
break;
case 13: return "ALGORITMO"; 
break;
case 14: return "VARIAVEIS"; 
break;
case 15: return "FIM_VARIAVEIS"; 
break;
case 16: return "FIM_ENQUANTO"; 
break;
case 17: return "FIM_PARA"; 
break;
case 18: return "FIM_SE"; 
break;
case 19: return "FIM"; 
break;
case 20: return "INTEIRO"; 
break;
case 21: return "REAL"; 
break;
case 22: return "CARACTERE"; 
break;
case 23: return "LITERAL"; 
break;
case 24: return "LOGICO"; 
break;
case 25: return "INICIO"; 
break;
case 26: return "SE"; 
break;
case 27: return "SENAO"; 
break;
case 28: return "ENQUANTO"; 
break;
case 29: return "ENTAO"; 
break;
case 30: return "FACA"; 
break;
case 31: return "PARA"; 
break;
case 32: return "DE"; 
break;
case 33: return "ATE"; 
break;
case 34: return "E"; 
break;
case 35: return "OU"; 
break;
case 36: return "NAO"; 
break;
case 37: return "MATRIZ"; 
break;
case 38: return "INTEIROS"; 
break;
case 39: return "REAIS"; 
break;
case 40: return "CARACTERES"; 
break;
case 41: return "LITERAIS"; 
break;
case 42: return "LOGICOS"; 
break;
case 43: return "FUNCAO"; 
break;
case 44: return "RETORNE"; 
break;
case 45: return "PASSO"; 
break;
case 46: return "T_IDENTIFICADOR"; 
break;
case 47: return ":="; 
break;
case 48: return ";"; 
break;
case 49: return ":"; 
break;
case 50: return ","; 
break;
case 51: return "["; 
break;
case 52: return "]"; 
break;
case 53: return "("; 
break;
case 54: return ")"; 
break;
case 55: return "+"; 
break;
case 56: return "-"; 
break;
case 57: return "*"; 
break;
case 58: return "/"; 
break;
case 59: return "%"; 
break;
case 60: return "||"; 
break;
case 61: return "&&"; 
break;
case 62: return "|"; 
break;
case 63: return "&"; 
break;
case 64: return "^"; 
break;
case 65: return "~"; 
break;
case 66: return "<>"; 
break;
case 67: return ">="; 
break;
case 68: return "<="; 
break;
case 69: return "<"; 
break;
case 70: return ">"; 
break;
case 71: return "="; 
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*)/,/^(?:\*\/)/,/^(?:.)/,/^(?:\s+)/,/^(?:$)/,/^(?:(([0][cC][0-8]+)|([0][xX][0-9a-fA-F]+)|([0][bB][01]+)|([0-9]+)))/,/^(?:(([0-9]+)+[\.]([0-9]+)+))/,/^(?:"")/,/^(?:"([^"]|(\\.))*")/,/^(?:'(.|(\\.))')/,/^(?:verdadeiro\b)/,/^(?:falso\b)/,/^(?:algoritmo\b)/,/^(?:variáveis\b)/,/^(?:fim-variáveis\b)/,/^(?:fim-enquanto\b)/,/^(?:fim-para\b)/,/^(?:fim-se\b)/,/^(?:fim\b)/,/^(?:inteiro\b)/,/^(?:real\b)/,/^(?:caractere\b)/,/^(?:literal\b)/,/^(?:lógico\b)/,/^(?:início\b)/,/^(?:se\b)/,/^(?:senão\b)/,/^(?:enquanto\b)/,/^(?:então\b)/,/^(?:faça\b)/,/^(?:para\b)/,/^(?:de\b)/,/^(?:até)/,/^(?:e\b)/,/^(?:ou\b)/,/^(?:não\b)/,/^(?:matriz\b)/,/^(?:inteiros\b)/,/^(?:reais\b)/,/^(?:caracteres\b)/,/^(?:literais\b)/,/^(?:lógicos\b)/,/^(?:função\b)/,/^(?:retorne\b)/,/^(?:passo\b)/,/^(?:[a-zA-Z_][0-9a-zA-Z_]*)/,/^(?::=)/,/^(?:;)/,/^(?::)/,/^(?:,)/,/^(?:\[)/,/^(?:\])/,/^(?:\()/,/^(?:\))/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:\|)/,/^(?:&)/,/^(?:\^)/,/^(?:~)/,/^(?:<>)/,/^(?:>=)/,/^(?:<=)/,/^(?:<)/,/^(?:>)/,/^(?:=)/],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = grammar;
exports.Parser = grammar.Parser;
exports.parse = function () { return grammar.parse.apply(grammar, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
},{"__browserify_process":13,"fs":11,"path":12}],7:[function(require,module,exports){
/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

(function () {

'use strict';

function Interpreter(ast, context) {
    this.ast = ast;
    this.context = context || {};
}

Interpreter.prototype = {
    execute: function () {
        return this.visit(this.ast, this.context);
    },
    visit: function (node, context) {
        var method = 'visit' + node.node + 'Node';

        if (this[method] === undefined) {
            throw new Error('Invalid Node: ' + node.node);
        }

        return this[method].call(this, node, context);
    },
    visitAlgorithmNode: function (node, context) {
        if (node.variables) {
            this.visit(node.variables, context);
        }
        if (node.functions) {
            this.visit(node.functions, context);
        }

        return this.visit(node.body, context);
    },
    visitVariablesBlockNode: function (node, context) {
        var list = node.list || [],
            ids = [];

        for (var i=0; i<list.length; i++) {
            this.visit(list[i], context);
        }
    },
    visitVariableDeclarationNode: function (node, context) {
        context.setVariable(node.id, node.type);
    },
    visitAssignmentExpressionNode: function (node, context) {
        var ident = this.visit(node.left, context),
            right = this.visit(node.right, context);

        if (ident.type != right.type) {
            //throw new Error('Variável do tipo: ' + ident.type + '. Encontrado: ' + right.type);
        }

        ident.value = this.getValue(right);
    },
    visitFunctionDeclarationListNode: function (node, context) {
        var list = node.list || [];

        for (var i=0; i<list.length; i++) {
            this.visit(list[i], context);
        }
    },
    visitFunctionDeclarationNode: function (node, context) {
        if (context.exists(node.id)) {
            throw new Error('Este indentificador já foi definido: ' + node.id);
        }

        context.setFunction(node.id, node);
    },
    visitFunctionCallNode: function (node, context) {
        if (!context.exists(node.id)) {
            throw new Error('Função não definida: ' + node.id);
        }

        var fn = context.getItem(node.id),
            fnContext = {},
            args = [],
            item = null;

        fnContext = context.copy();

        for (var i=0; i<node.args.length; i++) {
            args[i] = this.getValue(this.visit(node.args[i], context));

            //TODO: Type Check

            if (fn.value.params) {
                item = fn.value.params[i];
                fnContext.setVariable(item.id, item.type, args[i]);
            }
        }

        if (fn.value.node && fn.value.node == 'FunctionDeclaration') {

            var fnNode = fn.value;

            if (fnNode.variables) {
                this.visit({node: 'VariablesBlock', list: fnNode.variables}, fnContext);
            }

            return this.visit(fnNode.body, fnContext);
        }

        return fn.value.apply(null, args);
    },
    visitFunctionStatementNode: function (node, context) {
        return this.visit(node.call, context);
    },
    visitReturnStatementNode: function (node, context) {
        return this.getValue(this.visit(node.argument, context));
    },
    visitIfStatementNode: function (node, context) {
        var test = this.visit(node.test, context),
            ret = null;

        test = this.getValue(test);

        if (test) {
            if ((ret = this.visit(node.consequent, context)) !== undefined) {
                return ret;
            }
        } else if (node.alternate) {
            if ((ret = this.visit(node.alternate, context)) !== undefined) {
                return ret;
            }
        }
    },
    visitWhileStatementNode: function (node, context) {
        var ret = null;
        while (this.getValue(this.visit(node.test, context))) {
            if ((ret = this.visit(node.body, context)) !== undefined) {
                return ret;
            }
        }
    }, 
    visitForStatementNode: function (node, context) {
        var index = this.visit(node.variable, context),
            start = this.visit(node.start, context),
            end = this.visit(node.end, context),
            update = 1,
            ret = null;

        if (node.update) {
            update = this.visit(node.update, context);
            update = this.getValue(update);
        }

        start = this.getValue(start);

        for (index.value = start; (start <= end) ? index.value <= end : index.value >= end; index.value += update) {
            if ((ret = this.visit(node.body, context)) !== undefined) {
                return ret;
            }
        }
    },
    visitUnaryExpressionNode: function (node, context) {
        var argument = this.visit(node.argument, context);

        argument = this.getValue(argument);

        switch (node.operator) {
            case '~':
            case 'não':
                return !argument;
            case '+':
                return +argument;
            case '-':
                return -argument;
        }

        throw new Error('Operador unário inválido: ' + node.operator);
    },
    visitBinaryExpressionNode: function (node, context) {
        var left = this.getValue(this.visit(node.left, context));
        var right = this.getValue(this.visit(node.right, context));

        if (node.operator == '=') {
            return left == right;
        } else if (node.operator == '<>') {
            return left != right;
        } else if (node.operator == 'e' || node.operator == '&&') {
            return left && right;
        } else if (node.operator == 'ou' || node.operator == '||') {
            return left || right;
        } else if (node.operator == '^') {
            return left ^ right;
        } else if (node.operator == '&') {
            return left & right;
        } else if (node.operator == '|') {
            return left | right;
        } else if (node.operator == '+') {
            return left + right;
        } else if (node.operator == '-') {
            return left - right;
        } else if (node.operator == '*') {
            return left * right;
        } else if (node.operator == '/') {
            return left / right;
        } else if (node.operator == '>') {
            return left > right;
        } else if (node.operator == '>=') {
            return left >= right;
        } else if (node.operator == '<') {
            return left < right;
        } else if (node.operator == '<=') {
            return left <= right;
        } 

        throw new Error('Operador Inválido: ' + node.operator);
    },
    visitLogicalExpressionNode: function (node, context) {
        return this.visitBinaryExpressionNode(node, context);
    },
    visitLiteralNode: function (node, context) {
        if (node.type == 'lógico') {
            node.value =  this.visitBooleanLiteral(node.value);
        } else if (node.type == 'inteiro') {
            node.value = parseInt(node.value, 10);
        } else if (node.type == 'real') {
            node.value = parseFloat(node.value);
        }

        return node;
    },
    visitIdentifierNode: function (node, context) {
        if (!context.exists(node.id)) {
            throw new Error('Identificador não declarado: ' + node.id);
        }

        return context.getItem(node.id);
    },
    visitBooleanLiteral: function (value) {
        if (value == 'verdadeiro') {
            return true;
        } else if (value == 'falso') {
            return false;
        } else {
            throw new Error('Valor lógico inválido: ' + value);
        }
    },
    visitExpressionNode: function (node, context) {
        return this.visit(node.expression || node, context);
    },
    visitStatementListNode: function (node, context) {
        var name = '',
            list = node.list || [],
            ret = null;

        for (var i=0; i<list.length; i++) {
            if ((ret = this.visit(list[i], context)) !== undefined) {
                return ret;
            }
        }
    },
    getValue: function (node) {
        if (typeof node.value !== 'undefined') {
            return node.value;
        }
        return node;
    }
};

exports.interpreter = Interpreter;

})();

},{}],8:[function(require,module,exports){
/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

(function () {

'use strict';

function Interpreter(ast, context) {
    this.ast = ast;
    this.context = context || {};
}

Interpreter.prototype = {
    execute: function () {
        return this.interpretAlgorithmNode(this.ast, this.context);
    },
    interpretAlgorithmNode: function (node, context) {
        this.interpretVariablesBlockNode(node.variables, context);
        this.interpretFunctionDeclarationListNode(node.functions, context);

        return this.interpretAlgorithmBody(node.body, context);
    },
    interpretVariablesBlockNode: function (node, context) {
        var list = node.list || [],
            ids = [];

        for (var i=0; i<list.length; i++) {
            this.interpretVariableDeclarationNode(list[i]);
        }
    },
    interpretAlgorithmBody: function (node, context) {
        return this.interpretStatementListNode(node, context);
    },
    interpretVariableDeclarationNode: function (node, context) {
        context.setVariable(node.id, node.type);
    },
    interpretAssignmentExpressionNode: function (node, context) {
        var ident = this.interpretIdentifierNode(node.left, context),
            right = this.interpretExpressionNode(node.right, context);

        ident.value = this.getValue(right);
    },
    interpretFunctionDeclarationListNode: function (node, context) {
        var list = node.list || [];

        for (var i=0; i<list.length; i++) {
            this.interpretFunctionDeclarationNode(list[i], context);
        }
    },
    interpretFunctionDeclarationNode: function (node, context) {
        if (context.exists(node.id)) {
            throw new Error('Este indentificador já foi definido: ' + node.id);
        }

        context.setFunction(node.id, node);
    },
    interpretFunctionCallNode: function (node, context) {
        if (!context.exists(node.id)) {
            throw new Error('Função não definida: ' + node.id);
        }

        var fn = context.getItem(node.id),
            fnContext = {},
            args = [],
            item = null;

        fnContext = context.copy();

        for (var i=0; i<node.args.length; i++) {
            args[i] = this.getValue(this.interpretExpressionNode(node.args[i], context));

            //TODO: Type Check

            if (fn.value.params) {
                item = fn.value.params[i];
                fnContext.setVariable(item.id, item.type, args[i]);
            }
        }

        if (fn.value.node && fn.value.node == 'FunctionDeclaration') {

            var fnNode = fn.value;

            if (fnNode.variables) {
                this.interpretVariablesBlockNode({list: fnNode.variables}, fnContext);
            }

            return this.interpretStatementListNode(fnNode.body, fnContext);
        }

        return fn.value.apply(null, args);
    },
    interpretFunctionStatementNode: function (node, context) {
        return this.interpretFunctionCallNode(node.call, context);
    },
    interpretReturnStatementNode: function (node, context) {
        return this.getValue(this.interpretExpressionNode(node.argument, context));
    },
    interpretIfStatementNode: function (node, context) {
        var test = this.interpretExpressionNode(node.test, context),
            ret = null;

        test = this.getValue(test);

        if (test) {
            if ((ret = this.interpretStatementListNode(node.consequent, context)) !== undefined) {
                return ret;
            }
        }

        if (!test && node.alternate) {
            if ((ret = this.interpretStatementListNode(node.alternate, context)) !== undefined) {
                return ret;
            }
        }
    },
    interpretWhileStatementNode: function (node, context) {
        var ret = null;
        while (this.getValue(this.interpretExpressionNode(node.test, context))) {
            if ((ret = this.interpretStatementListNode(node.body, context)) !== undefined) {
                return ret;
            }
        }
    }, 
    interpretForStatementNode: function (node, context) {
        var index = this.interpretExpressionNode(node.variable, context),
            start = this.interpretExpressionNode(node.start, context),
            end = this.interpretExpressionNode(node.end, context),
            update = 1,
            ret = null;

        if (node.update) {
            update = this.interpretExpressionNode(node.update, context);
            update = this.getValue(update);
        }

        start = this.getValue(start);

        for (index.value = start; (start <= end) ? index.value <= end : index.value >= end; index.value += update) {
            if ((ret = this.interpretStatementListNode(node.body, context)) !== undefined) {
                return ret;
            }
        }
    },
    interpretUnaryExpressionNode: function (node, context) {
        var argument = this.interpretExpressionNode(node.argument, context);

        argument = this.getValue(argument);

        if (node.operator == '~' || node.operator == 'não') {
            return !argument;
        } else if (node.operator == '+') {
            return +argument;
        } else if (node.operator == '-') {
            return -argument;
        } else {
            throw new Error('Operador unário inválido: ' + node.operator);
        }
    },
    interpretBinaryExpressionNode: function (node, context) {
        var left = this.getValue(this.interpretExpressionNode(node.left, context));
        var right = this.getValue(this.interpretExpressionNode(node.right, context));

        if (node.operator == '=') {
            return left == right;
        } else if (node.operator == '<>') {
            return left != right;
        } else if (node.operator == 'e' || node.operator == '&&') {
            return left && right;
        } else if (node.operator == 'ou' || node.operator == '||') {
            return left || right;
        } else if (node.operator == '^') {
            return left ^ right;
        } else if (node.operator == '&') {
            return left & right;
        } else if (node.operator == '|') {
            return left | right;
        } else if (node.operator == '+') {
            return left + right;
        } else if (node.operator == '-') {
            return left - right;
        } else if (node.operator == '*') {
            return left * right;
        } else if (node.operator == '/') {
            return left / right;
        } else if (node.operator == '>') {
            return left > right;
        } else if (node.operator == '>=') {
            return left >= right;
        } else if (node.operator == '<') {
            return left < right;
        } else if (node.operator == '<=') {
            return left <= right;
        } else {
            throw new Error('Operador Inválido: ' + node.operator);
        }
    },
    interpretLogicalExpressionNode: function (node, context) {
        return this.interpretBinaryExpressionNode(node, context);
    },
    interpretLiteralNode: function (node, context) {
        if (node.type == 'Boolean') {
            return this.interpretBooleanLiteral(node.value);
        } else if (node.type == 'Integer') {
            return parseInt(node.value, 10);
        } else if (node.type == 'Real') {
            return parseFloat(node.value);
        }
        return node.value;
    },
    interpretIdentifierNode: function (node, context) {
        if (!context.exists(node.id)) {
            throw new Error('Identificador não declarado: ' + node.id);
        }

        return context.getItem(node.id);
    },
    interpretBooleanLiteral: function (value) {
        if (value == 'verdadeiro') {
            return true;
        } else if (value == 'falso') {
            return false;
        } else {
            throw new Error('Valor lógico inválido: ' + value);
        }
    },
    interpretExpressionNode: function (node, context) {
        var name = '',
            exp = node.expression || node;

        name = 'interpret' + exp.node + 'Node';

        //console.log('Expression: ' + name);

        if (this[name] !== undefined) {
            return this[name].call(this, exp, context);
        }

        throw new Error('Expressão desconhecida: ' + node.node);
    },
    interpretStatementListNode: function (node, context) {
        var name = '',
            list = node.list || [],
            ret = null;

        for (var i=0; i<list.length; i++) {
            name = 'interpret' + list[i].node + 'Node';

            //console.log(name);

            if (list[i].node == 'ReturnStatement') {
                return this.interpretReturnStatementNode(list[i], context);
            }

            if (this[name] !== undefined) {
                if ((ret = this[name].call(this, list[i], context)) !== undefined) {
                    return ret;
                }
            }
        }
    },
    getValue: function (node) {
        if (typeof node.value !== 'undefined') {
            return node.value;
        }
        return node;
    }
};

exports.interpreter = Interpreter;

})();

},{}],"/uJC/q":[function(require,module,exports){
/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

(function () {

'use strict';

var Parser = require('./grammar').Parser,
    AST = require('./ast').ast,
    Buffer = require('./buffer').buffer,
    Context = require('./context').context,
    Compiler = require('./compiler/javascript').compiler,
    Interpreter = require('./interpreter').interpreter;

function parse(ptcode) {
    var parser = new Parser();

    parser.yy = AST;

    return parser.parse(ptcode);
}

function compile(ptcode) {
    var ast = parse(ptcode),
        compiler = new Compiler(ast, new Buffer());

    return compiler.compile();
}

function execute(ptcode, context) {
    var ast = parse(ptcode),
        interpreter = new Interpreter(ast, context || new Context());

    return interpreter.execute();
}

function createContext() {
    return new Context();
}

exports.version = '0.0.1';
exports.parse = parse;
exports.compile = compile;
exports.execute = execute;
exports.createContext = createContext;

})();

},{"./ast":2,"./buffer":3,"./compiler/javascript":4,"./context":5,"./grammar":6,"./interpreter":7}],10:[function(require,module,exports){
/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

(function () {

'use strict';

var Context = require('../context').context,
    slice = Array.prototype.slice,
    std = new Context();

std.setFunction('imprima', function () {
    var args = slice.call(arguments, 0);

    if (args.length > 0) {
        console.log(args.join(''));
    }
});

exports.module = std;

})();

},{"../context":5}],11:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}],12:[function(require,module,exports){
var process=require("__browserify_process");function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';

},{"__browserify_process":13}],13:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[2,3,4,5,6,7,"/uJC/q",8,10])
;
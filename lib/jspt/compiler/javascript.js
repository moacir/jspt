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

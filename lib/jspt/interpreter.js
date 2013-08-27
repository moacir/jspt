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
        var method = 'visit' + node.name + 'Node';

        if (this[method] === undefined) {
            throw new Error('Invalid Node: ' + node.name);
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

        if (fn.value.name && fn.value.name == 'FunctionDeclaration') {

            var fnNode = fn.value;

            if (fnNode.variables) {
                this.visit({name: 'VariablesBlock', list: fnNode.variables}, fnContext);
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
        var test = this.getValue(this.visit(node.test, context));

        if (test) {
            return this.visit(node.consequent, context);
        }
        if (node.alternate) {
            return this.visit(node.alternate, context);
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
            update = this.getValue(this.visit(node.update, context));
        }

        start = this.getValue(start);
        end = this.getValue(end);

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
        var list = node.list || [],
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

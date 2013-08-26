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
            context.setVariable(list[i].id, list[i].type);
        }
    },
    interpretAlgorithmBody: function (node, context) {
        return this.interpretStatementListNode(node, context);
    },
    interpretVariableDeclarationNode: function (node, context) {
        //do nothing
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

        //context[node.id] = new Identifier(node.id, 'Function', node);
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

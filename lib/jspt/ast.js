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
    AlgorithmNode: function (title, varList, funcList, body) {
        this.name = 'Algorithm';
        this.title = title;
        this.variables = varList || null;
        this.functions = funcList || null;
        this.body = body;
    },
    VariablesBlockNode: function (variablesList) {
        this.name = 'VariablesBlock';
        this.list = variablesList;
    },
    VariableDeclarationNode: function (id, type) {
        this.name = 'VariableDeclaration';
        this.id = id;
        this.type = type;
    },
    ExpressionNode: function (expression) {
        this.name = 'Expression';
        this.expression = expression;
    },
    AssignmentExpressionNode: function (operator, left, right) {
        this.name = 'AssignmentExpression';
        this.operator = operator;
        this.left = left;
        this.right = right; 
    },
    UnaryExpressionNode: function (operator, argument) {
        this.name = 'UnaryExpression';
        this.operator = operator;
        this.argument = argument;
    },
    BinaryExpressionNode: function (operator, left, right) {
        this.name = 'BinaryExpression';
        this.operator = operator;
        this.left = left;
        this.right = right; 
    },
    LogicalExpressionNode: function (operator, left, right) {
        this.name = 'LogicalExpression';
        this.operator = operator;
        this.left = left;
        this.right = right; 
    },
    FunctionCallNode: function (id, args) {
        this.name = 'FunctionCall';
        this.id = id;
        this.args = args;
    },
    FunctionStatementNode: function (call) {
        this.name = 'FunctionStatement';
        this.call = call;
    }, 
    FunctionDeclarationNode: function (id, type, params, variables, body) {
        this.name = 'FunctionDeclaration';
        this.id = id;
        this.type = type;
        this.params = params || [];
        this.variables = variables || [];
        this.body = body;
    }, 
    FunctionParameterNode: function (id, type) {
        this.name = 'FunctionParameter';
        this.id = id;
        this.type = type;
    }, 
    FunctionDeclarationListNode: function (list) {
        this.name = 'FunctionDeclarationList';
        this.list = list || [];
    },
    ReturnStatementNode: function (argument) {
        this.name = 'ReturnStatement';
        this.argument = argument;
    }, 
    StatementListNode: function (list) {
        this.name = 'StatementList';
        this.list = list || [];
    },
    IfStatementNode: function (test, consequent, alternate) {
        this.name = 'IfStatement';
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate || null;
    },
    WhileStatementNode: function (test, body) {
        this.name = 'WhileStatement';
        this.test = test;
        this.body = body;
    }, 
    ForStatementNode: function (variable, start, end, update, body) {
        this.name = 'ForStatement';
        this.variable = variable;
        this.start = start;
        this.end = end;
        this.update = update;
        this.body = body;
    },
    LiteralNode: function (type, value, raw) {
        this.name = 'Literal';
        this.type = type;
        this.value = value;
        this.raw = raw;
    },
    IdentifierNode: function (id) {
        this.name = 'Identifier';
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

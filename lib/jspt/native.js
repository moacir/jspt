/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

'use strict';

var AST = require('./ast').ast;

function NativeFunction(id, type, params, body) {
    this.name = 'NativeFunction';
    this.id = id;
    this.type = type || 'vazio';
    this.params = params || [];
    this.body = body || function () {};
}

NativeFunction.prototype.addParameter = function (id, type) {
    this.params.push(new AST.FunctionParameterNode(id, type));
};

NativeFunction.prototype.setBody = function (fn) {
    this.body = fn;
};

NativeFunction.prototype.execute = function (args) {
    var values = [];

    for (var i=0; i<args.length; i++) {
        values[i] = args[i].value;
    }

    var ret = this.body.apply(null, values);

    return new AST.LiteralNode(this.type, ret, ret);
};

exports.nativeFunction = NativeFunction;

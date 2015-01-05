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

function ast(ptcode) {
   return parse(ptcode);
}

function createContext() {
    return new Context();
}

exports.version = '0.0.1';
exports.parse = parse;
exports.compile = compile;
exports.execute = execute;
exports.ast = ast;
exports.createContext = createContext;

})();

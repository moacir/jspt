/**
 * Javascript Portugol
 * https://github.com/moacir/jspt
 *
 * Copyright (c) 2013 Moacir de Oliveira
 * Licensed under the MIT license.
 */

'use strict';

var Context = require('../context').context,
    NativeFunction = require('../native').nativeFunction,
    slice = Array.prototype.slice,
    std = new Context();

var Imprima = new NativeFunction('imprima', 'vazio');

Imprima.addParameter('text', 'literal');

Imprima.setBody(function (text) {
    console.log(text);
});

std.setFunction('imprima', Imprima);

exports.module = std;

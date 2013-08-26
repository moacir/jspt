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

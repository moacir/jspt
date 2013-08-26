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

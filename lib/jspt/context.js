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

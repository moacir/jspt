'use strict';

var JSPT = require('jspt');

describe('Testing Type Checking with Functions', function () {
    it('Should not to throw a TypeError when assigning function return to variable with same type', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umInteiro: inteiro;',
            'fim-variáveis',
            'início',
                'umInteiro := soma(1, 1);',
                'umInteiro := um();',
            'fim',
            'função soma(a: inteiro, b: inteiro) : inteiro',
            'início',
                'retorne a+b;',
            'fim',
            'função um() : inteiro',
            'início',
                'retorne 1;',
            'fim',
        ].join('\n');

        var error = function () {
            var context = JSPT.createContext();
            JSPT.execute(code, context);
        };

        expect(error).not.toThrowError(/Erro de Tipagem/);
    });

    it('Should throw a TypeError when assigning function return to variable with different type', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umInteiro: inteiro;',
            'fim-variáveis',
            'início',
                'umInteiro := fnReal();',
            'fim',
            'função fnReal() : real',
            'início',
                'retorne 1.0;',
            'fim',
        ].join('\n');

        var error = function () {
            var context = JSPT.createContext();
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/Erro de Tipagem/);
    });

    it('Should throw a TypeError when a Function returns a value different from declared', function () {
        var code = [
            'algoritmo teste;',
            'início',
                'fnWrongReturn();',
            'fim',
            'função fnWrongReturn() : inteiro',
            'início',
                'retorne 1.0;',
            'fim',
        ].join('\n');

        var error = function () {
            var context = JSPT.createContext();
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/Erro de Tipagem/);
    });

    it('Should throw a TypeError when a void Function returns a value', function () {
        var code = [
            'algoritmo teste;',
            'início',
                'fnWrongReturn();',
            'fim',
            'função fnWrongReturn()',
            'início',
                'retorne 1;',
            'fim',
        ].join('\n');

        var error = function () {
            var context = JSPT.createContext();
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/Erro de Tipagem/);
    });

    it('Should throw a TypeError when trying to get return from void function', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umInteiro: inteiro;',
            'fim-variáveis',
            'início',
                'umInteiro := fnVoid();',
            'fim',
            'função fnVoid()',
            'início',
            'fim',
        ].join('\n');

        var error = function () {
            var context = JSPT.createContext();
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/Erro de Tipagem/);
    });

    it('Should throw a TypeError when typed function does not have a return statement', function () {
        var code = [
            'algoritmo teste;',
            'início',
                'fnInteiro();',
            'fim',
            'função fnInteiro() : inteiro',
            'início',
            'fim'
        ].join('\n');

        var error = function () {
            var context = JSPT.createContext();
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/Erro de Tipagem/);
    });
});

describe('Testing Function parameters number', function () {
    it('Should not throw an Error when calling functions with correct number of parameters', function () {
        var code = [
            'algoritmo teste;',
            'início',
                'nenhum();',
                'um(1);',
                'dois(1, 1);',
                'tres(1, 1, 1);',
            'fim',
            'função nenhum()',
            'início',
            'fim',
            'função um(a: inteiro)',
            'início',
            'fim',
            'função dois(a: inteiro, b: inteiro)',
            'início',
            'fim',
            'função tres(a: inteiro, b: inteiro, c: inteiro)',
            'início',
            'fim'
        ].join('\n');

        var error = function () {
            var context = JSPT.createContext();
            JSPT.execute(code, context);
        };

        expect(error).not.toThrowError(/Erro de Tipagem/);
    });

    it('Should throw an Error when calling functions with wrong number of parameters', function () {
        var code = [
            'algoritmo teste;',
            'início',
                'um();',
            'fim',
            'função um(a: inteiro)',
            'início',
            'fim'
        ].join('\n');

        var error = function () {
            var context = JSPT.createContext();
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/parâmetros/i);
    });

    it('Should throw an Error when function has too many parameters', function () {
        var code = [
            'algoritmo teste;',
            'início',
                'um(1);',
            'fim',
            'função um()',
            'início',
            'fim'
        ].join('\n');

        var error = function () {
            var context = JSPT.createContext();
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/parâmetros/i);
    });

});

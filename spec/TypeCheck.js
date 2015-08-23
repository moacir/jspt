'use strict';

var JSPT = require('jspt');

describe('Testing Type Checking Errors with Variables', function () {
    it('Should throw a TypeError when assigning wrong literals types to variables', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umInteiro: inteiro;',
            'fim-variáveis',
            'início',
                'umInteiro := 0.0;',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        var error = function () {
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/Erro de Tipagem/);
    });

    it('Should throw a TypeError when assigning wrong identifier types to variables', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umInteiro: inteiro;',
                'umReal: real;',
            'fim-variáveis',
            'início',
                'umInteiro := umReal;',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        var error = function () {
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/Erro de Tipagem/);
    });

    it('Should throw a TypeError when assign variable arithmetic expression with different types ', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umInteiro: inteiro;',
                'umReal: real;',
            'fim-variáveis',
            'início',
                'umInteiro := umInteiro + umReal;',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        var error = function () {
            JSPT.execute(code, context);
        };

        expect(error).toThrowError(/Erro de Tipagem/);
    });
});

describe('Testing Valid Type Checking with literal values', function () {
    it('Should not to throw a TypeError when assigning different types of integer literals', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umInteiro: inteiro;',
            'fim-variáveis',
            'início',
                'umInteiro := 0;',
                'umInteiro := 1;',
                'umInteiro := 0xFF;',
                'umInteiro := 0XFF;',
                'umInteiro := 0c77;',
                'umInteiro := 0C77;',
                'umInteiro := 0b11;',
                'umInteiro := 0B11;',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        var error = function () {
            JSPT.execute(code, context);
        };

        expect(error).not.toThrowError();
    });

    it('Should not to throw a TypeError when assigning different types of boolean literals', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umLogico: lógico;',
            'fim-variáveis',
            'início',
                'umLogico := verdadeiro;',
                'umLogico := falso;',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        var error = function () {
            JSPT.execute(code, context);
        };

        expect(error).not.toThrowError();
    });

    it('Should not to throw a TypeError when assigning different types of text literals', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umLiteral: literal;',
                'umCaractere: caractere;',
            'fim-variáveis',
            'início',
                'umLiteral := "Testing Type Checking";',
                'umCaractere := \'A\';',
                'umCaractere := \'\0\';',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        var error = function () {
            JSPT.execute(code, context);
        };

        expect(error).not.toThrowError();
    });

    it('Should not to throw a TypeError when assigning different types of real literals', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umReal: real;',
            'fim-variáveis',
            'início',
                'umReal := 1.1;',
                'umReal := 100.100;',
                'umReal := 0.0;',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        var error = function () {
            JSPT.execute(code, context);
        };

        expect(error).not.toThrowError();
    });
});

describe('Testing Valid Type Checking with expressions', function () {
    it('Should not to throw a TypeError when assigning different integer expressions', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umInteiro: inteiro;',
            'fim-variáveis',
            'início',
                'umInteiro := 1+1;',
                'umInteiro := 1-1;',
                'umInteiro := 1*1;',
                'umInteiro := 1/1;',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        var error = function () {
            JSPT.execute(code, context);
        };

        expect(error).not.toThrowError();
    });

    it('Should not to throw a TypeError when assigning different integer expressions with variables', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umInteiro: inteiro;',
            'fim-variáveis',
            'início',
                'umInteiro := umInteiro + umInteiro;',
                'umInteiro := umInteiro - umInteiro;',
                'umInteiro := umInteiro * umInteiro;',
                'umInteiro := umInteiro / umInteiro;',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        var error = function () {
            JSPT.execute(code, context);
        };

        expect(error).not.toThrowError();
    });
});

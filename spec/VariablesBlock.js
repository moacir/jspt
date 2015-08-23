'use strict';

var JSPT = require('jspt');

describe('Interpreting a VariableListBlock', function () {
    beforeEach(function () {
    });

    it('Does not have a VariableListBlock', function () {
        var code = [
            'algoritmo teste;',
            'início',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();
        var emptyContext = JSPT.createContext();

        JSPT.execute(code, context);

        expect(context).toEqual(emptyContext);
    });

    it('Has an empty VariableListBlock', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
            'fim-variáveis',
            'início',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();
        var emptyContext = JSPT.createContext();

        JSPT.execute(code, context);

        expect(context).toEqual(emptyContext);
    });

    it('Has one integer variable declared', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umNumero: inteiro;',
            'fim-variáveis',
            'início',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        JSPT.execute(code, context);
        
        expect(context.exists('umNumero')).toBe(true);

        var item = context.getItem('umNumero');

        expect(item).not.toBe(null);
        expect(item.id).toEqual('umNumero');
        expect(item.type).toEqual('inteiro');
    });

    it('Has many integers declared in one line', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'int0, int1, int2, int3: inteiro;',
            'fim-variáveis',
            'início',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        JSPT.execute(code, context);
        
        for (var i=0; i<4; i++) {
            var id = 'int' + i;

            expect(context.exists(id)).toBe(true);

            var item = context.getItem(id);

            expect(item).not.toBe(null);
            expect(item.id).toEqual(id);
            expect(item.type).toEqual('inteiro');
            expect(item.value).toBe(0);
        }
   });

   it('Has many variables declared in one line', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'inteiro0, inteiro1, inteiro2, inteiro3: inteiro;',
                'real0, real1, real2, real3: real;',
                'literal0, literal1, literal2, literal3: literal;',
            'fim-variáveis',
            'início',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        JSPT.execute(code, context);

        var types = ['inteiro', 'real', 'literal'];
       
        for (var t=0; t<types.length; t++) { 
            for (var i=0; i<4; i++) {
                var id = types[t] + i;

                expect(context.exists(id)).toBe(true);

                var item = context.getItem(id);

                expect(item).not.toBe(null);
                expect(item.id).toEqual(id);
                expect(item.type).toEqual(types[t]);
            }
        }
   });

   it('Should have correct default values for variables', function () {
        var code = [
            'algoritmo teste;',
            'variáveis',
                'umNumero: inteiro;',
                'umReal: real;',
                'umLiteral: literal;',
                'umCaractere: caractere;',
                'umLogico: lógico;',
            'fim-variáveis',
            'início',
            'fim'
        ].join('\n');

        var context = JSPT.createContext();

        JSPT.execute(code, context);

        expect(context.exists('umNumero')).toBe(true);
        expect(context.exists('umReal')).toBe(true);
        expect(context.exists('umLiteral')).toBe(true);
        expect(context.exists('umCaractere')).toBe(true);
        expect(context.exists('umLogico')).toBe(true);

        expect(context.getItem('umNumero').value).toBe(0);
        expect(context.getItem('umReal').value).toBe(0.0);
        expect(context.getItem('umLiteral').value).toBe('');
        expect(context.getItem('umCaractere').value).toBe('');
        expect(context.getItem('umLogico').value).toBe('false');
    });
});

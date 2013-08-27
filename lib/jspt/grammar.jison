/**
 * Copyright (c) 2013 Moacir de Oliveira
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* description: G-Portugol Definition */

%lex

T_DEC_LIT [0-9]+
T_OCTAL_LIT [0][cC][0-8]+
T_HEX_LIT [0][xX][0-9a-fA-F]+
T_BIN_LIT [0][bB][01]+
T_REAL_LIT {T_DEC_LIT}+[\.]{T_DEC_LIT}+
T_INT_LIT {T_OCTAL_LIT}|{T_HEX_LIT}|{T_BIN_LIT}|{T_DEC_LIT}

ESC "\\".

%s comment

%%

"//".*                  { /* ignore comment */ }
"/*"                    { this.begin('comment'); }
<comment>"*/"           { this.popState(); }
<comment>.              { /* ignore comment */ }

\s+                     { /* ignore space */ }

<<EOF>>                 { return 'EOF'; }

{T_INT_LIT}             { return "T_INT_LIT" }
{T_REAL_LIT}            { return "T_REAL_LIT" }

"\"\""                  { return "T_STRING_LIT"; }
"\""([^"]|{ESC})*"\""   { return "T_STRING_LIT"; }
"'"(.|{ESC})"'"         { return "T_CARAC_LIT"; }

"verdadeiro"            { return "T_BOOL_LIT"; }
"falso"                 { return "T_BOOL_LIT"; }

"algoritmo"             { return "ALGORITMO"; }
"variáveis"             { return "VARIAVEIS"; }
"fim-variáveis"         { return "FIM_VARIAVEIS"; }
"fim-enquanto"          { return "FIM_ENQUANTO"; }
"fim-para"              { return "FIM_PARA"; }
"fim-se"                { return "FIM_SE"; }
"fim"                   { return "FIM"; }
"inteiro"               { return "INTEIRO"; }
"real"                  { return "REAL"; }
"caractere"             { return "CARACTERE"; }
"literal"               { return "LITERAL"; }
"lógico"                { return "LOGICO"; }
"início"                { return "INICIO"; }
"se"                    { return "SE"; }
"senão"                 { return "SENAO"; }
"enquanto"              { return "ENQUANTO"; }
"então"                 { return "ENTAO"; }
"faça"                  { return "FACA"; }
"para"                  { return "PARA"; }
"de"                    { return "DE"; }
"até"                   { return "ATE"; }
"e"                     { return "E"; }
"ou"                    { return "OU"; }
"não"                   { return "NAO"; }
"matriz"                { return "MATRIZ"; }
"inteiros"              { return "INTEIROS"; }
"reais"                 { return "REAIS"; }
"caracteres"            { return "CARACTERES"; }
"literais"              { return "LITERAIS"; }
"lógicos"               { return "LOGICOS"; }
"função"                { return "FUNCAO"; }
"retorne"               { return "RETORNE"; }
"passo"                 { return "PASSO"; }

[a-zA-Z_][0-9a-zA-Z_]*  { return "T_IDENTIFICADOR"; }

":="                    { return ":="; }

";"                     { return ";"; }
":"                     { return ":"; }
","                     { return ","; }
"["                     { return "["; }
"]"                     { return "]"; }
"("                     { return "("; }
")"                     { return ")"; }

"+"                     { return "+"; }
"-"                     { return "-"; }
"*"                     { return "*"; }
"/"                     { return "/"; }
"%"                     { return "%"; }

"||"                    { return "||"; }
"&&"                    { return "&&"; }
"|"                     { return "|"; }
"&"                     { return "&"; }
"^"                     { return "^"; }
"~"                     { return "~"; }

"<>"                    { return "<>"; }
">="                    { return ">="; }
"<="                    { return "<="; }
"<"                     { return "<"; }
">"                     { return ">"; }
"="                     { return "="; }

/lex

%start algorithm

%%

algorithm
  : stm_algorithm stm_block EOF
    {{ return new yy.AlgorithmNode($1, null, null, $2); }}
  | stm_algorithm var_decl_block stm_block func_decl_list EOF
    {{ return new yy.AlgorithmNode($1, $2, $4, $3); }}
  | stm_algorithm stm_block func_decl_list EOF
    {{ return new yy.AlgorithmNode($1, null, $3, $2); }}
  | stm_algorithm var_decl_block stm_block EOF
    {{ return new yy.AlgorithmNode($1, $2, null, $3); }}
  ;

stm_algorithm
  : ALGORITMO T_IDENTIFICADOR ";"
    {{ $$ = $2; }}
  ;

var_decl_block
  : VARIAVEIS FIM_VARIAVEIS
    {{ $$ = new yy.VariablesBlockNode([]); }}
  | VARIAVEIS var_decl_list FIM_VARIAVEIS
    {{ $$ = new yy.VariablesBlockNode($2); }}
  ;

var_decl_list
  : var_decl
    {{ $$ = $1; }}
  | var_decl_list var_decl
    {{ $$ = $1.concat($2); }}
  ;

var_decl_id
  : T_IDENTIFICADOR
    {{ $$ = [$1]; }}
  | var_decl_id "," T_IDENTIFICADOR
    {{ $1.push($3); $$ = $1; }}
  ;

var_decl_type
  : tp_primitivo
  | tp_matriz
  ;

var_decl
  : var_decl_id ":" var_decl_type ";"
    {{ $$ = yy.Util.createVariableDeclarationList($1, $3); }}
  ;

tp_primitivo
  : INTEIRO
  | REAL
  | CARACTERE
  | LITERAL
  | LOGICO
  ;

tp_prim_pl
  : INTEIROS
  | REAIS
  | CARACTERES
  | LITERAIS
  | LOGICOS
  ;

tp_matriz_index_literal
  : "[" T_INT_LIT "]"
  ;

tp_matriz_index
  : tp_matriz_index_literal
  | tp_matriz_index tp_matriz_index_literal
  ;

tp_matriz
  : MATRIZ tp_matriz_index DE tp_prim_pl
  ;

stm_block
  : INICIO stm_list FIM
    {{ $$ = $2; }}
  | INICIO FIM
    {{ $$ = []; }}
  ;

stm_list
  : stm
    {{ $$ = new yy.StatementListNode([$1]); }}
  | stm_list stm
    {{ $1.list.push($2); $$ = $1; }}
  ;

stm
  : stm_attr
  | stm_fcall
  | stm_ret
  | stm_se
  | stm_enquanto
  | stm_para
  ;

stm_fcall
  : fcall ";"
    {{ $$ = new yy.FunctionStatementNode($1); }}
  ;

stm_ret
  : RETORNE expr ";"
    {{ $$ = new yy.ReturnStatementNode($2); }}
  ;

lvalue
  : T_IDENTIFICADOR
    {{ $$ = new yy.IdentifierNode($1); }}
  | T_IDENTIFICADOR lvalue_array
  ;

lvalue_array
  : "[" expr "]"
  | lvalue_array "[" expr "]"
  ;

stm_attr
  : lvalue ":=" expr ";"
    {{ $$ = new yy.AssignmentExpressionNode($2, $1, $3); }}
  ;

stm_se
  : SE expr ENTAO FIM_SE
    {{ $$ = new yy.IfStatementNode($2, []); }}
  | SE expr ENTAO stm_list FIM_SE
    {{ $$ = new yy.IfStatementNode($2, $4); }}
  | SE expr ENTAO stm_list SENAO stm_list FIM_SE
    {{ $$ = new yy.IfStatementNode($2, $4, $6); }}
  | SE expr ENTAO SENAO stm_list FIM_SE
    {{ $$ = new yy.IfStatementNode($2, [], $5); }}
  | SE expr ENTAO stm_list SENAO FIM_SE
    {{ $$ = new yy.IfStatementNode($2, $4, []); }}
  | SE expr ENTAO SENAO FIM_SE
    {{ $$ = new yy.IfStatementNode($2, [], []); }}
  ;

stm_enquanto
  : ENQUANTO expr FACA stm_list FIM_ENQUANTO
    {{ $$ = new yy.WhileStatementNode($2, $4); }}
  | ENQUANTO expr FACA FIM_ENQUANTO
    {{ $$ = new yy.WhileStatementNode($2, []); }}
  ;

stm_para 
  : PARA lvalue DE expr ATE expr stm_para_block
    {{ $$ = new yy.ForStatementNode($2, $4, $6, null, $7); }}
  | PARA lvalue DE expr ATE expr passo stm_para_block
    {{ $$ = new yy.ForStatementNode($2, $4, $6, $7, $8); }}
  ;

stm_para_block
  : FACA FIM_PARA
    {{ $$ = []; }}
  | FACA stm_list FIM_PARA
    {{ $$ = $2; }}
  ;

passo
  : PASSO T_INT_LIT
    {{ $$ = new yy.LiteralNode('Integer', yy.Util.createNumberFromRawString($2), $2); }}
  | PASSO unary_pos_neg T_INT_LIT
    {{ $$ = new yy.LiteralNode('Integer', yy.Util.createNumberFromRawString($2 + $3), $2 + $3); }}
  ;

termo
  : fcall  
  | lvalue
  | literal
  | "(" expr ")" 
    {{ $$ = $2; }}
  ;

unary_pos_neg
  : "+"
  | "-"
  ;

unary_op
 : unary_pos_neg
 | "~"
 | NAO
 ;

expr_unary
  : termo
  | unary_op termo
    {{ $$ = new yy.UnaryExpressionNode($1, $2); }}
  ;

expr_multiply
  : expr_unary
  | expr_multiply "*" expr_unary
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  | expr_multiply "/" expr_unary
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  | expr_multiply "%" expr_unary
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  ;

expr_additive
  : expr_multiply
  | expr_additive "+" expr_multiply
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  | expr_additive "-" expr_multiply
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  ;

expr_relational
  : expr_additive
  | expr_relational ">" expr_additive
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  | expr_relational ">=" expr_additive
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  | expr_relational "<" expr_additive
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  | expr_relational "<=" expr_additive
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  ;

expr_equal
  : expr_relational
  | expr_equal "=" expr_relational
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  | expr_equal "<>" expr_relational
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  ;

expr_and
  : expr_equal
  | expr_and "&" expr_equal
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  ;

expr_or_exclusive
  : expr_and
  | expr_or_exclusive "^" expr_and
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  ;

expr_or
  : expr_or_exclusive
  | expr_or "|" expr_or_exclusive
    {{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }}
  ;

expr_logical_and
  : expr_or
  | expr_logical_and "&&" expr_or
    {{ $$ = new yy.LogicalExpressionNode($2, $1, $3); }}
  | expr_logical_and E expr_or
    {{ $$ = new yy.LogicalExpressionNode($2, $1, $3); }}
  ;

expr_logical_or
  : expr_logical_and
  | expr_logical_or "||" expr_logical_and
    {{ $$ = new yy.LogicalExpressionNode($2, $1, $3); }}
  | expr_logical_or OU expr_logical_and
    {{ $$ = new yy.LogicalExpressionNode($2, $1, $3); }}
  ;

expr
  : expr_logical_or
    {{ $$ = new yy.ExpressionNode($1); }}
  ;

fcall
  : T_IDENTIFICADOR fcall_args
    {{ $$ = new yy.FunctionCallNode($1, $2); }}
  ;

fcall_args
  : "(" ")"
    {{ $$ = []; }}
  | "(" fcall_arg_list ")"
    {{ $$ = $2; }}
  ;

fcall_arg_list
  : expr
    {{ $$ = [$1]; }}
  | fcall_arg_list "," expr
    {{ $1.push($3); $$ = $1; }}
  ;

literal
  : T_STRING_LIT
    {{ $$ = new yy.LiteralNode('literal', $1, $1); }}
  | T_INT_LIT
    {{ $$ = new yy.LiteralNode('inteiro', yy.Util.createNumberFromRawString($1), $1); }}
  | T_REAL_LIT
    {{ $$ = new yy.LiteralNode('real', new Number($1), $1); }}
  | T_CARAC_LIT
    {{ $$ = new yy.LiteralNode('caractere', $1, $1); }}
  | T_BOOL_LIT 
    {{ $$ = new yy.LiteralNode('lógico', $1, $1); }}
  ;

func_decl_list
  : func_decl
    {{ $$ = new yy.FunctionDeclarationListNode([$1]); }}
  | func_decl_list func_decl
    {{ $1.list.push($2); $$ = $1; }}
  ;

func_decl
  : FUNCAO T_IDENTIFICADOR func_params stm_block
    {{ $$ = new yy.FunctionDeclarationNode($2, null, $3, [], $4); }}
  | FUNCAO T_IDENTIFICADOR func_params var_decl_list stm_block
    {{ $$ = new yy.FunctionDeclarationNode($2, null, $3, $4, $5); }}
  | FUNCAO T_IDENTIFICADOR func_params func_type stm_block
    {{ $$ = new yy.FunctionDeclarationNode($2, $4, $3, [], $5); }}
  | FUNCAO T_IDENTIFICADOR func_params func_type var_decl_list stm_block
    {{ $$ = new yy.FunctionDeclarationNode($2, $4, $3, $5, $6); }}
  ;

func_type
  : ":" tp_primitivo
    {{ $$ = $2; }}
  ;

func_params
  : "(" ")"
    {{ $$ = []; }}
  | "(" func_param_list ")"
    {{ $$ = $2; }}
  ;

func_param_list
  : func_param_decl
    {{ $$ = [$1]; }}
  | func_param_list ',' func_param_decl
    {{ $1.push($3); $$ = $1; }}
  ;

func_param_decl
  : T_IDENTIFICADOR ":" var_decl_type
    {{ $$ = new yy.FunctionParameterNode($1, $3); }}
  ;

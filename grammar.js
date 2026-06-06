module.exports = grammar({
  name: 'skript',

  extras: $ => [/[ \t\r\n]/],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.block_comment,
      $.comment,
      $.string,
      $.option,
      $.variable,
      $.using_directive,
      $.options_keyword,
      $.function_def,
      $.function_call,
      $.grouped_expr,
      $.float,
      $.integer,
      $.boolean,
      $.loop_value,
      $.event_value,
      $.conditional,
      $.repeat,
      $.event_start,
      $.keyword,
      $.operator,
      $.section_colon,
      $.punctuation,
      $.identifier,
      $._unknown,
    ),

    _unknown: $ => token(prec(-100, /[^\s]/)),

    // --- comments
    block_comment: $ => token(prec(3, seq('###', /([^#]|#[^#]|##[^#])*/, '###'))),
    comment: $ => token(prec(1, /#.*/)),

    // --- strings & interpolation
    string: $ => seq(
      '"',
      repeat(choice(
        $._string_escape,
        $.interpolation,
        $._string_chunk,
      )),
      '"',
    ),
    _string_escape: $ => token.immediate('""'),
    _string_chunk: $ => token.immediate(prec(-1, /[^"%]+/)),

    interpolation: $ => seq(
      alias('%', $.interpolation_delim),
      repeat(choice(
        $._interp_escape,
        $._interp_inner,
      )),
      alias('%', $.interpolation_delim),
    ),
    _interp_escape: $ => token.immediate('%%'),
    _interp_inner: $ => token.immediate(/[^%"]+/),

    // --- options & variables
    option: $ => seq(
      alias('{@', $.option_open),
      optional(alias(token.immediate(/[^}]*/), $.option_body)),
      alias('}', $.option_close),
    ),

    variable: $ => seq(
      alias('{', $.variable_open),
      optional($.variable_reserved_char),
      repeat(choice(
        $.list_sep_var,
        $._var_interpolation,
        $._var_chunk,
      )),
      alias('}', $.variable_close),
    ),
    variable_reserved_char: $ => token.immediate(/[_-]/),
    _var_chunk: $ => token.immediate(prec(-1, /[^}%:]+/)),
    list_sep_var: $ => alias(token.immediate('::'), $.list_sep),
    _var_interpolation: $ => seq(
      alias(token.immediate('%'), $.interpolation_delim),
      repeat(choice(
        token.immediate('%%'),
        token.immediate(/[^%}]+/),
      )),
      alias('%', $.interpolation_delim),
    ),

    // --- literals
    float: $ => token(prec(3, /\d+\.\d+/)),
    integer: $ => token(prec(2, /\d+(_\d+)*/)),
    boolean: $ => choice('true', 'false', 'on', 'off', 'yes', 'no'),

    // --- loop / event values
    loop_value: $ => token(prec(4, /loop-[A-Za-z_][A-Za-z0-9_-]*/)),
    event_value: $ => token(prec(4, /event-[^\s)}]+/)),

    // --- keywords
    keyword: $ => choice('return', 'continue', 'stop'),
    conditional: $ => choice('if', 'else', 'then'),
    repeat: $ => choice('for', 'loop', 'while', 'do'),
    event_start: $ => prec(1, choice('on', 'every')),

    // --- operators
    operator: $ => choice(
      '+', '-', '*', '/', '^', '<', '>', '=', '!=',
      "isn't", "aren't", "wasn't", "weren't",
      "doesn't",
      seq('does', 'not'),
      'not', 'is', 'are', 'was', 'were',
      'contains', 'contain',
    ),

    // --- using / options sections
    using_directive: $ => prec(2, seq(
      alias('using', $.using_keyword),
      alias(token.immediate(/[ \t]+[^\n]*/), $.using_feature),
    )),

    options_keyword: $ => prec(1, 'options'),

    // --- function definitions
    function_def: $ => prec.dynamic(2, seq(
      optional(alias('local', $.storage)),
      alias('function', $.func_keyword),
      alias($.identifier, $.function_name),
      $.param_list,
      optional(seq(
        $.func_return,
        alias($._type_text, $.type),
      )),
    )),

    param_list: $ => seq(
      '(',
      optional(seq(
        $._param,
        repeat(seq(',', $._param)),
      )),
      ')',
    ),

    _param: $ => seq(
      alias($.identifier, $.param_name),
      ':',
      alias($._type_text, $.type),
      optional(seq('=', $._default_value)),
    ),

    _type_text: $ => /[A-Za-z][A-Za-z ]*/,

    _default_value: $ => repeat1(choice(
      $.string,
      $.variable,
      $.float,
      $.integer,
      $.boolean,
      $.function_call,
      $.identifier,
    )),

    func_return: $ => choice('->', '::', 'returns'),

    // --- function calls
    function_call: $ => seq(
      alias($.identifier, $.function_call_name),
      $._call_args,
    ),
    _call_args: $ => seq(
      alias(token.immediate('('), $.call_open),
      repeat($._item),
      alias(')', $.call_close),
    ),

    grouped_expr: $ => seq('(', repeat($._item), ')'),

    // --- section colon
    section_colon: $ => token(prec(5, /:[ \t]*\n/)),

    // --- punctuation & identifiers
    punctuation: $ => ',',
    identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,
  }
});

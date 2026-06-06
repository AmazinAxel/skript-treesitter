; --- comments
(comment) @comment
(block_comment) @comment

((comment) @comment.todo
 (#match? @comment.todo "(TODO|FIXME|XXX|NOTE)"))
((block_comment) @comment.todo
 (#match? @comment.todo "(TODO|FIXME|XXX|NOTE)"))

; --- strings & interpolation
(string) @string
(interpolation_delim) @special

; --- variables
(variable_open) @variable
(variable_close) @variable
(variable_reserved_char) @constant.character.escape
(list_sep) @operator

(option_open) @keyword.directive
(option_close) @keyword.directive
(option) @keyword.directive

; --- using / options sections
(using_keyword) @keyword
(using_feature) @string.special
(options_keyword) @keyword

; --- literals
(integer) @constant.numeric.integer
(float) @constant.numeric.float
(boolean) @constant.builtin.boolean

; --- loop / event values
(loop_value) @special
(event_value) @special

; --- keywords
(keyword) @keyword
(conditional) @keyword.control.conditional
(repeat) @keyword.control.repeat
(event_start) @keyword
(operator) @operator

; --- functions
(storage) @keyword.storage
(func_keyword) @keyword
(function_name) @function
(function_call) @function
(param_name) @variable.parameter
(type) @type
(func_return) @operator

; --- punctuation
(section_colon) @punctuation.delimiter
(punctuation) @punctuation.delimiter

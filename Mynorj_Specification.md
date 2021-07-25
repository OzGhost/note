
# This document is a specification for my mini language (named Mynorj), the implementation may come up later :)

## Types
> Some type was listed below was borrowed from [JSON Data Types](https://www.w3schools.com/js/js_json_datatypes.asp)
- *number*: all the number work as real number -> end up with precision issues when do math (ex: 35)
- *string*: a series of character come together between a couple of double quote (ex: "the string")
- *boolean*: only two value available: true and false
- *null*: only one value available: null

## Definition
- ground: the external input source which was provided by system, organized as a tree structure
- var (or variable): a series of character used to hold value during execution
- func (or function call): start with a function name and the rest of the statement
- ap (or access path): a series of character which denote the location of value inside the ground
- leaf level: the location in the ground which have no more route to travel
- return value: every function will return a value with one of the type list above
- num: accept a literal number or a variable which holding number type value
- bool: accept a literal boolean or a variable which holding boolean type value

## Syntax
- Line based: each statement will be on a single line
- Free indentation: like most language, you can freely set the indentation for each line, either tab or space will work
- Left association: each statement start from left to right, what ever come first will determine what the rest of the statement will be
- No bracket: there're no bracket in the syntax so change precedence or grouping isn't an option
- Must output something: no matter how the logic go, the program must reach an end by call function *exitwith*
- Scope: every variable will have global scope, no matter where and when it was first appeared
- Free type: variable have no type or you can save it have type of value it holding (like JavaScript)
- Free nameing: you can name a variable however you like as long as it have no space or tab, even using keyword like "null" but when using it the order below will be apply top down so be carefull
- Function call, parameter passing: too much => ignored, not enough => error
- Unicode: support or not depend on the impletation

## Precedence
> You will not see name of function down there cause if you see *\<func\>* then nothing but a name of function will work
1. null
2. boolean literal
3. number literal
4. string literal
5. name of variable

### Example:
```
use a from my.input.firstValue
use b from my.input.randomValue
if compare a > b
    exitwith false
endif
exitwith true
```

## Functions
| Signature | Description |
| --- | --- |
| use *\<var\>* from *\<ap\>* :: null | create new var with value from the ground at the location which the given access path point to, the location must be at the leaf level of the ground |
| if *\<func\>* :: null | check whether to execute or ignore staments until reach *else* or *endif*, the *func* must return a boolean |
| else | start or stop ignoring statement based on the output state of previous *if* |
| endif | stop ignoring statement if any, mark the end of *if* or *else* affected range |
| set *\<var\>* = *\<func\>* :: null | take return value from *func* and put to *var*, new variable will be created if not exists |
| compare *\<num\>* *\<op\>* *\<num\>* :: boolean | perform comparation on 2 given number, *op* can be one of [>, <, =, !=, >=, <=] |
| combine *\<bool\>* *\<op\>* *\<bool\>* :: boolean | combine two boolean value together, *op* can be one of [and, or] |
| isNull *\<var\>* :: boolean | check whether given variable is null |
| isFalse *\<var\>* :: boolean | check whether given variable hold false value or not, only *false* will end up true, any others value will end up false |
| exitwith *\<bool\>* :: boolean | stop the process immediately with given value |
| multiply *\<num\>* *\<num\>* :: number | multiply two number together |
| add *\<num\>* *\<num\>* :: number | add two number together |
| divide *\<num\>* *\<num\>* :: number | divide first given number to second given number |


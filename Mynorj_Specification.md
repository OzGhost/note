
# This document is a specification for my mini language (named Mynorj), the implementation may come up later :)
## Syntax
- Line based: each statement will be on a single line
- Free indentation: like most language, you can freely set the indentation for each line, either tab or space will work
- Left association: each statement start from left to right, what ever come first will determine what the rest of the statement will be
- No bracket: there're no bracket in the syntax so change precedence or grouping isn't an option
- Example:
```
use a from my.input.firstValue
use b from my.input.randomValue
if compare a > b
    endwith false
endif
endwith true
```

## Types
> Some type was listed below was borrowed from [JSON Data Types](https://www.w3schools.com/js/js_json_datatypes.asp)
- *number*: all the number work as real number -> end up with precision issues when do math (ex: 35)
- *string*: a series of character come together between a couple of double quote (ex: "the string")
- *boolean*: only two value available: true and false
- *null*: only one value available: null

## Definations
- var (or variable): a series of character used to hold value during execution
- func (or function call): start with a function name and the rest of the statement
- ground: the external input source which was provided by system, organized as a tree structure
- ap (or access path): a series of character which denote the location of value inside the ground
- leaf level: the location in the ground which have no more route to travel
- return value: every function will return a value with one of the type list above
- num: accept a literal number or a variable which holding number value

## Functions
| Signature | Description |
| --- | --- |
| use *\<var\>* from *\<ap\>* :: null | create new var with value from the ground at the location which the given access path point to, the location must be at the leaf level of the ground |
| if *\<func\>* :: null | check whether to execute or ignore staments until reach *else* or *endif*, the *func* must return a boolean |
| set *\<var\>* = *\<func\>* :: null | take return value from *func* and put to *var*, new variable will be created if not exists |
| compare *\<num\>* *\<op\>* *\<num\>* :: boolean | perfom comparation on 2 given number, *op* can be one of [>, <, =, !=, >=, <=] |


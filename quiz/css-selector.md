
> [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

==There are no selectors or combinators to select parent items, siblings of parents, or children of parent siblings.==

# Simple one
- univeral  : *         : every elements
- tag name  : span      : elements with given name
- class     : .class    : elements have given class (the dot '.' not included)
- id        : #id       : element that have given id

# [Attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
- [attr]        : every elemnets have given attribute no matter what value that attribute holding

### Value based
- [attr=val]    : exact value
- [attr~=val]   : contains exact word (exn)
- [attr|=val]   : exact value or begin with val-
- [attr^=val]   : prefixed by val
- [attr$=val]   : suffixed by val
- [attr*=val]   : contains exact val

### Flag for value based
- [... i]       : i/I flag which match value as case-insensitive (exn)

# Combinators
- Descendant    : p a       : any `a` that is inside a `p`
- Child         : p > a     : any `a` that is direct child of a `p`
- General sib   : p ~ a     : any `a` that follow a `p` which stay in the same level (exn)
- adjacent sib  : p + a     : any `a` that right after `p` (exn)

# [Pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)


# [Pseudo elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)


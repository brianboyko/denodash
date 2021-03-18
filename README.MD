# DenoDash

## A Typescript-First utility library for Deno

### Why yet another utility library?

I'll be honest, I _love_ Lodash in my node projects. Even though I could
implement many of the features myself, it's just convenient to have it all in a
simple package that is pretty standard. But it's not without it's flaws,
especially when going from Node to Deno.

Lodash was designed in a EMCA 3 kind of world, where things such as "filter" and
"slice" were not yet part of the official Javascript prototype. Moving forward,
there are a lot of utilities that a utility library can omit. Do we really need
_.last when we can just write arr[arr.length - 1]? Or _.compact when we can just
write arr.filter(x => !!x)?

Instead of importing Lodash into the new Deno ecosystem, I thought it was a good
idea to write a new utility library - one designed from the ground up to work in
the deno paradigm. That means typescript (with generics where possible) and
stand-alone modules.

## Goals of the project

- Every function can be imported independently, meaning that you don't need to
  download the whole package for one utility. Just need "get"? Just get "get"!
- Full Typescript Support including generics. While generics are an advanced
  Typescript topic, the use of generics in a utility library will help with
  typechecking going forward and prevent nasty errors.
- Only provide what is missing from the core. Functions that can be trivially
  implmented or are already part of the prototype should be omitted; conversely,
  helpful utilities not available in other libraries might have a home here.
- Practically Functional. While mutation _within_ the utility function is
  allowed, no utility function should _ever_ mutate a parameter passed to it,
  returning only new variables. These functions will never change your inputs.
- Utility Types as well as utility functions - some function and object
  constructions are common enough that they can be implemented as named types.
  Comparator, Iteratee, Predicate, etc. These types are provided to extend the
  functionality of Typescript's already good library of utility types (Partial,
  Required, et. al)

### Changing the order

A pattern that I found in Lodash was often that the library offered many
functions ending with the suffix "-by" or "-with" that took a function as the
_last_ parameter, iterating over the arguments provided until it hit a function.
This made a lot of sense in the days before spread operators, but it seemed to
me that it would be better to put the function first... or _even better_, create
a curried function.

For example, lodash's "intersectionBy" has the following syntax and examples:

```javascript
// _.intersectionBy([arrays], [iteratee=_.identity])
_.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
// => [2.1];
```

To me, it seemed like a better way to handle this would be:

```typescript
// const intersectionBy = <T>(fn: Iteratee<T, any>) => (...arrays: T[][]): T[]
// or without the generics:
// intersectionBy = (fn: Function) => (...arrays: Array<Array<any>>) => Array<any>)
intersectionBy(Math.floor, [2.1, 1.2], [2.3, 3.2]);
// => [2.1]
```

At one point I considered using currying, but as this is a utility library, the
inefficiency of closures in V8 makes a simple function the way to go for now.

## Current High Priority Needs:

### Debounce & Throttle

It can be difficult to test Debounce and Throttle, and I'm not 100% sure I got
the implementation right. I'd like another pair of eyes on it if it's possible,
and some more tests.

## Methods:

### Currently Supported:

- array
  - cartesianProduct
  - chunk
  - chunkIntoParts
  - difference
  - differenceBy
  - differenceWith
  - dropWhile
  - dropWhileRight
  - findLastIndex
  - flatten
  - flattenDeep
  - flattenDepth
  - fromPairs
  - intersection
  - intersectionBy
  - intersectionWith
  - lastIndexOf
  - partition - Lodash lists this in "Collections"
  - partitionBy - Lodash lists this in "Collections"
  - shank - like Array.prototype.splice, but returns a new array rather than
    mutating the old one.
  - union
  - unionBy
  - unionWith
  - unzip
  - xor
  - zip
- collection
  - count
  - countBy
  - flatMapDeep
  - flatMapDepth
  - groupBy
  - keyBy
  - sample
  - sampleOne
  - shuffle
  - sortBy
- function
  - after
  - before
  - debounce
  - defer
  - memoize
  - once
  - overArgs
  - throttle
- lang
  - cloneDeep
  - isEqual
- objects
  - findKeys
  - get
  - invert
  - mapObject
  - omit
  - pick
- types
  - type Comparator
  - type Iteratee
  - type ObjectKey
  - type Predicate
  - type SortComparator
  - type ValueOrArray
- utils
  - comparatorChain
  - delay
  - identity
  - mergeSort
  - randomOf

### Roadmap

Refactor:

These methods are likely next to be implemented

- utils
  - range
  - uniqueId
- monad (refered to as "Seq" in lodash)
  - monadify
    - Monad.map
    - Monad.tap
    - Monad.value
    - Monad.chain
- types
  - type Monad
- utils
  - toPath

### Proposed

These methods might be implemented, but they're not high priority.

- array
  - sortedIndex
  - sortedIndexBy
  - sortedIndexOf
  - sortedLastIndex
  - sortedLastIndexOf
  - sortedUniq
  - sortedUniqBy
  - xorBy
  - xorWith
  - zipObject
  - zipObjectDeep
  - zipWith
- utils
  - heapSort
- string
  - camelCase
  - capitalize
  - deburr
  - escape
  - kebabCase
  - lowerFirst
  - padEnd
  - padStart
  - padSides
  - snakeCase
  - startCase
  - unescape
  - upperFirst

### Will Not Implement

These are methods currently found in Lodash and/or Underscore which won't be
implemented. Most of them are already implimented natively in TS/EMCA 6.0. Some
of them are trivial to impliment. ('head(myArray)', for example, can be replaced
by 'myArray[0]'). My guide to 'triviality' is that if it would take more
characters to import the method from denoland than it would to re-create the
function, it's probably trivial.

However, I may have been overzealous in my trimming, if you think that one of
these methods is needed, please create an issue.

- array
  - compact
  - concat
  - drop
  - dropRight
  - fill
  - findIndex
  - first
  - head
  - indexOf
  - initial
  - nth
  - pull
  - pullAll
  - pullAllBy
  - pullAllWith
  - pullAt
  - remove
  - reverse
  - slice
  - tail
  - take
  - takeRight
  - takeRightWhile
  - takeWhile
  - uniq (identical to union())
  - uniqBy (identical to unionBy())
  - uniqWith (identical to unionWith())
  - unzipWith
  - without
- collection
  - each/forEach
  - eachRight/forEachRight
  - every
  - filter
  - find
  - findLast
  - flatMap
  - includes
  - invokeMap
  - map
  - orderBy
  - reduce
  - reduceRight
  - reject
  - size
  - some
- date
  - now
- function
  - ary
  - bind
  - bindKey
  - curry
  - curryRight
  - flip
  - negate
  - partial
  - partialRight
  - rearg
  - rest
  - spread
  - unary
  - wrap
- lang
  - castArray
  - clone
  - cloneDeepWith
  - cloneWith
  - conformsTo
  - eq
  - gt
  - gte
  - isArguments
  - isArray
  - isArrayBuffer
  - isArrayLike
  - isArrayLikeObject
  - isBoolean
  - isBuffer
  - isDate
  - isElement
  - isEmpty
  - isEqualWith
  - isError
  - isFinite
  - isFunction
  - isInteger
  - isLength
  - isMap
  - isMatch
  - isMatchWith
  - isNaN
  - isNative
  - isNil
  - isNull
  - isNumber
  - isObject
  - isObjectLike
  - isPlainObject
  - isRegExp
  - isSafeInteger
  - isSet
  - isString
  - isSymbol
  - isTypedArray
  - isUndefined
  - isWeakMap
  - isWeakSet
  - lt
  - lte
  - toArray
  - toFinite
  - toInteger
  - toLength
  - toNumber
  - toPlainObject
  - toSafeInteger
  - toString
- math
  - add
  - ceil
  - divide
  - floor
  - max
  - maxBy
  - mean
  - meanBy
  - min
  - minBy
  - multiply
  - round
  - subtract
  - sum
  - sumBy
- number
  - clamp
  - inRange
  - random
- objects
  - assign
  - assignIn
  - assignInWith
  - assignWith
  - at
  - create
  - defaults
  - defaultsDeep
  - entries
  - entriesIn
  - extend
  - extendWith
  - findKey
  - findLastKey
  - forIn
  - forInRight
  - forOwn
  - forOwnRight
  - functions
  - functionsIn
  - has
  - hasIn
  - invertBy
  - invoke
  - keys
  - keysIn
  - mapKeys
  - mapValues
  - merge
  - mergeWith
  - omitBy
  - pickBy
  - result
  - set
  - setWith
  - toPairs
  - toPairsIn
  - transform
  - unset
  - update
  - updateWith
  - values
  - valuesIn
- string
  - endsWith
  - escapeRegExp
  - lowerCase
  - parseInt
  - repeat
  - replace
  - split
  - template
  - toLower
  - toUpper
  - trim
  - trimEnd
  - trimStart
  - truncate
  - upperCase
  - words
- utils
  - attempt
  - bindAll
  - cond
  - conforms
  - constant
  - defaulTo
  - flow
  - flowRight
  - iteratee
  - matches
  - matchesProperty
  - method
  - methodOf
  - mixin
  - noConflict
  - noop
  - nthArg
  - over
  - overEvery
  - overSome
  - property
  - proprtyOf
  - rangeRight
  - runInContext
  - stubArray
  - stubFalse
  - stubObject
  - stubString
  - stubTrue
  - times

## Authors & Contributors

Right now, this is a solo project of Brian Boyko, but this is being opened up to
contributions.

## Changelog

This is still in pre-alpha, with fuller documentation and publishing to
deno.land to come.

0.1.1 First Published 0.1.2 Documentation added and minor changes.

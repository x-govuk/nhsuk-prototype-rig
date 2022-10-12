---
templateEngineOverride: md
title: Strings
order: 5
---

## isString

Checks if a value is classified as a [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) primitive or object.

Input

```njk
{{ "Number 10" | isString }}
{{ 10 | isString }}
```

Output

```html
true
false
```

## noOrphans

Add a non-breaking space between the last two words of a string. This prevents an orphaned word appearing by itself at the end of a paragraph. This can be useful for improving the appearance of headings and titles.

Input

```njk
{{ "Department for Business, Energy & Industrial Strategy" | noOrphans | safe }}
```

Output

```html
Department for Business, Energy & Industrial&amp;nbsp;Strategy
```

## pluralise

Get the plural form for an item for a given number of items.

> This filter currently only works with English words.

```njk
{{ 1 | pluralise("mouse") }}
{{ 2 | pluralise("house") }}
{{ 2 | pluralise("house", { number: false }) }}
{{ 2 | pluralise("mouse", { plural: "mice" }) }}
{{ 2 | pluralise("mouse", { plural: "mice", number: false }) }}
```

Output

```html
1 mouse
2 houses
houses
2 mice
mice
```

## slugify

Convert a string to kebab-case. This can be useful to slugify titles for use in URLs or fragment identifiers.

Input

```njk
{{ "Department for Education" | slugify }}
```

Output

```html
department-for-education
```

## startsWith

Checks if a string starts with a value.

Input

```njk
{{ "Department for Transport" | startsWith("Department") }}
```

Output

```html
true
```

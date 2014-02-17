---
layout: post
title: Java features I miss in Objective-C
permalink: java-vs-objc
date: 2014-01-02
---

## Packages

One of Objective-C's biggest annoyances is the lack of proper namespacing. It's hard to believe, after years of programming in other languages, that I now prefix *every class name I ever type* with a two if not three-character code.

Java solves this problem by grouping classes together in units known as [packages](http://en.wikipedia.org/wiki/Java_package). At the top of a class file, the package that the class belongs to is declared, in reverse DNS format:

{% highlight java %}
package com.tumblr.models;
{% endhighlight %}

Once included in a package, the class's name can be something totally generic, like `Post`. When one class imports another, it does so using the fully-qualified name:

{% highlight java %}
import com.tumblr.models.Post;
{% endhighlight %}

If a class imports more than one `Post` class, the fully-qualified name is again used to avoid ambiguity when declaring and instantiating:

{% highlight java %}
com.tumblr.models.Post post = new com.tumblr.models.Post();
{% endhighlight %}

This is rarely necessary in practice, however.

## Generics

[Generics](http://en.wikipedia.org/wiki/Generics_in_Java) are a language feature that allow "type variables" to be used in class definitions. Let's look at an example:

{% highlight java %}
class ArrayList<E> {
    E get(int index);
    void add(E element);
}
{% endhighlight %}

`E` represents a parameterized type that can differ across `Array` instances. The result is a glorious, best-of-both-worlds situation where arrays remain infinitely flexible yet still provide the compiler with information that it can use to help keep you from making a mistake.

{% highlight java %}
ArrayList<String> stringArray = new ArrayList<String>();
stringArray.add(string);

ArrayList<Integer> integerArray = new ArrayList<Integer>();
integerArray.add(string); // Won't compile
{% endhighlight %}

Subclasses of generic classes don't necessarily have to remain generic. Instead, they can specify a concrete type argument for the parameterized type:

{% highlight java %}
class IntegerArrayList extends ArrayList<Integer> {
}
{% endhighlight %}

In this case, there's no need to re-declare `get` or `add` to specify the argument or return types. Trying to pass or return return something other than an `Integer` will result in a compiler error.

Java even supports type wildcards, which allow a type argument to specify either a lower or upper bound:

{% highlight java %}
List<? extends Number>  // Type must be Number or a subclass
List<? super Number>    // Type must be Number or its superclass
{% endhighlight %}

It's worth noting that generics in Java are simply a compile-time construct, which allowed them to be introduced in Java 5 while maintaining backwards compatibility with older runtimes. I'm unaware of a technical reason why Objective-C couldn't go the same route.

## Annotations
[Annotations](http://en.wikipedia.org/wiki/Java_annotation) are a great feature that allows metadata to be added to classes, methods, variables, parameters, and packages. Annotations can be both used by developer tools at compile-time as well as at run-time, by your code itself.

First, let's use an annotation to tell the compiler that we're overriding a method that belongs on our superclass (don't be confused by the `@` symbol which obviously has [all sorts of meanings](http://nshipster.com/at-compiler-directives/) in Objective-C but is only used for annotations in Java):

{% highlight java %}
@Override
public String someMethod(Array array, Integer integer) {
}
{% endhighlight %}

Why is this useful? Let's say that a typo was included in the method name, or a wrong type was used for one of the arguments. Normally this wouldn't generate a warning or error, a new method would simply be declared instead of overriding an existing one. By using the `@Override` annotation, the compiler can tell us that a mistake has been made rather than failing silently.

The `@Override` annotation actually ships with the Java SDK, but you can define your own custom annotation types as well. Annotations can include a list of optional key-value pairs, which allow us to build something like the following:

{% highlight java %}
@ResponseField(key = "blog_name", trim = true, required = true)
String blogName;
{% endhighlight %}

Say you're implementing a mobile app that parses data from an API. Annotations allow this to be done declaratively instead of procedurally. Instance variables can be marked up with a custom `@ResponseField` annotation that indicates that they should be populated with values from the API responses. The response parsing logic can now be completely generic and reused across all of your different model objects:

* Introspect an instance for variables with the `@ResponseField` annotation
* Use the `key` field to determine where the desired value can be found in the API response dictionary
* Use other fields to do other things, e.g. trim strings if `trim = true`, abort if a non-nullable field is missing, run a regular expression to ensure a field contains a valid value, etc.

## Enums

You're thinking "Objective-C already has enums." Objective-C enums are just integer types while [Java enums](http://en.wikipedia.org/wiki/Enumerated_type#Java) are instances of a custom class, with their own instance variables and methods.

Say you're building an application with multiple themes. Each theme has a name, a background color, and a text color. It's easy to model this using Java enums:

{% highlight java %}
enum Theme {
    DARK("Dark", Colors.darkBackgroundColor, Colors.darkTextColor),
    LIGHT("Light", Colors.lightBackgroundColor, Colors.lightTextColor),

    String name;
    Color backgroundColor;
    Color textColor;

    Theme(String name, Color backgroundColor, Color textColor)  {
        this.name = name;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
    }

    String getName() { return name; }
    Color getBackgroundColor() { return backgroundColor; }
    Color getTextColor() { return textColor; }
}
{% endhighlight %}

In Objective-C, you'd probably implement this with two singletons, exposed via class methods:

{% highlight objectivec %}
@implementation Theme

@property (nonatomic, readonly) NSString *name;
@property (nonatomic, readonly) UIColor *backgroundColor;
@property (nonatomic, readonly) UIColor *textColor;

+ (instancetype)darkTheme;

+ (instancetype)lightTheme;

@end
{% endhighlight %}

The implementation of each class method would create and configure a `Theme` instance and cache it inside a static instance variable, likely using a Grand Central Dispatch [dispatch_once](https://developer.apple.com/library/Mac/DOCUMENTATION/Performance/Reference/GCD_libdispatch_Ref/Reference/reference.html#//apple_ref/c/func/dispatch_once) function. This is verbose, and while you could use a macro to avoid copying a bunch of boilerplate code each time you add a new theme, macros involve their own sets of tradeoffs.

The Java implementation is superior not only for its brevity but also because the enumerated values can both be switched on and enumerated:

{% highlight java %}
switch (theme) {
    case DARK:
        // Do something specific to dark themes
        break;
    case LIGHT:
        // Do something specific to light themes
        break;
}

for (Theme theme : Theme.values()) {
    // Create a table cell for each theme
}
{% endhighlight %}
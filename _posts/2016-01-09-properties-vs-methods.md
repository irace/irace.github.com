---
layout: post
title: Properties vs. methods
permalink: properties
date: 2016-01-09
---

Here’s a potentially controversial thought that keeps coming back to me as I spend more and more time developing in Swift: <mark>I don’t think that properties should be part of a type’s public interface.</mark>

[The Swift Programming Language](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Properties.html#//apple_ref/doc/uid/TP40014097-CH14-ID254) states that “Properties associate values with a particular class, structure, or enumeration.” This is all well and good, since associating types with values is *not* functionality that could otherwise be provided by methods alone. I certainly don’t have a problem with using properties to *implement* a type. I’m solely bothered by this implementation detail subsequently leaking out into a type’s API. Let’s take a look at an excerpt from `String`’s public interface:

{% highlight swift %}
public struct String {
  public var lowercaseString: String { get }
}
{% endhighlight %}

From this, a caller knows that `stringInstance.lowercaseString` can be called without parentheses. On the other hand, the standard library authors could’ve just as easily implemented `String` as follows:

{% highlight swift %}
public struct String {
  public func lowercaseString() -> String
}
{% endhighlight %}

In which case, we’d call `stringInstance.lowercaseString()` to achieve the same result. But why on Earth should a caller need to concern themselves with this distinction?

Over the years, I’ve heard many variations on the following: properties are for accessing instance variables, while methods are for performing actions. I have two major problems with this line of thinking:

* If properties are for accessing instance variables, having them be part of a class’s public API provides unnecessary transparency into how that class is implemented, violating encapsulation.
* We all know full well that properties *aren’t* just for accessing instance variables. Computed properties were and are commonly used in Objective-C. Swift even perpetuates this further by providing first-class language support for them[^1].

<mark>While Swift eschewed Objective-C’s brackets in favor of dot-syntax for everything, it didn’t actually shake having different invocation syntaxes for properties and methods.</mark> I wish it had.

Consistency when calling a property accessor or a method would be beneficial for other reasons as well. Every zero-argument method *could* be implemented as a property, but adding an argument would then change the call site from `foo.bar` to `foo.bar(argument: baz)` instead of from `foo.bar()` to `foo.bar(argument: baz)`. Isn’t that kind of weird?

Instance methods can also be curried, and in fact, [are *already* curried class methods](http://oleb.net/blog/2014/07/swift-instance-methods-curried-functions/). You can get a handle to them as follows:

{% highlight swift %}
struct SomeType {
  func doSomething() {
      // ...
  }
}

let somethingDoer = SomeType.doSomething
{% endhighlight %}

You can’t do this with properties though, meaning you can’t employ [tricks like this](https://gist.github.com/Pearapps/cbbb23fad41c4917621e) with higher-order functions, the way that you could if they were argument-less methods.

Properties provide a hugely beneficial, expressive way to instruct the compiler how to generate boilerplate accessors and mutators for you. Swift expands on this by providing a whole slew of additional ways to not only define them, but also hook into changes being made[^2]. I’m *really* glad I don’t need to implement all of this myself.

At the same time, <mark>I can’t help but feel like Swift is missing an opportunity to provide a conceptually simpler programming model by removing this distinction from its types’ public interfaces.</mark>

<center class="centered-tweet"><blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/jansichermann">@jansichermann</a> <a href="https://twitter.com/mb">@mb</a> Believe me, we got there</p>&mdash; Bryan Irace (@irace) <a href="https://twitter.com/irace/status/440943091907067904">March 4, 2014</a></blockquote></center>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

[^1]: Calling Objective-C methods like `-[NSArray count]` using dot-notation was a surefire way to be [chided](https://twitter.com/irace/status/440941047636828161), due to `count` not having been a property. Then Apple changed `count` to be a property instead of a method, ostensibly because `array.count` is nicer than `[array count]`. In the process, I’m assuming they didn’t stop computing the count in favor of storing it in an instance variable.

[^2]: As an aside, [I *do* worry](https://twitter.com/irace/status/672529401637138432) that properties are overused as a result of how nice it is to define them, syntactically. It’s incredibly tempting to have a `user` property whose `didSet` block updates a persistent store and notifies a delegate, when a method named something like `persistUserAndUpdateDelegate:` is *far* more informative to someone reading the call site. I like these [two](http://www.sicpers.info/2014/01/set-the-settings-set/) [posts](http://www.yegor256.com/2014/09/16/getters-and-setters-are-evil.html) on the subject matter.

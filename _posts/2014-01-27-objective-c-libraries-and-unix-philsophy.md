---
layout: post
title: Objective-C libraries and Unix philosophy
permalink: objc-libraries
date: 2014-01-27
---

[Caleb Davenport](https://twitter.com/calebd) recently asked the following question on Twitter:

<center class="centered-tweet"><blockquote class="twitter-tweet" lang="en"><p>Is there a small CocoaPod that does NSDictionary to and from form encoded string and nothing else?</p>&mdash; Caleb Davenport (@calebd) <a href="https://twitter.com/calebd/statuses/425705753404379136">January 21, 2014</a></blockquote></center>
<script src="http://platform.twitter.com/widgets.js" charset="utf-8">&nbsp;</script>

He knew that this functionality already exists in a number of larger libraries, but couldn't find exactly what he was looking for; something that did query string serialization correctly and nothing else. So he [made it](https://github.com/calebd/CMDQueryStringSerialization).

I've long adored the Node.js community in part for their steadfast belief that modules in [NPM](https://npmjs.org) should embody the [Unix philosophy](http://en.wikipedia.org/wiki/Unix_philosophy) of "do one thing and do it well." Node modules are championed if they export a single function and deemed to be inadequate if they expose more surface area than is needed.

Objective-C doesn't yet have the ecosystem of third-party libraries that languages such as JavaScript or Ruby do, nor even a consensus among developers that using third-party code is a good idea in the first place. This conservative view towards dependency inclusion makes a lot of sense, as fixing bugs in Objective-C software involves getting a new binary onto your customers' devices, with an opaque and potentially lengthy App Store approval process often standing in the way.

For this very reason, a shift towards building more focused, modular Objective-C libraries should be welcomed. Small modules allow even the most conservative of developers to benefit by including open-source components that are easy to understand, thoroughly tested, and expose only the most pertinent of APIs. The more a library does, the harder it is to understand what it's doing and how well it's doing it, making it less likely to be used and far less valuable to the community as a whole.

In my experience, small modules also foster much better collaboration. It's easy to be tentative about contributing to a large library, as it's harder to fully understand the architectural underpinnings and how the maintainer plans to structure it as it evolves. Caleb's library, to the contrary, was so small in scope that I felt comfortable opening [a pull request](https://github.com/calebd/CMDQueryStringSerialization/pull/1) almost immediately. Small modules have explicit goals which makes it easy for others to help.

Has CocoaPods played a role in this shift? I think so. Though CocoaPods allows one to publish a sprawling monolith as easily as it does [a single function](https://github.com/irace/BRYParseKeyboardNotification), lower barriers to create and consume libraries is a win for modularity in general. The more painful it is to integrate a dependency, the fewer times you'll opt to do so, making larger libraries seem attractive. CocoaPods makes integration so easy that there's no excuse *not* to break your code up into small modules.

Creating a Objective-C library will always have more overhead than for example, a Node module, due to header files, project files, etc. But I'm thrilled with the direction that we seem to be moving in as a community.

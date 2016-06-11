---
layout: post
title: Why I don't prefix category methods
permalink: category-prefixes
date: 2013-11-27
---

This weekend I came across a series of tweets from [Nick Lockwood](https://twitter.com/nicklockwood) explaining why he doesn't prefix his class category method names, and found fully myself vehemently agreeing with everything he said.

<center>
<blockquote class="twitter-tweet"><p>People ask why I don't prefix category methods. It's because prefixes are ugly, and the ONLY reason for categories is to make code beautiful</p>&mdash; Nick Lockwood (@nicklockwood) <a href="https://twitter.com/nicklockwood/statuses/394043609957552128">October 26, 2013</a></blockquote>
<script src="http://platform.twitter.com/widgets.js" charset="utf-8">&nbsp;</script>
</center>

This is dead-on. Unless you're specifically trying to override existing behavior[^1], *class categories are nothing but syntactic sugar*. There's *nothing* to be gained functionally by using a category as opposed to simply a function, or class/instance methods on a custom object that you create. It's simply aesthetic preference.

<center>
<blockquote class="twitter-tweet"><p><a href="https://twitter.com/nicklockwood">@nicklockwood</a> agreed. If &#39;myMethod&#39; is likely to clash, then use &#39;myMethodThatIsNotLikelyToClash&#39;, not &#39;ugly_myMethod&#39;.</p>&mdash; Simon Booth (@percysnoodle) <a href="https://twitter.com/percysnoodle/statuses/394051242370293760">October 26, 2013</a></blockquote>
<script src="http://platform.twitter.com/widgets.js" charset="utf-8">&nbsp;</script>
</center>

If you think creating unprefixed class category methods is unsafe because Apple could potentially add a method that collides with yours in the future, please realize that *this could also happen to any method on any custom class in your application*. Apple adds new methods to `NSObject` and other commonly subclassed base classes all the time. Categories are hardly the only place where such a problem could arise.

<center>
<blockquote class="twitter-tweet"><p><a href="https://twitter.com/sdarlington">@sdarlington</a> unless you prefix all public and private methods/properties of every class you make, you can&#39;t completely avoid collision risk.</p>&mdash; Nick Lockwood (@nicklockwood) <a href="https://twitter.com/nicklockwood/statuses/394034008411369474">October 26, 2013</a></blockquote>
<script src="http://platform.twitter.com/widgets.js" charset="utf-8">&nbsp;</script>
</center>

If you're releasing a class category as part of an open-source library, it *may* make sense to prefix its methods. However, even then I have my doubts. If the library only uses these category methods internally, then yes, prefix them to prevent against collisions with any other open-source code that the developer using your code may have also imported. But again, in this case I'm not sure using a category really buys you very much. If the category itself is expected to be used directly by third-party developers, the original point remains: is using a prefixed category method any cleaner looking than a utility class? I tend to think not.

**UPDATE:** Both [Brian Bonczek](https://twitter.com/itsbonczek) and [Jared Sinclair](https://twitter.com/jaredsinclair) have pointed out a benefit of prefixing category methods that I somehow overlooked: to prevent collisions with third-party dependencies that *you* include. But again I question the general usefulness of third-party categories as opposed to utility classes.

[^1]: In which case you wouldn't be using a prefix anyway.

---

Originally published on [cocoa.tumblr.com](http://cocoa.tumblr.com)

---
layout: post
title: NSNotificationCenter with blocks considered harmful... unless you use weak references, then it's fine
permalink: nsnotificationcenter-blocks
date: 2013-11-20
---

Drew Crawford published a post entitled [NSNotificationCenter with blocks considered harmful](http://sealedabstract.com/code/nsnotificationcenter-with-blocks-considered-harmful/) yesterday. Upon reading, one might get the impression that using the `NSNotificationCenter` block API is different in some way then using blocks, well, anywhere else. It isnt.

`NSNotificationCenter` retains the blocks that you pass to it, and as such, referencing `self` inside the block will introduce in a nasty retain cycle. This is unfortunate but far from a new revelation; Jim Dovey [wrote about this](http://tumblr.alanquatermain.me/post/1686415314/an-nsnotification-blocks-gotcha) almost exactly two years ago and [I got bit](http://bryan.io/post/4766732327/nsnotifications-and-blocks) pretty hard myself during my earlier days as an iOS developer.

My problem is that Drew's article seems to imply that using blocks with `NSNotificationCenter` is worse in any way than using *any* other block that gets retained by `self`. Either way, you need to make sure you're not closing over a strong reference to `self` or suffer the wrath of the resulting retain loop causing some hard-to-debug side effect. The only thing, in my opinion, that makes `NSNotificationCenter` blocks slightly dicier is that as Drew points out, the normal LLVM warning is for some reason missing in this instance[^1].

This isn't to say that Drew's article isn't worth reading; it's a great read, and you're almost certain to learn or have something reinforced. Just please know that using blocks *at all* requires understanding how to use weak references and the consequences of not doing so. I'd recommend reading the article but then following it up with [the accompanying Hacker News comment thread](https://news.ycombinator.com/item?id=6767386), in which Ash Furrow far more eloquently sums up what I've been trying to explain with this post:

> There's nothing really magical about this – don't cause retain cycles, everyone knows `__block` semantics changed with ARC, keep the returned value from the block-based `NSNotificationCenter` method, etc. Standard stuff.

[^1]: Probably because unlike most blocks retain cycles, this one is caused by `NSNotificationCenter` retaining the block as opposed to `self` retaining it.

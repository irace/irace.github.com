---
layout: post
title: Libraries we didn’t need
permalink: unneeded-libraries
date: 2016-06-27
---

At Tumblr, we were beyond thrilled when iOS 8 provided the ability for us to create an extension that could integrate with the OS at a deeper level than our application did. In practice, we ran into [a handful of limitations](http://irace.me/tumblr-ios-extension). For a non-trivial part of my final year there, I worked on a library called [XExtensionItem](http://github.com/tumblr/XExtensionItem), intended to address [a couple of these shortcomings](https://github.com/tumblr/XExtensionItem#why).

As I approached a 1.0, iOS 9 was released, [obviating the primary issue](https://github.com/tumblr/XExtensionItem/issues/57) that prompted me to build XExtensionItem in the first place. It still would have proven useful, but the diminished utility didn’t seem to justify much more development effort (or any subsequent evangelization). I effectively gave up on it and it hasn’t been touched since.

This isn’t a sob story, however. Third-party libraries are usually built because we’re lacking an adequate first-party solution to a problem, and in most cases, the best thing for the broader community is for a first-party solution to eventually materialize. The percentage of iOS developers who would’ve ever heard about my library – let alone actually integrated it – pales in comparison to how many have benefited from the fix that Apple ended up adding in iOS 9. Most almost certainly don’t even realize it.

I remember feeling bad for my friend [Jared Sinclair](http://twitter.com/jaredsinclair) after he put so much work into [OvershareKit](https://github.com/overshare/overshare-kit), only for Apple to go ahead and release the very Extensions APIs that we had been clamoring for at Tumblr. But in hindsight, I don’t think he would have wanted me to. OvershareKit wasn’t built because he expected it to bring him fame or fortune; he was simply trying to provide a solution to a problem that he knew he wasn’t the only one facing. While he may have preferred many aspects of OvershareKit to Apple’s built-in `UIActivityViewController`, he knew that [no solution he could deliver was better than the problem simply going away](http://blog.jaredsinclair.com/post/90064823470/oversharekit-to-be-maintenance-only-for-ios-8).

So while I don’t actually care that something I put a lot of time into didn’t amount to anything in the end, it felt weird that I never ended up talking about it. Hence my talking about it now.

I’m glad you didn’t need to exist, after all.

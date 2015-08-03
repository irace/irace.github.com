---
layout: post
title: We need a “Safari view controller”
permalink: safari-vc
date: 2014-12-10
---

In-app web browsers are extremely common on iOS, which shouldn’t be surprising at all. They allow developers and users alike to quickly view something on the web without being completely removed from the app they were using just moments prior. Many developers prefer this because it presumably leads to more usage of their applications[^1]. Many users like this because it provides a faster and cognitively lighter experience:

<center class="centered-tweet"><blockquote class="twitter-tweet" lang="en"><p>I see FB on Android now loads links in their own browser. Wish all apps did that. Faster/more seamless than kicking to Chrome each time.</p>&mdash; M.G. Siegler (@mgsiegler) <a href="https://twitter.com/mgsiegler/status/542617593421766656">December 10, 2014</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></center>

But in-app browsers have some pretty massive downsides as well. They can’t access cookies stored by other in-app browsers, nor Safari, requiring the user to repeatedly log in to websites that they should already be authenticated with. iCloud Keychain is great for syncing credentials across devices, but while Safari has access to its data, in-app browsers don’t[^2]. This isn’t merely Apple being punitive – it’d be horribly negligent to give third-party applications access to this kind of information.

That said, it’s also negligent to ask users to enter passwords into in-app browsers to begin with. [Third-party developers can easily access anything that a user types into their applications](http://furbo.org/2014/09/24/in-app-browsers-considered-harmful/), even if the website being accessed is viewed over HTTPS. While Apple has the power to help mitigate this problem, they’re [encouraging it instead](https://github.com/tumblr/TMTumblrSDK/issues/67#issuecomment-59389152), insisting that developers use in-app browsers for web-based authentication instead of a clunkier-yet-more-secure Safari-based OAuth flow, explicitly favoring user experience over security. There needs to be an in-between. 

It’d be wonderful if Apple provided a “Safari view controller” that developers could present directly from within their applications. This controller would run out of process and work almost exactly like [MFMailComposeViewController](https://developer.apple.com/library/prerelease/ios/documentation/MessageUI/Reference/MFMailComposeViewController_class/index.html) and [MFMessageComposeViewController](https://developer.apple.com/library/prerelease/ios/documentation/MessageUI/Reference/MFMessageComposeViewController_class/index.html) already do for composing emails and text messages respectively. The app would provide the controller with a URL (and optionally, a tint color), but otherwise what the user does in it would remain secure and isolated from any third-party code, yet fully integrated with Safari.app and Safari controllers presented by other applications.

iOS 8 share and action extensions are further proof that Apple thinks being able to display view controllers from one application inside of another strikes a great balance of security and user experience. Why not let us do the same with Safari as well?

[Here's a radar](http://www.openradar.me/radar?id=5795261179756544) that you can duplicate if you feel the same way that I do about this.

[^1]: Another reason to build in-app browsers in the past had been to augment them with functionality like “Save to Instapaper” and “Login with 1Password.” Now that iOS 8 extensions bake these capabilities into Safari itself, this is no longer a valid justification.

[^2]: Authentication isn’t the only feature that non-Safari browsers lack out of the box. Third-party apps can’t integrate with a user’s bookmarks nor iCloud Tabs, either, just to name a few.

---

[Originally published](http://bryan.io/post/104845880796/we-need-a-safari-view-controller) on [bryan.io](http://bryan.io)

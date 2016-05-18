---
layout: post
title: "Background check: multitasking on iOS throughout the years"
permalink: backgrounding
date: 2014-05-30
---

**“What are you doing that for?”**

It’s 2012. Imagine that you’re an iOS developer who understands how the operating system manages which apps are running at any given time. You happen to notice that your friend has opened the app switcher on their iPhone and is manually “killing” each application, one by one.

They tell you that they’re doing this to increase their battery life, or to make their phone faster. Even worse, [they might have been told to do this by an Apple store Genius Bar employee](http://daringfireball.net/2012/01/ios_multitasking). It’s not surprising that after using a Windows computer for most of their life, they’re inclined to believe that this might actually be true.

You *know* that it isn’t true though. You try to explain that those applications either aren’t running at all, or are in a suspended state that doesn’t impact their phone’s performance or battery life. If iOS needs to free up memory, it’ll do so without them needing to intervene, you say. They resist.

“So you’re telling me that closing *all* of these will have *zero* effect on my battery life?”

Sigh. OK, *now* how are you going to explain this?

“Well, for the most part, it won’t. But if one of those apps is tracking your location, or playing music, for example, then it might help. But in most of those cases, you probably don’t *want* to kill them, right?”

Multitasking on iOS has changed a lot, but it's always aimed to be something that the user doesn’t need to understand. Though present in Android from the start, third-party iOS applications weren’t allowed to do any background processing until iOS 4 was released in 2010. Even then, the permitted backgrounding behaviors were quite limiting. Specifically, apps could:

* Play audio or video
* Continue a task that was already in progress (for up to approximately ten minutes)
* Monitor the user’s location
* Receive incoming [Voice over IP](http://en.wikipedia.org/wiki/Voice_over_IP) (VoIP) calls

When iOS 5 came out, it added the ability for external accessories to communicate with backgrounded applications (e.g. over Bluetooth), as well as for [Newsstand](http://en.wikipedia.org/wiki/Newsstand_(application)) applications to download new content once per day.

Apple believes that providing great performance and battery life is more important than providing full-blown multitasking capabilities. Despite iOS 4 providing a reasonable compromise, many developers felt hamstrung by the limited capabilities. While developing [Instapaper](http://www.instapaper.com/), Marco Arment [proposed that more generic multitasking](http://www.marco.org/2010/06/10/iphone-multitasking-and-background-updating) be permitted under conditions that wouldn’t noticeably impact the user. Tapbots tried [playing a silent audio clip](http://tapbots.com/blog/pastebot/pastebot-music-in-background) but were rejected during App Review. Eventually, News.me [figured out](http://blog.news.me/post/21643399885/introducing-paper-boy-automatically-download-your-news) that Apple would turn a blind eye towards using geofencing to trigger content fetches, a hacky yet effective tactic that many other applications also rushed to adopt.

And then iOS 7 arrived.

With iOS 7, Apple has [changed app multitasking](http://www.objc.io/issue-5/multitasking.html) to behave very similarly to how Arment requested three years prior. Applications are now able to specify “background fetch” code that iOS will periodically run, regardless of if the app is currently in use. The interval at which an app will be “woken up” to run in the background depends on how frequently (and when) the user tends to use that particular application, and ostensibly factors such as the device’s current battery level. This system provides most of the benefits of full-blown multitasking while still remaining conservative with regards to battery drain.

Additionally, developers now have the ability to send silent push notifications that can wake up an app and allow it to fetch data or do some other work in the background. Imagine that you use an app to listen to podcasts. When a show that you subscribe to is updated, a server could send a silent push notification to that app on your phone, which could then download the new episode in the background. This is even more battery friendly than using the aforementioned background fetch APIs, as network requests are only made when there’s actually new data available to be retrieved.

Back to your friend.

iOS 7 also comes with a fancy new app switcher that allows you to kill an app with a nice, even fun, [upward swipe gesture](http://www.imore.com/how-kill-force-quit-apps-ios-7). And now that applications actually *do* run in the background, it makes sense that Apple would make force quitting an app a little more user friendly. As such, feel free to let your friend believe that what is now *actually* true on iOS 7 was true beforehand as well, even though you know that it wasn’t.

With one big caveat.

All of the new multitasking support—normally working its wonders to keep apps updated in the background without draining your battery—comes to a screeching halt for any apps that you’ve swiped out of the app switcher.

Removing an app from that switcher not only terminates any background operations that are *currently* occurring, but also prevents any that the OS may have permitted in the future. <mark>This means that the app won’t be woken up again to perform background fetches, and won’t receive anymore silent push notifications from the server</mark>. In order for these new forms of backgrounding to resume, you’ll have to explicitly launch the application again from your home screen.

In summary, iOS 7 makes true what many thought was already the case to begin with: that force quitting apps can help to save scarce resources such as battery. iOS 7 provides new opportunities for developers to provide great user experiences, but as much as Apple would love the inner-workings of iOS to remain “magical,” a cursory understanding of how multitasking affects battery life can truly go a long way.

The next time you see a friend obsessively clearing out their app switcher, make sure they know that while they may be prolonging their battery life, they might not have anything new to read the next time they get on the subway.

---

[Originally published](http://finertech.com/2014/05/30/featuredios-7-background-multitasking-killing-apps/) on [Finer Things in Tech](http://finertech.com)

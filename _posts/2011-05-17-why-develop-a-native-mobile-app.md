---
layout: post
title: Why develop a native mobile application?
permalink: native
date: 2011-05-17
---

*Published May 17, 2011 based on experiences building [GS Research for iPad](http://itunes.apple.com/us/app/gs-research/id430022668?mt=8). Updates will be additive as the original article will be kept intact for posterity.*

**UPDATE (9/22/2012):** Facebook developer Tobie Langel has [posted](http://lists.w3.org/Archives/Public/public-coremob/2012Sep/0021.html) some interesting feedback to a W3C mailing list in the aftermath of rewriting Facebook's failed web-based iOS application.

**UPDATE 2 (11/28/2012):** And now my app (Tumblr) is [fully native](http://engineering.tumblr.com/post/35271768127/tumblr-for-iphone-is-now-100-native) as well.

## Audience
Interested in building a mobile application but not sure where to start? There are a dizzying number of frameworks and platforms all currently vying to be your answer. In order to decide which is right for you, it’s important to understand the pros and cons of the different mobile development and deployment strategies available today.

## Introduction
It’s an incredibly exciting time to be a software developer. The emergence of numerous smartphone and tablet platforms, containing both native runtime environments and cutting edge browsers, has resulted in a bevy of options for those interested in writing applications to be used on the go. On the far ends of the spectrum are **native applications**, written in a language like Java or Objective-C and run directly by a device’s operating system, and **mobile web applications**, written in HTML, CSS and JavaScript and rendered in a mobile browser. Since web technologies are open, standardized, and allow one to easily target a wide user base, why choose an unfamiliar language or even framework? Using a mobile operating system’s native language and APIs has its advantages, which this paper will investigate and explain.

In this paper, I’ll compare and contrast native applications, mobile web applications, and a few approaches that blur the lines between the two.

## Native applications
Native development kits allow one to build mobile applications that are performant, can access all of a device’s API points, and have a familiar look-and-feel. Access to a mobile device’s camera, microphone, and address book, to name just a few, is provided by its native SDK. Native applications are unique in being able to seamlessly integrate these features[^1].

[^1]: The HTML5 specification provides web applications with some functionality that was previously only available through native SDKs, like geolocation and local storage, but there are and will continue to be gaps and varying degrees of browser support.

From a user experience point of view, native UI frameworks can be leveraged to build applications that are both aesthetically pleasing and intuitive. There’s a case to be made that mobile applications shouldn’t look and function the same on every platform; users of a mobile operating system acquire a sense of familiarity with the gestures, controls, and paradigms that are specific to that platform, and design decisions made with an iOS user in mind may not make as much sense to a user of a similarly sized and powered webOS device or BlackBerry.

To quickly mention a few more advantages of developing on a native platform:
* Advanced persistence: Frameworks such as iOS’s Core Data provide rich object- relational mapping (ORM) and robust lazy-loading and caching mechanisms.
* Superior tooling: IDEs like Eclipse and Xcode contain powerful debuggers among other useful tools.
* Secure storage: The iOS “keychain” provides a secure storage mechanism, which can be configured to encrypt data for a unique device/application combination and to only be available when the device has been unlocked.
* Stable frameworks: When choosing Cocoa Touch as your platform, it is assuring to know that Cocoa has been in use in all kinds of applications dating back to the 1980s. Mature components like Core Audio and Core Animation are well maintained and thoroughly documented[^2].

[^2]: Contrarily, one could easily argue that despite some turbulence, HTML5 is still [in a better state than certain native SDKs like the BlackBerry Playbook’s](http://blog.jamiemurai.com/2011/02/you-win-rim/).

## Mobile web applications
Another common approach is to create a website whose user interface is optimized for mobile devices, using a library such as [Sencha Touch](http://sencha.com/products/touch/), [jQTouch](http://jqtouch.com) or the forthcoming [jQuery Mobile](http://jquerymobile.com). These frameworks provide cross-browser compatible interfaces and animations that attempt to look and feel native but are built using standard web technologies: HTML, CSS, and JavaScript[^3]. In many modern browsers, HTML5 web applications can even be used without an Internet connection.

[^3]: Apple’s Dashcode (part of the Xcode suite) can be used to create iPhone-optimized web applications, but with varying degrees of cross-browser compatibility.

One benefit of developing a mobile web application is that you can immediately release new versions without requiring users to explicitly upgrade. While the Android Market allows for a similarly quick turnaround time, distributing through the Apple App Store requires first having your application’s quality and subject matter reviewed and approved by Apple, which can take some time[^4]. With a web application, you also don’t need to worry about breaking backwards compatibility.

[^4]: The review process isn’t all bad; users may be more willing to download an application that has been vetted by a trusted source and is likely to be free of viruses or malicious code.

A disadvantage of mobile web development, in addition to the lack of native API support, is inferior performance. “The Web technology stack hasn't achieved the level of performance we can attain with native code, but it's getting close,” states [an article](http://queue.acm.org/detail.cfm?id=1968203) written by leaders of the cross-platform [PhoneGap](http://phonegap.com) framework. While native applications are compiled for high-speed execution, web applications use JavaScript that is primarily interpreted at runtime[^5]. Performance also has an effect on battery life; expensive operations will drain a phone or tablet’s battery faster than more efficient ones will.

[^5]: Techniques like just-in-time JavaScript compilation and hardware acceleration have started to bridge the gap, but support will vary across platforms and versions. Thomas Fuchs, author of [script.aculo.us](http://script.aculo.us/), blogs about [tuning an HTML5 application on an iPad running iOS 3](http://mir.aculo.us/2010/06/04/making-an-ipad-html5-app-making-it-really-fast/).

The article also mentions that even the best JavaScript UI libraries available today leave something to be desired in terms of touch responsiveness and consistency. Similar to how cross- platform desktop apps (e.g. Java, Adobe AIR) can feel clunky compared to their native counterparts, web apps don’t yet provide the slick, snappy user experience that mobile platform users have become accustomed to.

> “The Web technology stack hasn't achieved the level of performance we can attain with native code, but it's getting close.”

## Web applications with native “wrappers”
If you’re looking for a “write once, run anywhere” solution and aren’t concerned with the performance and user experience issues highlighted above, one option is to build an application using web technologies and wrap it with something like the aforementioned PhoneGap. PhoneGap is a free, open source framework that provides native API access and allows for submissions to mobile app stores. This is accomplished using native components that encapsulate browser rendering and JavaScript engines. When combined with a JavaScript UI library, PhoneGap can provide a cross-platform solution that may meet your needs quite nicely. The discoverability and integrated payment options that come with an app store presence can be invaluable[^6].

[^6]: A few mobile web app stores do exist, but they aren’t well-known or frequented.

This approach may fall short, however, when you end up needing to debug or tune your application at a low level. A slide in a [2010 deck](http://www.phonegap.com/HTMLPresentations/SeattleiPhone2010/presentation.html) on the PhoneGap website entitled “How do I debug it?” merely states that “Desktop Safari is very close to Mobile Safari (close but not exactly).”

> "Desktop Safari is very close to Mobile Safari (close but not exactly)."

## Cross-compilation and native UI “bridges”
Yet another option is to translate an application developed with a common technology into native applications that can run on numerous mobile platforms, using a third-party development kit. A couple of examples are [Titanium](http://appcelerator.com/products/titanium-mobile-application-development/), which allows you to use JavaScript instead of Objective-C or Java, and [Corona](http://anscamobile.com/corona/), which does the same using the Lua scripting language. Adobe AIR applications can also now be converted to run natively on iOS (they have on Android since late 2010). The selling point here is the same “write once, run anywhere” result that PhoneGap provides, but coupled with native performance and design.

While this is quite cool and potentially very useful, no one knows how long these frameworks will be actively developed, documented[^7], and supported, and it is risky to assume that the best interests of a third-party intermediary will always align with yours. When mobile device and platform vendors release hardware and OS updates, they are often accompanied by new APIs for developers to take advantage of. If you’ve chosen a framework like Titanium, you first have to wait for the Titanium developers to add wrappers around the new APIs before you can use them. Doing so in a timely fashion may not be a high priority for the framework vendor, depending on how much of their user base is clamoring for the feature and how widespread it is expected to be across other devices and platforms (i.e. part of the lowest common denominator).

[^7]: The documentation for some of these third-party kits supposedly isn’t great, either. I can only speak to the quality of the official iOS SDK documentation myself, but I can vouch that is excellent.

This isn’t solely an issue with new features, either. Neither PhoneGap nor Titanium offer a built-in way for applications to access the keychain, the encrypted storage option that has been present in iOS for quite some time. Instead, keychain support in both platforms is available only through additional plugins/modules - more dependencies that you, as a developer or project manager, need to worry about.

## Inverting the hybrid approach
Instead of developing a web application and wrapping it in a thin layer of native glue, there’s another hybrid approach that warrants consideration: writing a native application that also renders HTML content in specific views.

This HTML can be provided by a server-side content management system and reused in all of your native applications. Each application can apply its own CSS and use JavaScript for any interaction between the shared markup and platform-specific controller logic. *The majority of your user interface, particularly your navigation and any contextual menus, will still be comprised of native components to achieve the desired look, feel, and performance.*

## Conclusion
Clearly, there are disadvantages to developing applications that are targeted only at specific mobile platforms. Aside from the time required solely to create multiple versions, you may also need to learn new languages, libraries, IDEs, abide by the guidelines of the platform owners, and possibly even purchase a new computer[^8]. For applications that only require a subset of features that are common to most of the major mobile platforms and don’t have any significant performance restrictions, a cross-platform solution rooted in web standards could very well be the best choice. Already very high in quality today, these technologies will only continue to get better and faster over time.

[^8]: The iOS SDK requires an Intel Mac running Mac OS X Snow Leopard.

That being said, there is still currently value in developing with the technologies that are native to specific combinations of mobile devices and operating systems. As highlighted above, the advantages of this approach include but are not limited to:

* Access to all features of a device and platform
* A consistent look and feel
* Increased performance and battery life
* Powerful debugging and tuning capabilities
* Confidence that the libraries and tools will continue to be improved, documented, and supported going forward

Even Google, one of the largest proponents of web applications, open web standards and high- quality mobile web UIs, has embraced native applications both with their own Android platform and their seven official native applications currently available in the iOS App Store[^9].

## Additional resources
Craig Hockenberry, of The Iconfactory/Twitterrific fame, discusses this same topic in an A List Apart article entitled [“Apps vs. the Web”](http://www.alistapart.com/articles/apps-vs-the-web/).

Peter-Paul Koch also writes about [“Native iPhone apps vs. Web apps”](http://www.quirksmode.org/blog/archives/2009/11/native_iphone_a.html) and links to related posts from key industry figures on the QuirksMode blog.

[^9]: Google Search, Google Earth, Google Voice, Google Books, Google Places, Google Translate, and Google Latitude.
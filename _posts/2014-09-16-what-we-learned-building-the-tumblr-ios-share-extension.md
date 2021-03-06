---
layout: post
title: What we learned building the Tumblr iOS share extension
permalink: tumblr-ios-extension
date: 2014-09-16
---

<center><img src="/images/wwdc.png" alt="A banner at WWDC showing Tumblr’s share extension. Guess we had to build one…"></center>

iOS app extensions &ndash; launching this Wednesday, [as part of iOS 8](https://developer.apple.com/ios8/#capabilities) &ndash; provide an exciting opportunity for developers of all types of apps to integrate with their customers&rsquo; devices like never before. Here at [Tumblr](https://itunes.apple.com/us/app/tumblr/id305343404?mt=8), we&rsquo;re thrilled to pull the curtain off of our share extension, which we&rsquo;ve been working hard on for quite a while now.

The process of building the Tumblr share extension has been fun, but also really frustrating at times. We&rsquo;ve hit quite a few problems that we ended up needing to work around, and in the interest of helping you do the same, would like to detail all of the issues that we encountered.

Of course, your mileage may vary with some or all of these. We&rsquo;ve talked to other developers who haven&rsquo;t had the same problems, or have hit some that we haven&rsquo;t. **To make it easy to track updates to these problems and share workarounds, we&rsquo;ve created an issue in [this GitHub repo](https://github.com/tumblr/ios-extension-issues/) for each one.** Please create pull requests if you&rsquo;ve got solutions, or issues if you&rsquo;ve encountered something that we didn&rsquo;t.

## We couldn&rsquo;t get background file uploads to work

[Radar #18107172: Background NSURLSessionUploadTask cannot read file in app group shared container](http://openradar.appspot.com/radar?id=6188366450130944) ([sample project](https://github.com/tumblr/ios-extension-issues/tree/master/samples/BackgroundSessionErrors))

Apple&rsquo;s [App Extension Programming Guide](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/ExtensibilityPG/index.html) contains a section on [performing uploads and downloads](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/ExtensibilityPG/ExtensionScenarios.html#//apple_ref/doc/uid/TP40014214-CH21-SW2), complete with sample code indicating how background sessions are to be used to perform uploads that may last longer than your extension process is alive for. Normally, an [`NSURLSessionUploadTask`](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSURLSessionUploadTask_class/Reference/Reference.html) can be created from a stream, raw data, or a file URL, but only the latter is intended to be used in an extension. This makes sense: communication between extensions and container applications in the same &ldquo;app group&rdquo; occurs through a [shared container](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/ExtensibilityPG/ExtensionScenarios.html#//apple_ref/doc/uid/TP40014214-CH21-SW6), a special, secure location on disk that both extension and app are able to read and write from. The extension writes a file to the shared container and initiates a task to upload that file. The upload ostensibly occurs in a third process, allowing it to continue even once the extension has been terminated. The container application will then later be woken up and notified as to its success or failure.

We have not been able to get this to actually work.

In our experience, while our extension and container application can both access the shared container without issue, the `NSURLSessionTask` is seemingly unable to. Instead, it spits out errors that you can find in the [radar](http://openradar.appspot.com/radar?id=6188366450130944).

### Workaround

As soon as a user taps the &ldquo;Post&rdquo; button, we&rsquo;d ideally like to dismiss the extension and let them get on with their day, while continuing to upload in the background. Given that we haven&rsquo;t been able to get this to work, we&rsquo;ve given our extension a progress bar and are keeping it on screen until the request completes. It&rsquo;s possible that the user could background the host application, and iOS could kill it in order to reclaim the memory, but this seems like our best option given these limitations. We&rsquo;ll happily go back to using background sessions if the issue we&rsquo;re seeing ends up getting fixed.

## The container application must be opened before the share extension can be used

[Radar #18119318: Need a way to migrate data into a shared container without requiring the user to explicitly launching the containing app before using the extension](http://openradar.appspot.com/radar?id=6377617741578240)

As mentioned, the shared container is where everything that you need to access from both your app and extension must be located: user defaults, keychains, databases, files that you&rsquo;re serializing via `NSCoding`, etc.

For existing apps, the problem is simple; the data already exists somewhere outside of the shared container, and only the container app can migrate it over. Thus, if the user installs an update that adds an extension, and tries to use the extension _before_ launching the application and giving it a chance to perform the migration, they&rsquo;re going to have a bad time.

### Workaround

There&rsquo;s no great option here. If the user opens our extension first, we just throw up a dialog telling them that they need to launch the application first. Inelegant but necessary.

## We couldn&rsquo;t get `NSFileCoordinator` to work

[Radar #18341292: `NSFileCoordinator` does not work reliably across applications and share extensions](http://openradar.appspot.com/radar?id=4926212463919104)

`NSUserDefaults` and SQLite are useful for synchronizing data access across both extension and container application, but as per [WWDC Session 217](http://asciiwwdc.com/2014/sessions/217?q=NSFileCoordinator), [`NSFileCoordinator`](https://developer.apple.com/library/mac/documentation/Foundation/Reference/NSFileCoordinator_class/Reference/Reference.html) is also supposed to be an option for those of us using `NSCoding` for custom data persistence. We tried hard, but couldn&rsquo;t actually get it to reliably work.

Our use case required both our app and extension to write to the same file, where only the app would read from it. We observed a number of problems while both extension and app processes were running simultaneously. [`NSFilePresenter`](https://developer.apple.com/library/mac/documentation/Foundation/Reference/NSFilePresenter_protocol/Reference/Reference.html) methods intended to indicate that the file had been or will be modified ([`presentedItemDidChange`](https://developer.apple.com/library/mac/documentation/Foundation/Reference/NSFilePresenter_protocol/Reference/Reference.html#//apple_ref/occ/intfm/NSFilePresenter/presentedItemDidChange) or [`relinquishPresentedItemToWriter:`](https://developer.apple.com/library/mac/documentation/Foundation/Reference/NSFilePresenter_protocol/Reference/Reference.html#//apple_ref/occ/intfm/NSFilePresenter/relinquishPresentedItemToWriter:)) would either:

- Not be called at all
- Only be called when switching between applications
- Be called, but only after a method that would cause the app to overwrite the data that the extension had just written (either [`savePresentedItemChangesWithCompletionHandler:`](https://developer.apple.com/library/mac/documentation/Foundation/Reference/NSFilePresenter_protocol/Reference/Reference.html#//apple_ref/occ/intfm/NSFilePresenter/savePresentedItemChangesWithCompletionHandler:) or [`relinquishPresentedItemToReader:`](https://developer.apple.com/library/mac/documentation/Foundation/Reference/NSFilePresenter_protocol/Reference/Reference.html#//apple_ref/occ/intfm/NSFilePresenter/relinquishPresentedItemToReader:)) was called first

### Workaround

Rather than trying to keep access to a single file synchronized across processes, we modified our extension to instead atomically write individual files, which are never modified, into a directory that the application reads from.

This isn&rsquo;t to say that `NSFileCoordinator` isn&rsquo;t currently a viable option if you&rsquo;ve got a different usage than we do. The [New York Times app](https://itunes.apple.com/us/app/nytimes-breaking-national/id284862083?mt=8), for example, is successfully using `NSFileCoordinator` in a simpler setup, where the container app is write-only and the extension is read-only.

## Share extensions can&rsquo;t set the status bar color

[Radar #17916449: Share extension status bars don&rsquo;t respect `preferredStatusBarStyle`](http://openradar.appspot.com/radar?id=6397505050771456) ([sample project](https://github.com/tumblr/ios-extension-issues/tree/master/samples/StatusBarStyleIgnored))

The Tumblr share extension &ndash; like its container application &ndash; has a dark blue background color. White looks great on dark blue. Black, not so much.

We tried _everything_, but couldn&rsquo;t find a way for our share extension (which uses a custom view controller subclass, as opposed to [`SLComposeServiceViewController`](https://developer.apple.com/library/prerelease/ios/documentation/Social/Reference/SLComposeServiceViewController_Class/)) to specify its status bar style. Instead, we always get the status bar style of the host application. Since we&rsquo;re expecting Photos.app and Safari &ndash; both which have black status bars &ndash; to be two of the apps that Tumblr users share from the most, this is really disappointing.

### Workaround

None so far. Neither Info.plist keys nor view controller methods worked, and we couldn&rsquo;t even get a handle to the keyboard window the way that applications can usually accomplish using private API ([Sam Giddins](http://twitter.com/segiddins) nearly went insane trying. Thanks Sam!). Here&rsquo;s hoping for a way to do this in iOS 8.1.

## You can&rsquo;t exclude your own share extension from your application&rsquo;s activity controllers

[Radar #18065047: There&rsquo;s no way to exclude your own app&rsquo;s share extension from showing up within the app](http://openradar.appspot.com/radar?id=6456818549129216)

It makes sense that you can&rsquo;t specifically exclude a specific share extension from an activity view controller. We wouldn&rsquo;t want Instagram doing something like preventing sharing to Twitter, would we?

But the one extension that you _should_ be able to remove from your own app&rsquo;s activity view controllers is _your own extension_. It&rsquo;s silly to be able to share to Tumblr from within Tumblr. I mean, it works. It&rsquo;s OK, I guess. But it&rsquo;s weird.

### Workaround

None so far. We tried configuring our activity controllers with an activity item with a custom UTI, and then specifically giving our share extension a predicate that would cause it to _not_ show up when said UTI was present, but it had unintended side effects, which brings us to the next issue&hellip;

## By default, share extensions will _only_ show up if they explicitly support _all_ of the provided activity items

[Radar #18342403: NSExtensionActivationRules should only need to match a single activity item for a share extension to be displayed](http://openradar.appspot.com/radar?id=5616559737274368)
[Radar #18150467: Documentation for custom NSExtensionItemActivation rules is very vague](http://openradar.appspot.com/radar?id=5803657102622720)

This is a doozy. It&rsquo;s the most important issue we&rsquo;ve found, and one that probably deserves a blog post of its own.

Here&rsquo;s how applications pass data to share extensions:

- An application configures a `UIActivityViewController` with an array of &ldquo;activity items&rdquo;
- The activity controller displays the system activities and share extensions that can operate on the types of items provided

Here&rsquo;s how we think this should work, using the Tumblr app as an example:

- The user long-presses on a photo
- We put the image data, the posts&rsquo;s URL, and maybe a text summary of the post, all in the activity items array
- We&rsquo;d expect share extensions that support either image data _or_ URLs _or_ text to all show up in the activity controller

What _actually_ happens is that only share extensions that explicitly support images _and_ URLs _and_ text will show up.

This is a problem, because the simplest way to specify what your extension supports &ndash; and by far the best documented &ndash; is by adding `NSExtensionActivationRule` keys like:

    `NSExtensionActivationSupportsText` : `YES`

This looks like it would mean &ldquo;show my extension as long as _any_ of the activity items are text,&rdquo; but it really means &ldquo;show my extension as long as there is only one activity item, and it is text.&rdquo;

[Federico Viticci](http://twitter.com/viticci), who at this point has likely used more third-party share extensions than anyone else on the planet, verifies that this is in fact a legitimate problem:

<center><blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/irace">@irace</a> Yup. Been talking to devs to handle exceptions when possible, but I'm getting a lot of failures in several apps.</p>&mdash; Federico Viticci (@viticci) <a href="https://twitter.com/viticci/status/507992803872616448">September 5, 2014</a></blockquote>
<blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/irace">@irace</a> Yep. And, that the input passed by an app doesn't match what another app's extension expects and you get all sorts of weird stuff.</p>&mdash; Federico Viticci (@viticci) <a href="https://twitter.com/viticci/status/507996744865837056">September 5, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></center>

### Workaround

This negatively affects both app and extension developers. It means that:

- App developers should only configure their activity controllers with a single activity item. There are a couple of problems with this. First, [it&rsquo;s doable](https://gist.github.com/irace/535c9aa3314ee41fb902), but a pain if, like in Tumblr.app, you want system activities like copying and saving to the Camera Roll to support multiple different types of data. Secondly, it&rsquo;s a huge shame to only export one type of data and limit the number of sharing options that your users will be able to perform.

- Extension developers should use the more complex (and unfortunately, not very thoroughly documented) [predicate syntax](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/ExtensibilityPG/ExtensionScenarios.html#//apple_ref/doc/uid/TP40014214-CH21-SW8) to specifically specify an OR relationship. This would look something like:

<code>
SUBQUERY(extensionItems, $extensionItem, SUBQUERY($extensionItem.attachments, $attachment, ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.image").@count = 1 OR
SUBQUERY(extensionItems, $extensionItem, SUBQUERY($extensionItem.attachments, $attachment, ANY $attachment.registeredTypeIdentifiers UTI-CONFORMS-TO "public.text").@count &gt;= 1).@count &gt;= 1
</code>

## Misc.

[Radar #18207630: Table view content insets get adjusted wildly when rotating a share extension](http://openradar.appspot.com/radar?id=6662315554373632) ([sample project](https://github.com/tumblr/ios-extension-issues/tree/master/samples/IncorrectTableViewContentInsets)). Minor, especially relative to the rest of these issues, but we&rsquo;re already over 2,000 words here. What&rsquo;s a few more?

## Thanks!

A huge thanks to <a href="http://twitter.com/mb">Matt Bischoff</a>, <a href="http://twitter.com/paulrehkugler">Paul Rehkugler</a>, <a href="http://twitter.com/brianmichel">Brian Michel</a>, and <a href="http://twitter.com/segiddins">Sam Giddins</a> for not only helping find these issues and employ these workarounds, but for filing radars, creating sample projects, and helping edit this post as well.

And of course, to the frameworks and developer evangelist teams at Apple. With extensions, you&rsquo;ve given us a prime opportunity to delight our users even more. We&rsquo;ve got lots more ideas and can&rsquo;t wait to see what everyone else comes up with as well.

---

[Originally published](https://bryan.tumblr.com/post/97658826431/what-we-learned-building-the-tumblr-ios-share) on [Tumblr](https://bryan.tumblr.com)

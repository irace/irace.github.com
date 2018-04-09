---
layout: post
title: Suite and sour
permalink: gsuite
date: 2018-04-08
image: http://irace.me/images/gmail.jpg
---

<figure>
  <img src="/images/gmail.jpg">
</figure>

(After trying to shine on a light on some [inconsistencies of Apple’s doing](http://irace.me/siri), it seems only fair to give Google the same treatment.)

Like most of you (I presume), I’ve used Gmail for many years. In an industry where products can too often feel fleeting or unreliable, I can’t remember a time when I previously felt the need to question this decision.

My email addresses uses a custom domain (e.g. you@yourdomain.com). The only way to accomplish this while using Gmail is to create what Google calls a [G Suite](https://gsuite.google.com) account[^1]. Despite clearly being meant for businesses, Google’s marketing materials don’t really give a reason as to why you _shouldn’t_ use G Suite for personal email.

> **What is the difference between G Suite and Google’s free apps?**
> With G Suite, you'll receive a number of additional business-grade services not included with Google’s free consumer apps. These services include: custom business email @yourcompany, twice the amount of cloud storage across Gmail and Drive, 24/7 phone and email support, 99.9% guaranteed uptime on business email, interoperability with Microsoft Outlook, additional security options like two-step authentication and SSO, and administrative controls for user accounts.

Sounds great! And in practice, everything will mostly just work the way that you’d expect it to, until it doesn’t, and you hit one of G Suite’s many inexplicable limitations.

<figure>
  <img src="/images/youtubetv.png">
</figure>

In this particular case, I was trying out [YouTube TV](http://tv.youtube.com) and was surprised to learn that I couldn’t invite my wife unless I first switched to using a regular Gmail account. This wasn’t a huge inconvenience: I do have a regular account, I don’t particularly care which of the two is associated with YouTube TV, and I hadn’t thus far invested much time into setting YouTube TV up. But this could’ve very easily been quite painful. And what else _can’t_ G Suite accounts do?

One such answer _was_ have their email and calendar made accessible to [Google Home](https://www.reddit.com/r/googlehome/comments/7fasof/anybody_use_gsuite_with_google_home_devices/) – presumably, one of that device’s biggest selling points.

<center class="centered-tweet"><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Had a similar experience with Google Home, massively frustrating.</p>&mdash; Brian Donohue (@bthdonohue)<a href="https://twitter.com/bthdonohue/status/965319510470352897?ref_src=twsrc%5Etfw">February 18, 2018</a></blockquote></center><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This [was eventually fixed](https://support.google.com/googlehome/answer/7571892?co=GENIE.Platform%3DAndroid&hl=en), but this trend still strikes me as fairly troubling. Imagine spending years investing in Google’s ecosystem only to learn that your account is a second-class citizen because you decided quite some time ago that you wanted to use a custom domain for your email. In the case of Google Home, you could’ve potentially worked around email access specifically by setting up forwarding rules[^2], but other products (e.g. Google Calendar) lack such forwarding mechanisms[^3]. It’s great that this particular limitation seems to have only been temporary, but what will the next (seemingly arbitrary) limitation be, and will that one _ever_ be remedied? Being sufficiently dug-into G Suite, I can’t help but feel pretty stuck.

As two of Google’s newest products, you’d think that Google Home and YouTube TV would be encumbered by comparatively _few_ legacy restrictions. If G Suite accounts aren’t a priority today, it’s hard to feel confident that they’ll be adequately supported in the future.

Google should remove these restrictions from G Suite accounts, such that anyone already using a custom domain for personal email can do so without any roadblocks. Additionally, if Google really wants G Suite accounts to be for business purposes only, they should make it such that regular Gmail accounts can support custom domains, and improve their marketing copy to make all of this abundantly clear before anyone makes the wrong decision as to where their data should reside.

Thanks to [Brian Donohue](https://twitter.com/bthdonohue) for providing feedback on this post.

[^1]: Formerly known as a “Google Apps”
[^2]:

  Export all of your existing email, import it into a regular Gmail account, set up email forwarding from the G Suite account to the regular account, ad nauseam. Don’t get me wrong, this would be a massive headache, but it at least seems theoretically doable.

[^3]: To my knowledge. I haven’t researched this extensively.

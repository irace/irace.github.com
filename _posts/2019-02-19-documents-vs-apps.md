---
layout: post
title: Software without coding, documents vs. apps, or the impossible dream of the “personal CRM”
permalink: documents-vs-apps
date: 2019-02-19
image: http://irace.me/images/documents-vs-apps/legos.jpg
---

<figure>
  <img src="/images/documents-vs-apps/legos.jpg">
</figure>

A couple of years ago, I [asked for a recommendation](https://twitter.com/irace/status/798545010723590144?ref_src=twsrc%5Etfw) for a “personal CRM” – a client-relationship management tool intended for individual use. As it turns out, I [wasn’t](https://twitter.com/nakul/status/1002231482931470338) [the](https://twitter.com/delk/status/1025525171292057600) [only](https://twitter.com/ganeumann/status/1086457913856663552) [one](https://www.producthunt.com/ask/228-what-is-the-best-personal-crm) asking, and a solution still hasn’t emerged despite outsized interest from the very designers and developers who should be well-poised to create it. Why?

I’ve come to believe that this is because “personal CRM” means something a bit different to each person who asks for it. To [my friend Shane](https://twitter.com/ShaneMac/status/1095787850501685249), it’d be akin to a proactive virtual assistant, skewing towards the “magical” end of the spectrum. I myself have envisioned a few different products, all which I’ve lazily described using this umbrella term: one for letting me know when I haven’t seen a certain friend in a while, another for applying “tags” to former coworkers, etc. During my current job search, I’ve needed different tools at different times: one centered around colleague outreach to start, but another for tracking interview processes as the’ve continued to progress.

When faced with a moving target and only concerned with meeting one’s own individual needs, we don’t need an “app” or a “product” per se. A document can be structured in a way that meets today’s needs, with the flexibility to easily evolve as requirements change. My “personal CRM” is currently a spreadsheet – I could’ve built a version using Excel or Google Sheets, but I chose [Airtable](https://airtable.com) because it stores data in a more structured, database-like format. This lets me build more powerful, customized views on top of my data.

A database. With custom UI sitting on top of it.

This is “an app,” my friends.

## Documents vs. apps

From this perspective, Airtable isn’t necessarily a product in-and-of-itself, but a platform that empowers you to build your _own_ products – and it’s far from the only one. [Coda](https://coda.io), [Notion](https://www.notion.so), [Quip](https://quip.com), [Clay](https://clay.run), and [Actiondesk](https://www.actiondesk.io) are also similar in that they’re democratizing software development under the familiar guise of “collaborating on documents.[^1]” But their document-sheen is only skin-deep:

> A creative palette of app-like functionality that you can mix and match

> Build something as unique as your team

> We took the quintessential parts of apps and turned them into building blocks for your docs

> Our goal is to make it much easier to build software

> Forget the back and forth with your tech teams. Build powerful automations yourself

[Zapier](https://zapier.com/), [IFTTT](https://ifttt.com/), and Apple’s [Shortcuts](https://support.apple.com/guide/shortcuts/welcome/ios) focus more on integrations and less on data storage and UI, but they’re also key parts of this emerging space – not all software needs a visual user interface[^2]. Even Slack – an enterprise chat application on the face of it, has ingrained itself in no small part due to its integrations platform, allowing teams to build mini-products and workflows that suit their own specific needs.

These aren’t necessarily new ideas – Excel macros and [Google Sheets scripts](https://www.labnol.org/internet/website-uptime-monitor/21060/)[^3] are less holistic solutions that nonetheless strive to answer the same question: how can we lower the software development barrier to entry?

## Apps for small audiences

Part of what made my own CRM so easy to build was the assumption that I’m going to be the only one who ever uses it. Turning it into a consumer-facing product would be a much taller task, but there’s still a ton of value to be captured by software that’s only used by individuals or [teams internal to a company](https://twitter.com/NatSandman/status/1097853881265020928?ref_src=twsrc%5Etfw).

Shishir Mehrotra, the co-founder and CEO of Coda, highlighted this very point in a piece titled [What Will Software Look Like Once Anyone Can Create It?](https://hbr.org/2019/01/what-will-software-look-like-once-anyone-can-create-it):

> We’ll start designing apps for small audiences, not big. Companies will run on their own apps, hundreds of them, tailor-made for every team, project, and meeting. In this world, there’ll be no such thing as an edge case. All the previously underserved teams and individuals will get a perfect-fitting solution without needing to beg an engineer.

Internal applications also have lower user experience expectations than their consumer-facing counterparts, and are simpler for users to authenticate with. And by _providing_ value, they don’t require business models of their own to justify the upfront development cost.

That doesn’t mean that these hurdles can’t be overcome, however – we may be building some consumer applications without code sooner than we know it. A product like [Squarespace](http://squarespace.com) could shift ever-so-slightly towards app development, or Google’s [Firebase](https://firebase.google.com) could aim for broader consumer appeal. [Bubble](https://bubble.is) is one platform purporting to [already facilitate this sort of codeless development experience](https://techcrunch.com/2018/11/11/bubble-lets-you-create-web-applications-with-no-coding-experience/) today. At least in some cases, [it does seem to be working](https://twitter.com/andupotorac/status/1097786137748353025).

Another approach: instead of using one app-building “platform”, what if the makers of the future study the skills necessary to combine existing applications together themselves, instead of studying computer science fundamentals? [MakerPad](https://www.makerpad.co) is one such example of a program and community attempting to educate in this regard:

<center class="centered-tweet"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">✔️ Airbnb-clone marketplace w/ no-code<br><br>- Pages auto-generated from CMS<br>- Book via <a href="https://twitter.com/airtable?ref_src=twsrc%5Etfw">@airtable</a> <br>- <a href="https://twitter.com/zapier?ref_src=twsrc%5Etfw">@zapier</a> updates the row<br>- <a href="https://twitter.com/stripe?ref_src=twsrc%5Etfw">@stripe</a> invoice sent<br>- Once paid, the row is &#39;confirmed&#39; in calendar on site<br><br>Tutorial 🔜<a href="https://t.co/fUpbUZpqwR">https://t.co/fUpbUZpqwR</a> <a href="https://t.co/yHP3qxkjE2">pic.twitter.com/yHP3qxkjE2</a></p>&mdash; Ben Tossell (@bentossell) <a href="https://twitter.com/bentossell/status/1093921136419713026?ref_src=twsrc%5Etfw">February 8, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>

While such an approach may not suffice in perpetuity, it could mean the difference between bootstrapping yourself to profitability and prematurely taking venture capital in order to hire an engineering team.

## What happens to software developers?

As a software developer, should I find this concerning? I admittedly do not, and think that Steven Sinofsky succinctly articulates why by providing some key historical context:

<center class="centered-tweet"><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">One thing to consider is that no-code tools arise when there&#39;s an implied consensus that platforms are stable. One takeaway is that the web, iOS, android are not going to change a ton in the foreseeable future so tools can abstract across them.</p>&mdash; Steven Sinofsky (@stevesi) <a href="https://twitter.com/stevesi/status/1097564918939758592?ref_src=twsrc%5Etfw">February 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>

<center class="centered-tweet"><blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">This is all a point in time thing. The longer term challenge is that software built this way may/may not be more difficult to adapt when the platforms do change.<br><br>Platform makers put some effort into moving ‘native’ apps to new eras, but abstracted apps get stuck.</p>&mdash; Steven Sinofsky (@stevesi) <a href="https://twitter.com/stevesi/status/1097588258412802049?ref_src=twsrc%5Etfw">February 18, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>

The layers of abstraction that software developers work on top of [are continually changing](https://twitter.com/btaylor/status/1097592086998614016), but there will always be problems to solve despite moving higher and higher up the stack. Most of the platforms covered in this essay already integrate with the popular services of the moment, but developers will always have an advantage insofar as being able to build their _own_ integrations to augment whatever a platform vendor happens to provide out-of-the-box. Understanding databases makes it easier to create a complex Airtable sheet, just as being familiar with loops and conditionals makes you better equipped to craft [a complicated workflow](https://www.macstories.net/tag/shortcuts/) in the Shortcuts app. The line between what is and isn’t “programming” [really starts to blur](https://twitter.com/viticci/status/840322224708026369).

Similarly, there has always been a gradient between what can be done without code and when you’ll eventually hit a wall with that kind of approach. [Adobe Dreamweaver](https://en.wikipedia.org/wiki/Adobe_Dreamweaver) never quite obviated writing your own custom HTML, did it? I don’t personally foresee this ceasing to be the case.

But traditional software development being long for this world isn’t an excuse not to keep up with the changing times. Adobe’s [new XD/Airtable integration](https://support.airtable.com/hc/en-us/articles/360009887334-Airtable-for-Adobe-XD) might be marketed as a prototyping tool today, but how long will it be until those prototypes are good enough for a single designer to ship as production software?

[If you don’t like change, you're going to like irrelevance even less](https://en.wikiquote.org/wiki/Eric_Shinseki).

[^1]: Coda goes so far as to intelligently translating traditional desktop documents into common mobile app paradigms. A section in a document becomes a tab in an app’s navigation, and a select box with multiple states can be edited using a native swipe-gesture.
[^2]: Especially as voice control and home automation continue to increase in prominence.
[^3]: Not to mention, entire [Google Sheets apps](https://www.labnol.org/internet/website-uptime-monitor/21060/).

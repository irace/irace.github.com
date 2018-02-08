---
layout: post
title: Many Siris
permalink: siri
date: 2018-02-07
---

<figure>
  <img src="/images/siri.png">
</figure>

Most of the criticism that I read about Siri – especially when comparing and contrasting to Alexa or the Google Assistant – seems to focus primarily on speed and/or reliability. While these are perfectly valid vectors of criticism, it’s easy to foresee how Apple could improve on both of these fronts. <mark>A more worrisome flaw, to me, is that there is not one Siri after all. There are many.</mark>

When talking to Siri on my iPhone, she has a certain set of capabilities. These differ if I talk to Siri on my Mac. When talking to Siri through my AirPods, she’ll assume whatever functionality she’d otherwise have on the device that they’re currently paired with. Siri on my Apple Watch can take certain actions when untethered, but different ones when my iPhone happens to be in range. Siri on my Apple TV has a different set of skills altogether, and now, the HomePod will add [yet another Siri](https://twitter.com/stevekovach/status/957978035474649091) to the family.

Apple introduced [SiriKit](https://developer.apple.com/sirikit/) – the long-awaited SDK that finally gave developers the ability to have their own third-party apps invoked via Siri – at WWDC 2016. While many were disappointed by the limited number of application domains[^1] supported at launch, my own disappointment stemmed from learning that SiriKit “extensions” would run _client-side_ – needing to be bundled alongside a traditional iOS application – instead of as separate _server-side_ software.

If the [Lyft app](https://itunes.apple.com/us/app/lyft/id529379082?mt=8) is installed on your iPhone, you can ask Phone Siri to order you a car. But you can’t ask Mac Siri to do the same, because she doesn’t know what Lyft is. Compare and contrast this with the SDKs for Alexa and the Google Assistant – they each run third-party software _server-side_, such that installing the [Lyft Alexa “skill”](https://www.amazon.com/Lyft/dp/B01FV34BGE) once gives Alexa the ability to summon a ride regardless of if you’re talking to her on an Echo in your bedroom, a different Echo in your living room, or via the Alexa app on your phone. Similarly, you can ask the Google Assistant on one device to start playing a YouTube video through another (e.g. a Chromecast). iPhone Siri doesn’t have this kind of relationship with the Apple TV, regrettably; you’d have to ask Apple TV Siri herself.

The decision to bundle SiriKit extensions as client-side components of standard iOS applications wasn’t a surprising decision – effectively all of Apple’s third-party SDKs are client-side as opposed to server-side. But I can’t help feel that perpetuating this approach with Siri is needlessly making Apple’s voice assistant uphill battle even steeper.

It’s no easy task for a voice assistant to win over new users in 2018, despite having improved quite a great deal in recent years. These assistants can be delightful and freeing when they work well, but when they don’t, they have a tendency to make users feel embarrassed and frustrated in a way that GUI software rarely does. If one of your first voice experiences doesn’t go the way you expected it to – especially in front of other people – who could blame you for reverting back to more comfortable methods of interaction[^2]? Already facing this fundamental challenge, Apple is not doing themselves any favors by layering on the additional cognitive overhead of [a heavily fragmented Siri experience]([https://twitter.com/flufffel/status/960935055412604933]).

<mark>Apple should allow SiriKit extensions to be developed separately from iOS or OS X applications, and they should run on Apple’s servers in such a way that <em>any</em> instance of Siri running on <em>any</em> can device invoke them uniformly.</mark> Despite a squandered first-to-market opportunity, it’s certainly not too late for Siri to fend off the competition and endear herself to a large-enough percentage of Apple’s user base. The power of defaults is strong[^3]. Removing the doubt and uncertainty caused by the many different Siris is an obvious step forward, and one that I hope Apple takes sooner rather than later.

[^1]:	Audio/video calling, messaging, payments, photo library search, and ride hailing. More have since been added.

[^2]: And perhaps not giving the assistant another try in the future, when it ostensibly may have improved.

[^3]:	See: Apple Maps, Apple Music

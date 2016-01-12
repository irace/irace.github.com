---
layout: post
title: Designing for change
permalink: debt
date: 2016-01-11
---

The [Wikipedia entry for technical debt](https://en.wikipedia.org/wiki/Technical_debt) starts by defining it as:

> Work that needs to be done before a particular job can be considered complete or proper. If the debt is not repaid, then it will keep on accumulating interest, making it hard to implement changes later on.

And goes on to state that:

> Analogous to monetary debt, technical debt is not necessarily a bad thing, and sometimes technical debt is required to move projects forward.

This is a great way to put it; debt isn’t inherently bad if it yields important short-term benefits that wouldn’t have otherwise been achievable. Ensuring those benefits are reaped by choosing the *right* kinds of debt is crucial, however.

Over the past two months, I’ve been working on a brand new company. At this juncture, it’s easy to think that one shouldn’t be concerned about accumulating technical debt for quite some time. That for a while, raw speed is more important than doing everything “correctly.” That to be burdened by technical debt would be a good problem to have, implying that you’ve found a meaningful foothold after launching. That if your 1.0 is *too* technically sound, you weren’t moving fast enough.

I do think there’s some truth to this, but of course it isn’t so black and white. You absolutely shouldn’t concern yourself with *certain* kinds of technical debt while racing towards your initial launch, with so many questions still swirling around value proposition and product/market fit. Maybe you have a class whose implementation consists solely of one giant method. It works, seemingly, but its logic is hard to understand and even harder to modify. Test coverage isn’t great and you’re sure there’re edge cases that don’t work as expected, that’d be apparent if you just spent some time breaking it down into a number of smaller methods.

This is the kind of technical debt that I have no problem introducing into my codebase at this early stage. <mark>Technical debt might be worth introducing early only if it’s going to make you faster in the short-term.</mark> But specific types of debt do exactly the opposite.

One common form of technical debt is building components that are more tightly coupled together than they should be. Perhaps your view controllers each know about the *next* view controller that is to be displayed[^1]. Maybe various parts of the codebase are all intimately aware that Core Data is being used for your persistence layer. This makes it prohibitively difficult to make rapid changes, specifically at the time when codebases tend to undergo the most: during their infancy.

Maybe we’re just using `NSUserDefaults` for now, since it’s so easy. Now we’ve graduated to a simple `NSCoding`-based cache. Soon we’re ready for a full on database like [YapDB](https://github.com/yapstudios/YapDatabase) or [Realm](https://realm.io) or Core Data. Let’s say that your onboarding flow is comprised of six different screens. Now it’s comprised of five. Now those same five in a different order. This type of churn is to be expected in a young codebase. Today you’re using [Alamofire](https://github.com/Alamofire/Alamofire) but tomorrow you might not be.

These are logical progressions for a new application to go through, and developing “correctly” by keeping these boundaries loosely coupled will facilitate making changes when it’s most important to do so. Established codebases don’t switch persistence mechanisms three times over the course of two months, but a new one very well might. As such, a decision that’d make a change like this overly difficult is exactly the type of debt that I won’t tolerate no matter how fast I‘m supposed to be moving.

 It can be hard to convince yourself, but while <mark>properly architecting may seem like it’s going to be more time consuming, but in practice, it won’t, as long as you’re investing in the right approach.</mark> For a new codebase, I can’t think of a tradeoff more important than keeping your components decoupled rather than worrying too much about their implementations. Design for change when your code is going to be at its most volatile.

[^1]: If afflicted by this particular problem, meet [coordinators](http://khanlou.com/2015/10/coordinators-redux/).

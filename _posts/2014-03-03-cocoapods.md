---
layout: post
title: CocoaPods, or how I learned to stop worrying and love Objective-C dependency management
permalink: cocoapods
date: 2014-03-03
---

"[Not invented here](http://en.wikipedia.org/wiki/Not_invented_here) syndrome" is a well known software development mentality, where programmers favor building from scratch over using code made available by a third-party. Sometimes this pays off, as you're able ensure that what you're working on is of the upmost quality and continues to evolve in a way that doesn't diverge from your needs. This mindset also has its drawbacks. In some cases, your need is complex and an attempt to build it yourself might not produce as good of a result as a battle-tested, third-party component already being run in production by some of the most popular apps on the App Store. In other cases, it may simply not be worth it to "reinvent the wheel," or spend time solving a solved problem.

Most seasoned developers will agree that while building everything yourself isn't the best use of one's time, relying too heavily on third-party code isn't wise either. A line in the sand must be drawn, where development is optimized by pulling in dependencies where appropriate to spend the majority of your time working on what makes your application unique.

Once you've decided that you'd like to include third-party code, you're now faced with two separate challenges: finding this code, and integrating it with your project. The rise of [GitHub](https://github.com), founded in 2008, brought open-source to the mainstream in a way that it arguably never had been before. While GitHub made it far easier to find high-quality dependencies, actually adding one to your iOS or OS X app still required a manual, error-prone set of steps. A dependency manager could help alleviate exactly this.

Most languages/platforms have at least one popular dependency manager: Java has [Ivy](http://ant.apache.org/ivy/) and [Maven](http://maven.apache.org), Node.js has [NPM](https://www.npmjs.org), and Ruby has [RubyGems](http://rubygems.org) and [Bundler](http://bundler.io). Objective-C hasn't historically had a successful dependency manager of its own, but a tool called [CocoaPods](http://cocoapods.org) has made huge strides in recent years towards filling this void.

Of course, "dependency" doesn't specifically imply something built by a third-party. CocoaPods is just as beneficial if you want to reuse your *own* code across all of the different applications that you're working on.

Generally speaking, a dependency manager is responsible for:

* Downloading the versions of the libraries that your project depends on. This includes fetching the dependencies of your dependencies, and so on and so forth
* Resolving conflicts that arise if the dependency tree includes multiple different versions of the same library
* Integrating the dependencies with your project

This third point above is the primary reason why an Objective-C dependency manager has not existed up until now. 

The process of turning Objective-C code into runnable iOS and OS X applications involves some complication. Developers leverage a number of frameworks provided by Apple while building their applications, such as [UIKit](https://developer.apple.com/library/ios/documentation/uikit/reference/uikit_framework/_index.html) for iOS user interface elements and Core Location for accessing the user's whereabouts. For an Objective-C application to be successfully built, it must be *linked* against any frameworks that its code references. This means that if an application includes dependencies, and the dependencies need to be linked against certain frameworks, the application would need to know that and be configured as such.

Similarly, different pieces of code may need to be [compiled](http://en.wikipedia.org/wiki/Compiler) with different options. iOS devices contain a limited amount of memory and apps need to relinquish memory that is no longer in use, less they run the risk of being terminated by the operating system. Prior to iOS 5, developers needed to manually manage this memory, a time-consuming and error-prone process. iOS 5 introduced [Automated Reference Counting](http://clang.llvm.org/docs/AutomaticReferenceCounting.html) (ARC), a compiler enhancement that allowed developers to no longer worry about the majority of cases in which memory would have previously had to have been manually managed. If a new application it built using ARC, yet includes a dependency that was *not* written for ARC, the application would need to be configured to compile the dependency differently than the rest of the code.

Xcode is the program that Apple provides to developers to create their own iOS and OS X applications with. All of the information about how a specific application is built, from which frameworks need to be linked against to which compiler options need to be used for which files, is stored inside an Xcode *project file*. Any worthwhile Objective-C dependency manager would need to know how to modify an Xcode project file in order to properly configure an application to be built along with all of its dependencies. 

Here lies the majority of the complexity, and the reason why its taken so long for an Objective-C dependency manager to come into existence: Xcode project files are *undocumented*. To build a tool that exists alongside Xcode, one would need to reverse engineer how the project file itself is generated. CocoaPods has emerged as the de facto Objective-C dependency manager by doing exactly this. 

Written in the Ruby programming language, CocoaPods knows how to read and write Xcode's esoteric project file format to finally deliver the functionality that other development ecosystems have long benefited from. The project was started by [Eloy Durán](https://github.com/alloy), a Dutch programmer who was working at a app consultancy at the time. Durán understood how much time that a dependency manager would allow him to save for his clients, and admits that he had hoped someone else would build one for Objective-C before not being able to wait anymore and starting it himself. The first public release of CocoaPods occurred in 2011 yet already includes over 3,000 open-source libraries, known as "pods." Durán is joined by 10 other [core team](http://cocoapods.org/about) members while over 140 people have contributed to the project in total.

Durán says that "besides being a dependency manager, CocoaPods really tries to create an ecosystem for open-source libs to flourish." One such way that CocoaPods accomplishes this is via [CocoaDocs](http://cocoadocs.org). As pods are created and updated, documentation for them is automatically generated and published, providing a useful reference for developers.

CocoaPods is still technically beta software, and the core team is rightfully conscious about keeping the project focused as they work towards a 1.0 release. One important feature that remains in the works is better access control, to ensure that pods are only updated by their rightful owners. In November, CocoaPods added support for plugins, allowing other developers to extend the project's functionality as they see fit without resulting in a monolith. 

One such example is [`pod-try`](http://blog.cocoapods.org/CocoaPods-0.29/), a plugin bundled with CocoaPods by default. `pod-try` allows a user to open a pod's demo project with a single command, providing a quick way to both vet a library's quality as well as learn how to use it. Durán admits that he doesn't use a lot of third-party libraries himself, which sounds counterintuitive but actually makes a lot of sense. CocoaPods makes it easy to try out different dependencies without overhead, to figure out which, if any, is the right fit for your project.

Between helping to create a thriving open-source Objective-C ecosystem, and providing tools that help ensure quality rather than sprawling dependency graphs, the goals behind CocoaPods are noble ones. Any developer should be able to benefit from and get behind them, regardless of where you fall on the "not invented here" spectrum.

---

[Originally published](http://glidedata.com/the-loop-magazine/issue-20/cocoapods-or-how-i-learned-to-stop-worrying-and-love-objective-c/) in [The Loop magazine](http://www.loopinsight.com/magazine/), Issue 20.

---
layout: post
title: Glue factories
permalink: factories
date: 2015-05-20
---

Before getting into iOS development, I used to build server-side web applications. In doing so, we’d write code that would read many different values from configuration files. In Objective-C or Swift, you’d simply create constants for these things. But we used configuration files on the server for one very powerful reason: in order to tweak a value, you could simply patch the text file and bounce your application server, without recompiling any code.

Of course, code that reads from disk isn’t particularly testable. Rather than mock out the file system access, we’d create [factory](http://en.wikipedia.org/wiki/Factory_(object-oriented_programming)) classes that would simply read our config file and inject the values into our class’s constructor. In pseudocode, it’d look something like this:

{% highlight swift %}
final class ObjectFactory {
    private let properties: Properties

    init() {
        properties = Properties(path: "/path/to/file")
    }

    func object() -> Object {
        return Object(value1: properties.value1, value2: properties.value2, value3: properties.value3)
    }
}
{% endhighlight %}

The `ObjectFactory` class might look somewhat pointless, but it serves an important role: <mark>it keeps our Object class extremely testable.</mark> The factory class itself is merely configuration – glue code, if you will. There’s nothing there to test, but it allows `Object` to take all of its inputs in its constructor which makes _it_ trivial to test.

In iOS development, we don’t have this same deployment concern (sadly, changing a value in a running production application isn’t as easy as swapping one config file out for another). But that doesn’t mean there aren’t cases in which the factory pattern can help yield similar benefits when it comes to keeping your classes decoupled and flexible.

Perhaps you’re starting a new application from scratch today. You can architect your codebase in such a way that your [dependencies are *always* passed in](http://irace.me/di) and it’s easy to keep your different classes isolated and testable. This is idealism worth striving for but unfortunately not the environments that many of the apps that we know and love are developed in.

When working on a legacy iOS codebase, you likely have a number of intertwined, coupled dependencies that aren’t particularly testable. Maybe you have a single Core Data controller, or a shared API client instance. Similarly, maybe your user defaults and keychain are stored in an app group that doesn’t particularly lend itself to easily unit testing. Your class might look something like this:

{% highlight swift %}
final class AuthenticationController {
    func login(credentials: Credentials) {
        APIClient.sharedInstance().authenticate(credentials) { result in
            if result.isSuccessful {
                CoreDataController.sharedInstance().createUser(credentials.userName)

                Keychain(path: "/path/to/app/group").saveTokens(result.tokens)
            }
        }
    }
}
{% endhighlight %}

Shared instances aren’t bad in and of themselves – there could be a perfectly valid reason for only having a single `APIClient` instance in a given application. What *is* bad is [when classes throughout your application *know* that they’re accessing a single instance](http://blog.segiddins.me/2014/10/05/why-i-never-write-singletons/), as the result of using some global accessor to grab this reference.

It’d be pretty hard to write a test for this controller. Ideally, you’d pass API client, Core Data controller, and keychain instances into something that looks more like:

{% highlight swift %}
final class AuthenticationController {
    private let coreDataController: CoreDataController
    private let APIClient: APIClient
    private let keychain: Keychain

    init(coreDataController: CoreDataController, APIClient: APIClient, keychain: Keychain) {
        self.coreDataController = coreDataController
        self.APIClient = APIClient
        self.keychain = keychain
    }

    func login(credentials: Credentials) {
        APIClient.authenticate(credentials) { result in
            if result.isSuccessful {
                coreDataController.createUser(credentials.userName)

                keychain.saveTokens(result.tokens)
            }
        }
    }
}
{% endhighlight %}

And now, testing becomes a lot easier:

{% highlight swift %}
final class AuthenticationControllerTest: XCTest {
    private let coreDataController = InMemoryCoreDataController()

    private let tokens = Tokens(token: "a4ka3", secret: "pk601n")
    private let APIClient = TestAPIClient(tokens: tokens)

    private let keychain = Keychain(path: "/tmp/location")

    private let authController = AuthenticationController(coreDataController: coreDataController, APIClient: APIClient, keychain: keychain)

    private let userName = "bryan"
    private let credentials = Credentials(userName: userName))

    func testSuccessfulLoginCreatesUser() {
        authController.login(credentials: credentials)

        XCTAssertEqual(coreDataController.user.name, userName)
    }

    func testSuccessfulLoginPopulatesKeychainWithTokens() {
        authController.login(credentials: credentials)

        XCTAssertEqual(keychain.tokens, tokens)
    }
}
{% endhighlight %}

Rather than a separate factory class, could we simply give our object a new class method or convenience initializer that returns a configured instance? Or configure our object’s constructor with shared instances using Swift default parameters? These approaches would help with testability but not portability. By breaking out a separate class, the authentication controller itself can now be moved into a framework, while the factory class stays specific to our application.[^1] The framework remains generic and oblivious to the existence of our application’s global accesors.

Let’s assume that – despite how nice it’d be – that it isn’t practical at this point in time for us to rewrite our application to make it particularly easy to get rid of all of these `sharedInstance` accessors. <mark>Introducing a factory is an easy way to avoid reworking our application to go all-in on dependency injection, but still keep our class’s logic isolated and testable.</mark>

{% highlight swift %}
final class AuthenticationControllerFactory {
    class func authenticationController() -> AuthenticationController {
        return AuthenticationController(
            coreDataController: CoreDataController.sharedInstance(),
            APIClient: APIClient.sharedInstance(),
            keychain: Keychain("/path/to/app/group")
        )
    }
}
{% endhighlight %}

Glue code. A throwaway class. When we get some time to pay off some of our technical debt, we can probably get rid of it. But in the interim, we’ve isolated our global access to a single place that we can blissfully ignore to when it comes time to write tests for or reuse our `AuthenticationController`.

[^1]: A class method or convience initializer in a Swift extension or Objective-C category would also work, if you find that approach to be a bit more familiar. Though factory methods are prevalent throughout the iOS SDK, factory *classes* aren’t. I still prefer them personally due to how obvious their single purpose ends up being.

---
layout: post
title: "Inversion of view controllers: dependency injection on iOS"
permalink: di
date: 2015-05-20
---

“Dependency injection” is a phrase that has been tossed around a lot over the past few years, as the culture of unit testing (and as such, writing testable code) has grown within the iOS developer community. On more than one occasion, I’ve seen the concept of dependency injection reduced to something along the lines of “just passing instances into an initializer,” and confusion as to why such a practice would even be given a special name.

I’d like to discuss exactly what dependency injection is, and specifically what it means in the context of iOS development.

Passing an object’s dependencies into its initializer[^1], and as such remaining ignorant of where they came from, has obvious benefits. Those of us who try to write tests for our classes – or reuse classes across targets or applications, for that matter – know the perils of referencing global accessors in order to get access to a shared instance. There’s no innate problem with “singletons”; there are valid reasons for only a single instance of some class to ever be allocated within an application, but [the classes that rely on this instance needn’t actually concern themselves with this fact](http://blog.segiddins.me/2014/10/05/why-i-never-write-singletons/). To do so would be to tightly couple, a shortcut that future developers will almost certainly pay a price for. Along the same lines, when an object _creates_ an instance of something that it needs, it’s often preferable have that instance instead be passed into the object’s constructor. This allows for a mock or stub to be passed in in its place, during testing. <mark>By architecting your code like this, objects start to represent pure functions in the sense that they only operate on their inputs.</mark>

Let’s assume that we all agree that our classes should ideally take their dependencies as constructor arguments rather than reference singletons via global accessors, or create new instances themselves[^2]. By putting ourselves in this mindset, we could very reasonably end up with a situation like the following:

The iOS application that we’re working on has a tab bar controller as it’s window’s root view controller. The tab bar controller contains an account view controller as one of its children (among others, which we’ll gloss over for now). The account controller displays a button that allows the user to navigate to a settings view controller. The settings controller displays a bunch of data from a property list located in our application bundle. In order to practice proper dependency injection, our application does the following in order:

<ol>
  <li>Loads data out of the property list</li>
  <li>Creates the settings controller by passing the .plist data into its initializer</li>
  <li>Creates the account controller by passing the settings controller into its initializer</li>
  <li>Creates the tab bar controller by passing the account controller into its initializer</li>
</ol>

You get the picture. If this sounds backwards to you – creating all of your object graph’s leaves first in order to facilitate creating the root – you’re not alone. In fact, this practice is often even referred to as “inversion of control.”

Clearly, this could get unwieldy. The client-side apps that we work on are long-running and stateful; extrapolating the above example to it’s logical conclusion, **you’d basically create *everything* that your application might ever need upfront, regardless of whether the user actually navigates to those screens during any given session**. 

For a moment, let’s step away from iOS and consider how this might differ if we were working on a server-side application. Rather than our entry point being an application delegate that knows very little about what the user may do during the duration of the application’s run, HTTP server processes are generally spun up to handle only individual, stateless requests. If a user makes a POST request to delete a row from the database, the entry point knows exactly which objects will be needed in order to do so, and can easily create those and only those in order to facilitate the operation. Which order they’re created in and how they’re pieced together doesn’t seem like a big deal when there are way fewer pieces.

Back on iOS, this sounds like a nightmare in terms of the tedium involved in manually instantiating and wiring this massive object graph together. What we really want is _some other object_ that knows how to create whatever instances the application needs, as well as all of their dependencies (and their dependencies, recursively). This object is called a dependency injection **container**.

(Perhaps now you understand why we give all of this a name.)

A container is configured with our object graph and instructed as to how it should go about creating each node. It knows which instances are singletons so that the rest of your classes don’t have to. Containers can even take shortcuts by looking at types. If you have a number of classes that all get instantiated with an instance of class X and the container is only configured with a single X instance, it can infer that this is the instance to be passed in. Less manual dependency specifying for you!

Once your container is configured, the root object of your graph is simply pulled out when your application launches, and voila. <mark>You no longer manually instantiate objects and pass them to other objects.</mark> The container takes care of all of this for you. It’ll feel really weird at first but you’ll get the hang of it.

Examples of popular dependency injection libraries on iOS include [Objection](http://objection-framework.org) and [Typhoon](http://typhoonframework.org). Configuring Typhoon looks something like the following:

{% highlight objectivec %}
- (SettingsController *)appSettingsController {
    return [TyphoonDefinition withClass:[AppSettingsController class] configuration:^(TyphoonDefinition *definition) {
        [definition useInitializer:@selector(initWithSoundManager:settingsView:) 
                        parameters:^(TyphoonMethod *initializer) {
                            [initializer injectParameterWith:[_kernel soundManager]];
                            [initializer injectParameterWith:[self appSettingsView]];
                        }];

        [definition injectProperty:@selector(title) with:@"Settings"];
    }];
}
{% endhighlight %}

If you think the process of configuring these containers looks procedural, you’re not wrong; <mark>there’s no reason that this needs to be done in “code” at all</mark>. In languages that support metaprogramming, dependencies can be specified by adding metadata to constructors or setter methods. Java’s [annotations](http://en.wikipedia.org/wiki/Java_annotation) are pretty perfect for this, as shown by this example from [Google Guice](https://github.com/google/guice):

{% highlight java %}
class RealBillingService implements BillingService {

  @Inject
  public RealBillingService(@PayPal CreditCardProcessor processor, TransactionLog transactionLog) {
    ...
  }
}
{% endhighlight %}

Objection actually [uses preprocessor macros to accomplish something similar](https://github.com/atomicobject/objection#example) for Objective-C:

{% highlight objectivec %}
@implementation Car

objection_requires(@"engine", @"brakes")
@synthesize engine, brakes;

@end
{% endhighlight %}

Many dependency injection frameworks (notably, [Spring](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/beans.html)) even support wiring up dependencies using a markup language. This can end up looking something like the following:

{% highlight xml %}
<object id="apiClient" class="APIClient">
    <constructor-arg name="maxConcurrentOperations" value="6">
</object>

<object id="coreDataController" class="CoreDataController">
    <constructor-arg ref="/path/to/sqlite/file">
    <constructor-arg ref="/path/to/managed/object/model">
</object>

<object id="keychain" class="Keychain">
    <constructor-arg ref="/path/to/keychain">
</object>

<object id="authenticationController" class="AuthenticationController">
    <constructor-arg ref="coreDataController">
    <constructor-arg ref="apiClient">
    <constructor-arg ref="keychain">
</object>
{% endhighlight %}

You may have a knee-jerk aversion to the above, having dealt with some crummy XML API in the past, but try considering this approach without preconceived notions. <mark>Markup languages are actually really good for defining relationships between nodes in a tree structure</mark>. Separating the object graph definition from your actual class implementations ends up providing for a really nice separation of concerns. It’s a joy to implement a class’s logic without worrying about where it’s dependencies are actually coming from.

Yes, it’s a bit of a pipe dream, but imagine initializing your application with little more than:

{% highlight objectivec %}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  DependencyContainer *container = [[DependencyContainer alloc] initWithPath:@"/path/to/xml"];
  self.window = container["window"];
  [self.window makeKeyAndVisible];
}
{% endhighlight %}

That’s it. You pull a window out of your container, which has already configured it with a root view controller. The root view controller is already configured with its child view controllers, each of which is already configured with the various objects that they each need, each of which is configured with the objects that _they_ need, and so on and so forth. <mark>You don’t initialize any of these manually.</mark>

In closing, I’m not suggesting that you rewrite your application to use Typhoon or Objection, or start rolling a dependency injection container yourself. Rather, I’d encourage you to take inspiration from these concepts when trying to strike a balance between the reusability or your classes and the overhead involved in implementing them to be that way. Selectively applying dependency injection to your application, use something like [a factory](http://irace.me/factories), is a totally reasonable alternative to going “all in” and flipping your whole application inside out. With this approach, each factory serves as a mini DI-container: glue code that knows how to create instances of your classes using whatever they each need.

[^1]: Constructors aren’t the only way to inject dependencies. Setters work just fine, but when possible, let’s pass dependencies during construction in the interest of keeping our classes immutable.

[^2]: There are exceptions to this, e.g. for trivial objects that you’d never reasonably want to pass in a replacement for.

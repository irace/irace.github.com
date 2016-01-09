---
layout: post
title: Navigation coordinators
permalink: navigation-coordinators
date: 2016-01-09
---

Coordinators are an iOS design pattern that I’ve become a big fan of over the past few months. You should read Soroush’s [post](http://khanlou.com/2015/10/coordinators-redux/) introducing them (and watch his [conference talk](https://vimeo.com/144116310) as well), but in short, coordinators allow you to keep your view controllers isolated and reusable by preventing any one controller from knowing about any other. Each controller has its own delegate protocol, and a separate **coordinator** object acts as all of their delegates, performing all of the requisite routing. This makes it trivial to change the order in which view controllers are displayed, add support for new device classes, and so on and so forth.

One problem that I’ve been trying to work around is how coordinators are to be effectively used when a navigation controller is involved. Here’s an example in which we encapsulate an application’s signup flow inside of an “account creation coordinator.” You can envision a user tapping a **Sign up** button and being presented with a modal flow for creating an account. At the call site, that code would look like:

{% highlight swift %}
func signUpButtonTapped() {
  let accountCreationCoordinator = AccountCreationCoordinator(rootViewController: currentViewController, delegate: self)
  accountCreationCoordinator.start()

  /*
   We should assume that every coordinator may eventually maintain an array of
   child coordinators, which allows us to nest them and ensure that everything
   stays retained as long as it needs to be.
   */
  childCoordinators.append(accountCreationCoordinator)
}
{% endhighlight %}

The coordinator implementation would start out something like this:

{% highlight swift %}
final class AccountCreationCoordinator {
  // MARK: - Inputs

  private let rootViewController: UIViewController
  private weak var delegate: AccountCreationCoordinatorDelegate?

  // MARK: - Mutable state

  private let storage = Storage()

  private lazy var navigationController: UINavigationController = UINavigationController(
    UserNameAndPasswordViewController(delegate: self))

  // MARK: - Initialization

  init(rootViewController: UIViewController, delegate: AccountCreationCoordinatorDelegate) {
    self.rootViewController = rootViewController
  }

  // MARK: - Coordinator

  func start() {
    rootViewController.presentViewController(navigationController, animated: false)
  }
}

// MARK: - UserNameAndPasswordViewControllerDelegate

extension AccountCreationCoordinator: UserNameAndPasswordViewControllerDelegate {
  func userNameAndPasswordViewController(viewController: UserNameAndPasswordViewController,
      didSubmitCredentials credentials: Credentials) {
    storage.credentials = credentials

    // Next: Push a view controller for selecting an avatar
  }
}
{% endhighlight %}

It’d be easy enough to simply push an `AvatarSelectionViewController` onto the navigation controller, but let’s think about this a bit more. Avatar selection likely requires integrating with a `UIImagePickerController`, and perhaps even third-party APIs like Facebook or Twitter. To include this integration code inside of the `AvatarSelectionViewController` would be to go against the spirit of coordinators. We *could* put all of that code right here, inside of the `AccountCreationCoordinator`, but then that code wouldn’t be as reusable. Once they’ve registered, we probably want to allow our user to modify the avatar from somewhere inside of the application as well, so the best course of action here is to package all of this code up into an `AvatarSelectionCoordinator`, and have that coordinator be a child of our `AccountCreationCoordinator`.

{% highlight swift %}
extension AccountCreationCoordinator: UserNameAndPasswordViewControllerDelegate {
  func userNameAndPasswordViewController(viewController: UserNameAndPasswordViewController,
      didSubmitCredentials credentials: Credentials) {
    storage.credentials = credentials

    let avatarSelectionCoordinator = AvatarSelectionCoordinator(delegate: self)
    childCoordinators.append(avatarSelectionCoordinator)

    navigationController.pushViewController(avatarSelectionCoordinator.rootViewController,
      animated: true)
  }
}
{% endhighlight %}

(You’ll notice that I’ve called `rootViewController` on `avatarSelectionCoordinator`, instead of calling a `start` method. Exposing a read-only root view controller is useful for integrating coordinators in a variety of different places, navigation controllers being one but also when configuring your window’s `rootViewController` in your application delegate.)

The next step would be for our `AccountCreationCoordinator` to implement the `AvatarSelectionCoordinatorDelegate` protocol:

{% highlight swift %}
extension AccountCreationCoordinator: AvatarSelectionCoordinatorDelegate {
  func avatarSelectionCoordinator(coordinator: AvatarSelectionCoordinator,
      didSubmitImage image: UIImage) {
    storage.avatar = image

    childCoordinators.remove(coordinator)

    // Next: Push the next view controller in the flow
  }
}
{% endhighlight %}

Here’s the problem: while this works great so long as the user keeps moving *forward* through our onboarding flow, what would happen if they tapped the navigation controller’s back button? The `AvatarSelectionCoordinator` would still be retained by the `childCoordinators` array, and *another* `AvatarSelectionCoordinator` would end up being added to the same array if the user was to submit the username and password form again. Not good.

One solution would be to have `AccountCreationCoordinator` monitor the navigation controller’s view controller stack, and ensure that a coordinator is cleaned up if its root view controller is no longer included. This would involve:

* Having `AccountCreationCoordinator` conform to `UINavigationControllerDelegate`
* Having `AccountCreationCoordinator` maintain a mapping between root view controllers and their respective coordinators

This is fairly straightforward, but this isn’t *account creation-specific* behavior. We’ll want this same behavior *everywhere* in our application where coordinators might come into contact with navigation controllers.

When trying to come up with a more elegant solution, I found myself drawing inspiration from a quote from Soroush’s original coordinator doctrine:

> You're not sitting around waiting for `-viewDidLoad` to get called so you can do work, you're totally in control of the show. There's no invisible code in a `UIViewController` superclass that is doing some magic that you don't understand. Instead of being called, you start doing the calling.

> Flipping this model makes it much easier to understand what's going on. The behavior of your app is a completely transparent to you, and UIKit is now just a library that you call when you want to use it.

Instead of having our account coordinator be called, let’s see if we can’t instead call something that treats `UINavigationController` as a library.

{% highlight swift %}
protocol RootViewControllerProvider: class {
  var rootViewController: UIViewController { get }
}

typealias RootCoordinator = protocol<Coordinator, RootViewControllerProvider>

final class NavigationController: UIViewController {
  // MARK: - Inputs

  private let rootViewController: UIViewController

  // MARK: - Mutable state

  private var viewControllersToChildCoordinators: [UIViewController: Coordinator] = [:]

  // MARK: - Lazy views

  private lazy var childNavigationController: UINavigationController =
      UINavigationController(rootViewController: self.rootViewController)

  // MARK: - Initialization

  init(rootViewController: UIViewController) {
    self.rootViewController = rootViewController

    super.init(nibName: nil, bundle: nil)
  }

  // MARK: - UIViewController

  override func viewDidLoad() {
    super.viewDidLoad()

    childNavigationController.delegate = self
    childNavigationController.interactivePopGestureRecognizer?.delegate = self

    addChildViewController(childNavigationController)
    view.addSubview(childNavigationController.view)
    childNavigationController.didMoveToParentViewController(self)

    childNavigationController.view.translatesAutoresizingMaskIntoConstraints = false

    NSLayoutConstraint.activateConstraints[
      childNavigationController.view.topAnchor.constraintEqualToAnchor(view.topAnchor),
      childNavigationController.view.leftAnchor.constraintEqualToAnchor(view.leftAnchor),
      childNavigationController.view.rightAnchor.constraintEqualToAnchor(view.rightAnchor),
      childNavigationController.view.bottomAnchor.constraintEqualToAnchor(view.bottomAnchor)
    ]
  }

  // MARK: - Public

  func pushCoordinator(coordinator: RootCoordinator, animated: Bool) {
    viewControllersToChildCoordinators[coordinator.rootViewController] = coordinator

    pushViewController(coordinator.rootViewController, animated: animated)
  }

  func pushViewController(viewController: UIViewController, animated: Bool) {
    childNavigationController.pushViewController(viewController, animated: animated)
  }
}

// MARK: - UIGestureRecognizerDelegate

extension NavigationController: UIGestureRecognizerDelegate {
  func gestureRecognizer(gestureRecognizer: UIGestureRecognizer,
      shouldRecognizeSimultaneouslyWithGestureRecognizer otherGestureRecognizer: UIGestureRecognizer) -> Bool {
    // Necessary to get the child navigation controller’s interactive pop gesture recognizer to work.
    return true
  }
}

// MARK: - UINavigationControllerDelegate

extension NavigationController: UINavigationControllerDelegate {    
  func navigationController(navigationController: UINavigationController,
      didShowViewController viewController: UIViewController, animated: Bool) {
    cleanUpChildCoordinators()
  }

  // MARK: - Private

  private func cleanUpChildCoordinators() {
    for viewController in viewControllersToChildCoordinators.keys {
      if !childNavigationController.viewControllers.contains(viewController) {
          viewControllersToChildCoordinators.removeValueForKey(viewController)
      }
    }
  }
}
{% endhighlight %}

This `NavigationController` class can be used in conjunction with coordinators throughout our application, making it easy for us to compose coordinators inside one another for maximum reusability.

`UIViewController` composition is a really powerful pattern that I’ve been using to great effect in a new project I’ve been working on. Yes, it inherently requires more boilerplate plumbing. For example, my `NavigationController` above _only_ exposes the ability to push a new view controller onto the navigation stack; none of the other public methods or properties that classes interacting directly with a `UINavigationController` instance would be able to call. I think this is a worthwhile tradeoff, however. It’s not a huge deal to proxy some method calls through if I want my custom class to expose more of `UINavigationController`’s capabilities, and in the meantime, I’m benefiting from exposing a minimal surface area with very little mutability. If I ever want to do something more elaborate, like implement my own _replacement_ for `UINavigationController`, I wouldn’t need to make code changes at any of `NavigationController`’s call sites.

While being diligent about using coordinators to route between view controllers has been a valuable exercise, there have been cases like this one where it would’ve been easy to succumb to how `UIKit` tends to imply ones code should be structured. The original thinking behind coordinators was that your application’s flow should be modeled by your own objects, with `UIKit` components serving as an implementation detail wherever possible. It shouldn’t be too surprising that going back to that original mantra led to exactly the solution that I needed in this instance. I presume that’ll continue to be the case in the future.

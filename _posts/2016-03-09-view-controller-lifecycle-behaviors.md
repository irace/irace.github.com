---
layout: post
title: View controller lifecycle behaviors
permalink: lifecycle-behaviors
date: 2016-03-09
---

My pal [Soroush](https://twitter.com/khanlou) recently [floated the idea](http://khanlou.com/2016/02/many-controllers/) of implementing reusable behaviors that pertain to a view controller’s lifecycle – such as analytics logging – using additional view controllers. There’s a lot to like about this idea; since it’s easy to compose view controllers, you don’t need to worry about adding custom storage to each of your view controller subclasses or manually overriding and hooking into each their lifecycle methods.

His post ended up being a bit of a divisive one. While view controller containment seems universally liked, using a view controller to model logic that *doesn’t* have its own associated view can _feel_ wrong. While I empathize with this sentiment, I find the concept of “lifecycle behaviors” so enticing that I’m willing to forgive their implementation perhaps feeling a bit unorthodox.

First, let’s define what exactly a lifecycle behavior would look like. Any of `UIViewController`’s standard lifecycle methods could theoretically be worth hooking into, which yields a protocol that looks something like the following:

{% highlight swift %}
protocol ViewControllerLifecycleBehavior {
    func afterLoading(viewController: UIViewController)

    func beforeAppearing(viewController: UIViewController)

    func afterAppearing(viewController: UIViewController)

    func beforeDisappearing(viewController: UIViewController)

    func afterDisappearing(viewController: UIViewController)

    func beforeLayingOutSubviews(viewController: UIViewController)

    func afterLayingOutSubviews(viewController: UIViewController)
}
{% endhighlight %}

In order for a behavior to optionally implement whichever lifecycle methods are pertinent, we can provide empty implementations by default:

{% highlight swift %}
extension ViewControllerLifecycleBehavior {
    func afterLoading(viewController: UIViewController) {}

    func beforeAppearing(viewController: UIViewController) {}

    func afterAppearing(viewController: UIViewController) {}

    func beforeDisappearing(viewController: UIViewController) {}

    func afterDisappearing(viewController: UIViewController) {}

    func beforeLayingOutSubviews(viewController: UIViewController) {}

    func afterLayingOutSubviews(viewController: UIViewController) {}
}
{% endhighlight %}

Let’s say that our app uses `UINavigationController` and that the navigation bar is visible by default, but the occasional view controller needs to hide it. Modeling this behavior in a concrete `ViewControllerLifecyleBehavior` is trivial:

{% highlight swift %}
struct HideNavigationBarBehavior: ViewControllerLifecycleBehavior {
    func beforeAppearing(viewController: UIViewController) {
        viewController.navigationController?.setNavigationBarHidden(true, animated: true)
    }

    func beforeDisappearing(viewController: UIViewController) {
        viewController.navigationController?.setNavigationBarHidden(false, animated: true)
    }
}
{% endhighlight %}

Now, how do we actually integrate these behaviors into our view controller’s lifecycle? Since view controllers forward their lifecycle methods to their children, creating a child view controller is the easiest way to hook in:

{% highlight swift %}
extension UIViewController {
    /**
     Add behaviors to be hooked into this view controller’s lifecycle.

     This method requires the view controller’s view to be loaded, so it’s best to call in `viewDidLoad` to avoid it
     being loaded prematurely.

     - parameter behaviors: Behaviors to be added.
     */
    func addBehaviors(behaviors: [ViewControllerLifecycleBehavior]) {
        let behaviorViewController = LifecycleBehaviorViewController(behaviors: behaviors)

        addChildViewController(behaviorViewController)
        view.addSubview(behaviorViewController.view)
        behaviorViewController.didMoveToParentViewController(self)
    }

    private final class LifecycleBehaviorViewController: UIViewController {
        private let behaviors: [ViewControllerLifecycleBehavior]

        // MARK: - Initialization

        init(behaviors: [ViewControllerLifecycleBehavior]) {
            self.behaviors = behaviors

            super.init(nibName: nil, bundle: nil)
        }

        required init?(coder aDecoder: NSCoder) {
            fatalError("init(coder:) has not been implemented")
        }

        // MARK: - UIViewController

        override func viewDidLoad() {
            super.viewDidLoad()

            view.hidden = true

            applyBehaviors { behavior, viewController in
                behavior.afterLoading(viewController)
            }
        }

        override func viewWillAppear(animated: Bool) {
            super.viewWillAppear(animated)

            applyBehaviors { behavior, viewController in
                behavior.beforeAppearing(viewController)
            }
        }

        override func viewDidAppear(animated: Bool) {
            super.viewDidAppear(animated)

            applyBehaviors { behavior, viewController in
                behavior.afterAppearing(viewController)
            }
        }

        override func viewWillDisappear(animated: Bool) {
            super.viewWillDisappear(animated)

            applyBehaviors { behavior, viewController in
                behavior.beforeDisappearing(viewController)
            }
        }

        override func viewDidDisappear(animated: Bool) {
            super.viewDidDisappear(animated)

            applyBehaviors { behavior, viewController in
                behavior.afterDisappearing(viewController)
            }
        }

        override func viewWillLayoutSubviews() {
            super.viewWillLayoutSubviews()

            applyBehaviors { behavior, viewController in
                behavior.beforeLayingOutSubviews(viewController)
            }
        }

        override func viewDidLayoutSubviews() {
            super.viewDidLayoutSubviews()

            applyBehaviors { behavior, viewController in
                behavior.afterLayingOutSubviews(viewController)
            }
        }

        // MARK: - Private

        private func applyBehaviors(@noescape body: (behavior: ViewControllerLifecycleBehavior, viewController: UIViewController) -> Void) {
            guard let parentViewController = parentViewController else { return }

            for behavior in behaviors {
                body(behavior: behavior, viewController: parentViewController)
            }
        }
    }
}
{% endhighlight %}

Lastly, adding this behavior to one of our custom view controllers is as simple as:

{% highlight swift %}
override func viewDidLoad() {
    super.viewDidLoad()

    addBehaviors([HideNavigationBarBehavior()])
}
{% endhighlight %}

And that’s all there is to it. Sure, the implementation might not be using view controllers in *exactly* the way that UIKit intends, but when has that stopped us before? Perhaps future enhancements to the language and SDK will allow our `addBehaviors(behaviors: [ViewControllerLifecycleBehavior])` method to be more idiomatically implemented (increased dynamism could better facilitate [aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)). But we won’t need to change all of our individual `UIViewController` subclasses if and when this happens.

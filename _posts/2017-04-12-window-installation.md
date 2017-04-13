---
layout: post
title: Window installation
permalink: window
date: 2017-04-12
---

View hierarchies in iOS applications have only gotten more complex over the years, particularly as view controller containment has gained traction as a nice way to compose parts of your application together without succumbing to inheritance (and as such [tighter coupling than you probably want](https://en.wikipedia.org/wiki/Composition_over_inheritance)). One downside of this is that displaying something _on top_ of the currently displayed view can potentially involve quite a bit of hierarchy traversal and understanding of how your UI’s pieces all fit together.

When attempting to overlay something on top of your entire view hierarchy – common examples include a notification banner or a heads-up display – it’s helpful to move up a level beyond regular views or even view controllers, and start thinking in the context of _windows_. While one could reach for `UIApplication.shared.keyWindow`, or employ some private API to find e.g. the window that’s currently hosting the status bar or an alert dialog, a far simpler and cleaner approach is to simply create a new window of your own. This is far from a new technique, but I only recently learned how easy it actually is in practice.

`UIWindow` inherits from `UIView`, meaning you can simply create a new instance by providing it with a frame: `let window = UIWindow(frame: frame)`. Magically, _you don’t actually have to explicitly add your new window to the view hierarchy_. Simply initializing it and setting its `isHidden` property to `false`[^1] will cause it to be shown on screen, with its stack order dictated by its `windowLevel` property. `UIWindowLevelStatusBar` allows your window to sit atop everything else.

Keep a strong reference to your newly created window and add whatever subviews you want to it. When finished, simply removing the reference will cause the window (and as such, its subviews) to be removed from the view hierarchy (and subsequently, from memory).

There’s a little bit of work involved in making sure that your new window doesn’t unintentionally impact the status bar style, so I’ve provided some sample code below that shows how to specify exactly how you want it to behave (if you’re not using view controller-based status bar appearance, you can ignore this and continue driving the style however you do currently).

```swift
extension UIWindow
  final class StatusBarPreferringViewController: UIViewController
    // MARK: - Inputs

    private let statusBarStyle: UIStatusBarStyle

    // MARK: - Initialization

    init(statusBarStyle: UIStatusBarStyle)
      self.statusBarStyle = statusBarStyle

      super.init(nibName: nil, bundle: nil)
    }

    required init?(coder aDecoder: NSCoder)
      fatalError("init(coder:) has not been implemented")
    }

    // MARK: - UIViewController

    override var prefersStatusBarHidden: Bool
      return false
    }

    override var preferredStatusBarStyle: UIStatusBarStyle
      return statusBarStyle
    }
  }

  static func newWindow(level: UIWindowLevel = UIWindowLevelStatusBar, statusBarStyle: UIStatusBarStyle) -> UIWindow
    guard let keyWindow = UIApplication.shared.keyWindow else  fatalError("Must have a key window")

    let window = UIWindow(frame: keyWindow.bounds)
    window.windowLevel = level
    window.isHidden = false
    window.rootViewController = StatusBarPreferringViewController(statusBarStyle: statusBarStyle)
    return window
  }
}
```

Thanks to [Joe Fabisevich](https://twitter.com/mergesort) and [Krzysztof Zabłocki](https://twitter.com/merowing_) for opening the blinds and showing me the light.

[^1]:	Unlike other `UIView` subclasses, `UIWindow` seems to be hidden by default.

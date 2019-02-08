---
layout: post
title: GraphQL and the end of shared client-side model objects
permalink: graphql
date: 2019-02-08
image: http://irace.me/images/graphql/dinosaurs.jpg
---

<figure>
  <img src="/images/graphql/dinosaurs.jpg">
</figure>

In traditional client-server development, client-side models don’t often differ too dramatically from server-side models.

Should they?

A standard RESTful API might serialize a server-side user model as such:

```json
{
  "id": 12345,
  "firstName": "Bryan",
  "lastName": "Irace",
  "avatar": {
    "thumbnail": "https://some/s3/url/a39d39fk",
    "large": "https://some/s3/url/39fka39d"
  },
  "profession": "Software developer",
  "location": {
    "city": "Brooklyn",
    "state": "NY"
  },
  "friendCount": 40
}
```

Instances of this same user model type can be vended by multiple routes, e.g.:

1. `/me` – A route that returns the currently authenticated user
2. `/friends` - A route that returns the current user’s friends

RESTful APIs aren’t inherently type-safe, so a frontend developer will generally learn that these routes both return objects the same `User` type by looking at the API documentation (and hoping that it’s accurate[^1]), or by eyeballing the HTTP traffic itself.

After realizing this, a type definition like the following can be manually added to your client-side application, instances of which you can populate when parsing response bodies from either of these two routes:

```ts
interface Avatar {
  thumbnail: string;
  large: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatar: Avatar;
  profession: string;
}
```

This shared, canonical `User` model can be used by any part of the frontend application that needs any subset of a user’s attributes. You can easily cache these `User` instances in your client-side key-value store or relational database.

Suppose that your application includes the following capabilities (and is continuing to grow in complexity):

1. Rendering user profiles (requires all user properties)
2. Viewing a list of friends (requires user names and avatars only)
3. Showing the current user’s avatar in the navigation (requires avatar only)

Your server will initially return the same user payload from all of these features’ routes, but this won’t scale particularly well. A model with a large number of properties[^2] will be necessary to render a full profile, but problematic when rendering a long list of users’ names and avatars. It’s unnecessary at best and a performance bottleneck at worst[^3] to serialize a full user when most of its properties are simply going to be ignored.

Perhaps your API developer changes your server to return only a subset of user properties from the `/friend` route. This is followed by a change to the API documentation and a hope that your frontend engineer notices, at which point they’ll add a new type to the client-side codebase. Perhaps this new type looks something like:

```ts
interface SimpleUser {
  id: number;
  firstName: string;
  lastName: string;
  avatar: Avatar;
}
```

At this point, your frontend will need to:

1. Keep track of which routes vend `User` instances vs. `SimpleUser` instances, when processing HTTP responses
2. Have its caching logic updated to support both of these different types

`User` vs. `SimpleUser` is admittedly a coarse and superficial distinction. If we add a _third_ flavor to the mix, what would we reasonably name it?

Instead of `SimpleUser`, we could instead call this new type `FriendListUser`, named after the feature that it powers. Having separate user models for each use case is a more scalable approach – we could end up with quite a few different flavors, whose names all accurately convey intention better than “simple” does:

- `FriendListUser`
- `EditAccountUser`
- `ProfileUser`
- `LoggedOutProfileUser`

The risk here is that we’re likely to incur a lot of overhead in terms of keeping track of which routes vend which models, and how to make sense of all of these different variants when modeling our frontend persistence layer.

Reducing this overhead by more tightly coupling our client-side type definitions to our API specification would be a big step in the right direction. [GraphQL](https://graphql.org) is one tool for facilitating exactly this.

## GraphQL

There’s a lot to like about GraphQL – if you’re looking for a comprehensive overview, I’d recommend checking out [the official documentation](https://graphql.org/learn/).

One advantage over traditional RESTful interfaces is that GraphQL servers vend strongly-typed schemas. These schemas can be programatically introspected, making your APIs self-documenting by default[^4]. But this is an essay about client-side models, not avoiding stale documentation.

With higher model specificity comes higher clarity and efficiency, the primary downside being the additional work involved to maintain a larger number of models. Let’s dig deeper into how code generation can mitigate this downside.

By introspecting both:

1. Our backend API’s strongly-typed schema
2. Our frontend app’s data needs

We can easily generate bespoke client-side models for each individual use case.

First, we must understand how GraphQL queries work. In a traditional RESTful API server, the same routes always vend the same models. Let’s say that our GraphQL server exposes the following two queries:

1. `me: User`
2. `friends: [User]`

While both queries expose the same server-side `User` model, the client specifies the subset of properties that it’s interested in, and only these properties are returned. Our frontend might make the following query:

```
me {
  firstName
  lastName
  location {
    city
    state
  }
  avatar {
    large
  }
}
```

The server will only return the properties specified above, even though the server-side user model contains far more properties than were actually requested.

Similarly, this query will return a different subset:

```
friends {
  firstName
  lastName
  avatar {
    thumbnail
  }
}
```

Code generation tools can introspect these client-side queries, plus the API schema definition, in order to:

1. Ensure that only valid properties are being queried for (even directly within your IDE, validating your API calls at compile-time)
2. Generate client-side models specific to each distinct query

In this case, the generated models would look as follows:

```ts
// Generated to support our `me` query

interface User_me {
  firstName: string;
  lastName: string;
  location: User_me_location;
  avatar: User_me_avatar;
}

interface User_me_location {
  city: string;
  state: string;
}

interface User_me_avatar {
  large: string;
}

// Generated to support our `friends` query

interface User_friends {
  firstName: string;
  lastName: string;
  avatar: User_friends_avatar;
}

interface User_friends_avatar {
  thumbnail: string;
}
```

Each of our app’s components can now be supplied with a model perfectly suited to their needs, without the overhead of maintaining all of these type variations ourselves.

## Trees of components, trees of queries

User interface libraries like [React](https://reactjs.org) and [UIKit](https://developer.apple.com/documentation/uikit) allow encapsulated components to be composed together into a complex hierarchy. Each component has its own state requirements that the other components ideally needn’t concern themselves with.

This is at odds with traditional RESTful API development, where a single route will often return a large swath of data used to populate whole branch of the component tree, rather than just an individual node.

GraphQL query fragments better facilite the colocation of components _and_ their data requirements:

```
const FriendListItem = gql`
  {
    firstName
    lastName
    avatar {
      thumbnail
    }
  }
`;

const FriendListRow = props => {
  return (
    <Container>
      <Avatar source={props.user.thumbnail} />

      <NameLabel firstName={props.user.firstName}
        lastName={props.user.lastName} />
    </Container>
  );
};
```

This results in a “query hierarchy” that much better aligns with our component hierarchy.

Just as a UI rendering layer will walk the component tree in order to lay out our full interface hierarchy, a GraphQL networking layer will aggregate queries and fragments into a single, consolidated payload to be requested from our server.

## Heterogenous caching made simple

GraphQL is a high-level query language; while you can use it to query a GraphQL _server_, client-side libraries such as [Apollo](https://www.apollographql.com) and [Relay](https://facebook.github.io/relay/) can act as abstraction layers on top of both the network as well as an optional local cache[^5].

(Additionally, Apollo can handle both the code generation and the query fragment unification outlined in the sections above 💫)

Traditional client-server applications often end up with logic that looks as follows:

```swift
// Check if we have a certain user in our cache
if let user = db.query("SELECT FROM users WHERE id = \(id)").first {
  callback(user)
}
else {
  // Fetch from the network instead
  API.request("/users?id=\(id)").onSuccess { response in
    callback(response.user)
  }
}
```

In this case, we’re querying for the same user via two different mechanisms: SQL against our local database and a URL-encoded query string against our remote server.

Apollo and similar libraries allow us to more declaratively specify the data that we need in one unified way. This level of abstraction lets us delegate the heavy-lifting – checking whether our request can be fulfilled purely from cache, and augmenting with additional remote data if not.

To continue our example: if you first made a `friends` query, your cached users would only contain `firstName`, `lastName`, and `avatar.thumbnail` properties. A subsequent `me` query for one of those same users would hit the server in order to “fill in” the additional properties – `location` and `avatar.large`. From this point forward, subsequent `friends` or `me` queries could avoid the network roundtrip altogether[^5].

As long as two user models have the same unique identifier, it doesn’t matter which subset of their properties were fetched in which order. Apollo will take care of normalizing them for us.

Sound magical? It certainly can be, for better or for worse. Like all high levels of abstraction, it’s amazing when it’s working and infuriating [when it isn’t](https://github.com/apollographql/react-apollo/issues/2678).

But such is the promise of GraphQL; <mark>the sky is the limit for tooling when a typed schema definition is the foundation being built upon</mark>. Tooling of this nature can make a premise that would’ve otherwise seemed prohibitively unwieldy – having a distinct client-side model type for every slight use case variation – not only achievable, but ideal.

[^1]: More likely if it’s generated using something like [Swagger](https://swagger.io), less likely if your API engineer is manually doing their best to keep it up to date.
[^2]: Just imagine how many properties a Facebook user is comprised of, for example.
[^3]: Not to mention, disrespectful of your users’ time _and_ cellular data plans.
[^4]: Tools like [GraphiQL](https://github.com/graphql/graphiql) allow you to see exactly which server-side models are vended by each of your GraphQL queries.
[^5]: Depending on your caching policy, of course.

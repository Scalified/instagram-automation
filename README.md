Welcome to instagram-automation!
===================

Here is quick tutorial to get started with the project. The main purpose of this repo is to 
get acquainted with [instagram-private-api](https://github.com/huttarichard/instagram-private-api) lib 
and how it can be used on real projects. 

There are two types of nodes implemented - web and worker nodes. First one is just a simple ExpressJS
REST API server which exposes single endpoint `GET process-feed/:userId` where userId is any 
instagram username(e.g instagram). Whenever this method is called web server fetches 200 latest 
account followers for the specified `:userId` and puts every item in the RabbitMQ queue to be processed
by worker node.

Worker node is a simple RabbitMQ consumer that listens particular queue for messages and just processes
each of them. For the moment there is no processing, though it might be every logic such 
as "like latest user's media", follow user depending on some conditions, some analytics, etc.

Requirements
-------------
We use NodeJS 6.2.0+, npm 3.8.9+, MongoDB 3.2.8

Base commands
-------------

- `npm run debug-web` - start web node in development mode, watch & transpine on the fly.
- `npm run debug-worker` - starts worker node in development mode, watch & transpine on the fly.
- `npm run debug` - starts both web & worker nodes in development mode.

Make sure you specify instagram credentials explicitly: `login=somelogin pass=somepass npm run debug`
### Testing

- `npm run it:dev` - run integration tests. Requires web node to be started.
Uses [dev environment](./server/test/.config/dev.json) configuration for tests.

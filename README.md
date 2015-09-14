# Deploy Listener

This project creates a simple server that listens to [GitHub WebHooks](https://developer.github.com/webhooks/) and then
runs a set of commands to, primarily, update the application that sent the request.

## Motivation

Upon pushing to master branch of a specific repository, I wanted to automatically update the version of that code
that runs in a cloud server, so that the live code stays updated with repository's master branch.

## Configuring GitHub

In order to use this module, you must first configure the GitHub repository that you want to keep updated. For this, you
must go to the repository settings page and click in 'Webhooks and services' and then in 'Add webhook'.

Leave 'Content-Type' as `application/json` and choose a reasonable secret key. The key you insert in GitHub should be
added to your server environment variables as `DEPLOY_LISTENER_SECRET`.

Select the events you want your server to respond to. It could be 'just the push event' option, or an option as 'Release'
or any other that you want.

Click 'Add the webhook'.

## Configuring Server

Clone this repository to your server, `npm install` and `node index.js`. The first time it runs, it will ask for several
parameters about the application you want to keep updated, the route you want to use and the port that will be used to
listen to the hooks. If necessary, you could do some port-forwarding to have a clean url in GitHub Webhooks. Otherwise,
don't forget to include the port in the `payload` url.

After running the first time, a `config.json` file will be created so that next runs won't ask for everything again.
You could create a `config.json` file manually. The required parameters are:

```json
{
    "route": "/payload",
    "port": "5000",
    "appPath": "/path/to/your/app",
    "stopCmd": "forever stop app.js",
    "updateCmd": "git pull origin master",
    "postUpdateCmd": "npm install",
    "startCmd": "forever start app.js"
}
```

## That's all folks

Now your application will be automatically updated in the server whenever a push to it's repository master branch is done.

## Warning

This module was developed for use in development environments and it has not been tested in production. Use at your own
risk.

## TODO

This is a work in progress and there are many things that could be done to improve the module general behavior and stability

Some of the ideas for future improvement are:
- Deal with errors in scripts gracefully
- Do the update in a temporary directory and only redirect some of the traffic to the new version, so that if there are
errors in the code, it can be spotted with minimum impact in customers.
- Do some automatic roll-back in case the new version has major bugs and brakes the server
- Maybe, increase flexibility in the deployTasks

## Contributing

Feel free to fork and mess with this code. But, before opening PRs, be sure that you adhere to the Code Style and Conventions
(run `grunt lint`) and add/modify as many tests as needed to ensure your code is working as expected.

## License

The MIT License (MIT)

[![Fiddus Tecnologia](http://fiddus.com.br/assets/img/logo-site.png)](http://fiddus.com.br)

Copyright (c) 2015 Vinicius Teixeira vinicius0026@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

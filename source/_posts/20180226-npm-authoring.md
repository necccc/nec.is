---
title: npm authoring basics
description: "What, how, and where to publish npm packages"
categories:
- writing
tags:
- npm
- packages
---

This is a comprehensive guide on npm authoring, not just for beginners. I'll visit the following topics:
 - **what to publish to npm**, and how to keep the node_modules folder small
 - **how to publish**, what are the [lifecycle scripts](#lifecycle-scripts) and how to use them
 - **where to publish**, [scoped packages](#scoped-packages), [private registries](#private-registry)






## Define what to publish

{% image_tag "pull-right" "node-modules.jpg" "node_modules folder vs black hole joke, a classic!" %}

Know more jokes like this? We can work on this issue, if we define what should be in the package, that goes up to npm and what stays in the git repository. With a simple, rule of thumb:
- code, that is actually needed for the module, should go to npm
- code that is not part of your module, should stay in git

Things like these, should not be packaged:
- Tests,
- Build configs, webpack scripts
- Code examples
- Usage demos

These can stay in the git repository. Anyone who needs a closer look on your module, how to use it, needs examples, can find it there. Contributors will also use the git repo as the source of code, where development is done, and tests are ran - they don't need those in the distributed package.

### Use a whitelist

To tell npm what should be packaged, use the  `files` field in the `package.json`. Content of `files` is an array of files and folders, relative to the `package.json` file. List your folders and assets that are part of the module, or need for installing or building code if necessary.

{% code json %}

    {
        "files": [
            "dist",
            "src"
        ]
    }
{% endcode %}

### Targets

Is your module targeted for the browser, or node, or both? The `main` and the `browser` fields in your `package.json` file are here to help you define which module is targeted for the browser and which one is for Node.js within the package. 

According to the [specs](https://github.com/defunctzombie/package-browser-field-spec) on `package.json` files, bundlers should parse and use the content of the `browser` field. It can be used to provide an alternate main entry point to the package itself, or just replace parts of the package when the bundler loads it targeted to browser environments.

Recently the `module` field got introduced, where you can point bundlers towards your code, which is in the new [ECMAScript Modules](http://exploringjs.com/es6/ch_modules.html) format.

{% code js %}

    {
        // your module compiled to commonJS
        "main": "dist/module.js"

        "browser": {
            // use a request-like module based on Fetch in the browser
            "request": "./shims/request-with-fetch.js",

            // basically this happens
            "code-for-node.js": "code-for-browser.js"
        },

        // your code in ES Modules format
        "module": "esm/module.js"
    }
{% endcode %}


_(You're right, the comments I've used in JSON are totally invalid, look at them as presentational decoration, and let's call it pseudo-json from now on)_


### Dependencies

**Do not put the tools needed for development in the `dependencies` field.** This is very important, because if you do, every install of your module will bring tons of modules not needed for your package during install. This wastes disk space, network traffic and time.

Everything you need during development should go to the `devDepenencies` field. This includes but not limited to:
- transpilers (like Babel)
- bundlers (Webpack for example)
- testing frameworks (Jest, Mocha, etc)
- configuration and any code for these above
- development container configs

It’s possible to build your code on install, but that should be limited to node bindings and code that actually need to be compiled on the target environment. But please don’t build/bundle js code during the install cycle.






## Build pipeline
Since we’ve touched the topic of development tools, let's dive into those a bit deeper. Usually, a development toolset relies on globally installed modules, which is fine and a quick way to go. But as your team grows, or other contributors join your project, it’s not sure they all use the same toolset, and it just feels wrong to force them to install some libraries globally.

To solve this, you can list these tools in `devDependencies`, npm installs them locally, and you can invoke them from your npm scripts.

npm comes with a new tool called `npx`, written by @zkat, and it can help you with this! Here's what it does:

{% blockquote 'npx by Kat Marchán' 'https://github.com/zkat/npx' %}
    Executes `command` either from a local node_modules/.bin, or from a central cache, installing any packages needed in order for `command` to run.
{% endblockquote %}

See this example, where all scripts do the same, using global modules, local paths or npx:

{% code js %}

    {
        "scripts": {

            // using babel as a global module,
            // exits with an error if the host hasn't installed babel as global
            "babel": "babel src --out dist",

            // using babel as a local dependency
            // works even if there is no global babel installed
            "babel": "./node_modules/babel-cli/bin/babel src --out dist"

            // using npx
            // same as the previous one, but much shorter, nicer and readable
            "babel": "npx babel src --out dist"
        }
    }
{% endcode %}

### <a name="lifecycle-scripts"></a> Lifecycle scripts

A great way to hack and organize your scripts and toolset in a project is to use the lifecycle scripts of npm. Three features, that can help a lot:

- **shorthands for scripts**
3 commands are accessible on the npm CLI as shorthands:
    - `npm start` - shorthand for `npm run start`
    - `npm stop` -  for `npm run stop`
    - `npm restart` -  for `npm run restart`, or it just runs `stop` and `start` if not specified
    - `npm test` -  for `npm run test`

- **npm scripts**
every field in the `scripts` can be invoked by running `npm run yourscript`. These fields can contain other npm scripts or tools, or any program - not just nodejs, so you can compose npm scripts together, like LEGO blocks

- **pre-post hooks**
you can take any lifecycle command, or any field from the `scripts` and prefix it with `pre` or `post`.  They will run before and after the mentioned script, so you don’t have to call them explicitly. This makes your scripts shorter and cleaner

{% code js %}

    {
        "scripts": {
            // these can be ran outside the 'run' command
            "start": "",
            "stop": "",
            "test": "",

            // these are accessibe via 'npm run ...'
            "build": "",
            "clean": "",

            // these run before or after the scripts they are bound to by name
            "prebuild": "",
            "preclean": "",
            "postclean": "",
        }
    }
{% endcode %}

{% image_tag "full" "lifecycle.svg" "Complete order of lifecycle scripts of npm install and publish" %}

Quick advice on these scripts:
- `prepublish` has been deprecated, use `prepare`, or `prepublishOnly`
- exit with a non-zero exit code **only** if it really means that the scripts should not continue - it will stop running further scripts, cancel your build, stops the CI, etc…
- you can rely on the ENV variables set by the npm CLI, look for them in `process.env` starting with `npm_`
- do not sudo. Not every user has the same privileges on their workstations.



**Note on postinstall and preinstall scripts**

Be careful what you implement here, as they run on every install run, even if it's not your module that's been installed. Check for the ENV vars, to see what's happening during the install phase.


---


### <a name="versioning"></a> Versioning, semver

Suppose your code is done, built, tested and ready for publishing by now. Awesome, you’re doing great! 

To keep the integrity and reliability of your module, it’s important to set the next version in a way, that reflect the changes in the module. For this, the [semver](https://semver.org/) is a great tool. To sum it up:

- the version is formed by _major.minor.patch_ components, but also referred as `breaking.feature.fix`, because of the exact meaning of numbers
- **major** means BREAKING CHANGE, the module will have compatibility issues with previous versions
- **minor** means new features, it should be compatible with the same major versions
- **patch** means bugfix, cleanup etc

{% blockquote Stephan Bönnemann https://speakerdeck.com/boennemann/we-fail-to-follow-semver-and-why-it-neednt-matter-1 The German word for fear of increasing the major version number %}
    Hauptversionsnummernerhöhungsangst
{% endblockquote %}

If you like named releases, nice version numbers, use those for your customers, but developers and the npm registry will use semver. Update it every time your code changes in any way.

You don’t have to touch these numbers, just use `npm version [major|minor|patch]`. This command will do the following:

1. checks if everything is committed
2. updates the version in the `package.json` according to the arguments
3. commits the package.json to git
4. tags the current commit with the new version

Your code is ready to go public, if you run `npm publish` it will be published to npm, and don’t forget to run `git push —tags`, to push the created version tag to the repository.

### Automate everything!

One of my favorite best practice is to put the test-build-publish flow to a CI environment (Travis, CircleCI for example). This has multiple benefits:

- **funneling and automating the release flow**
You don’t have to stress about forgetting something, like a build step or some parameter. Its a controlled and automated process, and team members can join in easily.
- **the environment is fixed**
the node version and the npm version is given, no matter if you use some pre-LTS node version, or if your contributors and teammates use some older version of Node.js for some reason
- **logs, debugs collected in a single platform**
if a build fails, the team can investigate, no need to access the local workstation of the publisher

### semantic-release

Stephan Bönnemann came up with this great tool called [semantic-release](https://github.com/semantic-release/semantic-release) a few years ago. It's an automated versioning and release tool, that creates the version number and the changelog by parsing your git commit messages. The ultimate release automation - check it out!







## Destinations for publishing
After detailing what to publish and how lets take a quick look at the “Where to publish” part.

### <a name="scoped-packages"></a>Scoped packages

npm allows you to create organizations, where you can release packages. Called _'scoped packages'_, they will appear under the organizaton name, using a notation like this: `@myorg/packagename`. This has a few perks, like:

- publish packages under a **namespace**, where they won’t conflict with public package names  
- group packages that are related to a **service, app or team**
- you can add package **maintainers, contributors, and teammates** to your organization
- create **private packages**, accessible only to organization members *(note: this is a paid feature)*

Here’s a quick start guide to scoped packages.

{% code bash %}

    # log in to an org 
    npm login --scope=@myorg

    # init an npm project within a scope/org
    npm init --scope=myorg

    # publish a scoped, and public package
    npm publish --access=public

{% endcode %}


### <a name="private-registry"></a> Private registry

If your organization needs one, private registries are available by npm, called npm enterprise. Its a self-hosted solution (you have to install/maintain the server) or use it as part of npm’s SaaS products, and let them host it for you.

Private registries are great for closed beta tests, or if your packages/modules are protected intellectual property (IP). You can have custom authentication methods, like LDAP, and you can define who can access the registry at read/write level. They even have the capability to create mirrors of one another, so you can set up a high availability cluster of your own npm registry if necessary.

These registries can also function as a cache server between your CI environment and the official npm registry. This ensures, that your builds always have access to the npm packages you use during a build.

While using a private npm registry, two configuration options can be really useful:
- `publishConfig` field in the package.json, where you can set the default registry for a package
- using the `registry` setting in per project `.npmrc` files, you can use the cache feature of the registry, and proxy every npm install through the private instance - where the server whitelists and caches the used modules for later use






## Wrap-up & Links

I hope I could provide some useful tips for everyone regardless of your npm-fu - if you have any questions, feel free to hit me, contact details are down below.

Here are some useful links with further information on how npm covers authoring:

[package.json | npm Documentation](https://docs.npmjs.com/files/package.json)
[GitHub - defunctzombie/package-browser-field-spec: Spec document for the ‘browser’ field in package.json](https://github.com/defunctzombie/package-browser-field-spec)
[GitHub - zkat/npx: execute npm package binaries](https://github.com/zkat/npx)
[scripts | npm Documentation](https://docs.npmjs.com/misc/scripts)
[Semantic Versioning 2.0.0 | Semantic Versioning](https://semver.org/)
[version | npm Documentation](https://docs.npmjs.com/cli/version)
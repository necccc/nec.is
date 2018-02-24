
---
title: npm authoring basics
description: "Guide on what, how, and where to publish npm packages"
categories:
- writing
tags:
- npm
- packages
---

This is a comprehensive guide on npm authoring, not just for beginners. I'll visit the following topics:
 - **what to publish to npm**, and how to keep the node_modules folder small
 - **how to publish**, what are the lifecycle scripts and how to use them
 - **where to publish**, scoped packages, private registries

## Define what to publish

[node_modules joke img]

Know more jokes like this? We can avoid them if we define what should be in the package, that goes up to npm and what stays in the git repository. With a simple, rule of thumb:
- code, that is actually needed for the module, should go to npm
- code that is not part of your module, should stay in git

Things like these, should not be packaged:
- Tests,
- Build configs, webpack scripts
- Code examples
- Usage demos

These can stay in the git repository. Anyone who needs a closer look on your module, how to use it, needs examples, can find it there.

### Use a whitelist

To tell npm what should be packaged, use the  `files` field in the `package.json`.

Content of `files` is an array of files and folders, relative to the `package.json` file. List your folders and assets that are part of the module, or need for installing or building code if necessary.

[code example]


### Targets

Is your module targeted for the browser, or node, or both? The `main` and the `browser` fields in your `package.json` file are here to help you define which module is targeted for the browser and which one is for Node.js within the package. 

According to the [specs](https://github.com/defunctzombie/package-browser-field-spec) on `package.json` files, bundlers should parse and use the content of the `browser` field. It can be used to provide an alternate main entry point to the package itself, or just replace parts of the package when the bundler loads it targeted to browser environments.

[code examples]

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

npm comes with a tool called `npx`, which is a CLI command next to npm and can be used to do exactly what we want to achieve here.

See this example, which does the same, but without global modules, or using confusingly long and redundant paths.

[example with global, with ./node_moduels/ and with npx]


### Lifecycle scripts

A great way to hack and organize your scripts and toolset in a project is to use the lifecycle scripts of npm. Three features, that can help a lot:

- **shorthands for scripts**
3 commands are accessible on the npm CLI as shorthands:
    - `npm start` - shorthand for `npm run start`
    - `npm stop` -  for `npm run stop`
    - `npm test` -  for `npm run test`

- **npm scripts**
every field in the `scripts` can be invoked by running `npm run yourscript`. These fields can contain other npm scripts or tools, so you can compose npm scripts together, like LEGO blocks

- **lifecycle hooks**
you can take any lifecycle command, or any field from the `scripts` and prefix it with `pre` or `post`.  They will run before and after the mentioned script, so you don’t have to call them explicitly. This makes your scripts shorter and cleaner

[code examples]

start
stop
test
build
clean
prebuild
prepublish
postclean

Quick advice on these scripts:

- exit with a non-zero exit code **only** if it really means that the scripts should not continue - it will stop running further scripts, cancel your build, stops the CI, etc…
- you can rely on the ENV variables set by the npm CLI, look for them in `process.env` starting with `npm_`
- do not sudo. Not every user has the same privileges on their workstations.

**Note on postinstall and preinstall scripts**


TODO
- postinstall / preinstall
    - Be careful what you implement here, as they run on every install/reinstall





### Versioning, semver    

Suppose your code is done, built, tested and ready for publishing by now. Awesome, you’re doing great! 

To keep the integrity and reliability of your module, it’s important to set the next version in a way, that reflect the changes in the module. For this, the [semver](https://semver.org/) is a great tool. To sum it up:
- the version is formed by major.minor.patch components
- major means BREAKING CHANGE, the module will have compatibility issues with previous versions
- minor means new features, it should be compatible with the same major versions
- patch means bugfix, cleanup etc

You don’t have to touch these numbers, just use `npm version [major|minor|patch]`. This command will do the following:
- checks if everything is committed
- updates the version in the `package.json` according to the arguments
- commits the package.json to git
- tags the current commit with the new version

Your code is ready to go public, if you run `npm publish` it will be published to npm, and don’t forget to run `git push —tags` if you use git, to push the created version tag to the repository.

One of my favorite best practice is to put the test-build-publish flow to a CI environment (Travis, CircleCI for example). This has multiple benefits:

- **funneling and automating the release flow**
You don’t have to stress about forgetting something, like a build step or some parameter. Its a controlled and automated process, and team members can join in easily.
- **the environment is fixed**
the node version and the npm version is given, no matter if you use some pre-LTS node version, or if your contributors and teammates use some older version of Node.js for some reason
- **logs, debugs collected in a single platform**
if a build fails, the team can investigate, no need to access the local workstation of the publisher

### npm ci

This is a brand new feature in the npm CLI toolset, released a few days ago with `npm@5.7`!

This command ensures, that in a CI environment your dependencies are installed from the `package-lock.json` file




## Destinations for publishing
After detailing what to publish and how lets take a quick look at the “Where to publish” part.

### Scoped packages

npm allows you to create organizations, where which you can release packages. This has a few perks, like:
- publish packages under a namespace, where they won’t conflict with public package names
- group packages that are related to a service, app or team
- you can add package maintainers, contributors, and teammates
- create private packages, accessible only to organization members *(note: this is a paid feature)*

Here’s a quick start guide to scoped packages.

```
# log in to an org 
npm login --scope=@myorg

# init an npm project within a scope/org
npm init --scope=myorg

# publish a scoped, and public package
npm publish --access=public
```



### Private registry

If your organization needs one, private registries are available by npm, called `npme`. Its a self-hosted solution (you have to install/maintain the server) or use it as part of npm’s SaaS products, and let them host it for you.

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
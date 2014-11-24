# generator-hottowel [![Build Status](https://secure.travis-ci.org/johnpapa/generator-hottowel.png?branch=master)](https://travis-ci.org/johnpapa/generator-hottowel)

> [Yeoman](http://yeoman.io) generator

## Getting Started

### Installing Yeoman

```bash
npm install -g yo
```

### QuickStart with generator-hottowel

To install generator-hottowel from npm, run:

```bash
npm install -g generator-hottowel
```

Run the generator:

```bash
yo hottowel
```

# Generating Code with HotTowel
HotTowel Angular starter project

>*Opinionated AngularJS style guide for teams by [@john_papa](//twitter.com/john_papa)*

>More details about the styles and patterns used in this app can be found in my [AngularJS Style Guide](https://github.com/johnpapa/angularjs-styleguide) and my [AngularJS Patterns: Clean Code](http://jpapa.me/ngclean) course at [Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) and working in teams. 

## Structure
The structure also contains a gulpfile.js and a server folder. The server is there just so we can serve the app using node. Feel free to use any server you wish.

	/src
		/client
			/app
			/content
	
## Pre-Requisites
Install [Node.js](http://nodejs.org)

Install these NPM packages globally:

`npm install -g bower gulp nodemon`

## Installing Packages
- Type `npm install`
- Type `bower install`

## Running
Type `gulp serve-dev --sync`

## Linting
Type `gulp analyze` to run code analysis on the code. This runs jshint, jscs, and plato.

## Tests
Type `gulp test` to run the unit tests (via karma, mocha, sinon).

## How It Works
The app is quite simple and has 2 main routes:
- dashboard
- admin

### The Modules
The app has 4 feature modules and depends on a series of external modules and custom but cross-app modules

```
app --> [
        app.admin,
        app.dashboard,
        app.layout,
        app.widgets,
		app.core --> [
			ngAnimate,
			ngSanitize,
			ui.router,
			blocks.exception,
			blocks.logger,
			blocks.router
		]
    ]
```

## core Module
Core modules are ones that are shared throughout the entire application and may be customized for the specific application. Example might be common data services.

This is an aggregator of modules that the application will need. The `core` module takes the blocks, common, and Angular sub-modules as dependencies. 

## blocks Modules
Block modules are reusable blocks of code that can be used across projects simply by including them as dependencies.

### blocks.logger Module
The `blocks.logger` module handles logging across the Angular app.

### blocks.exception Module
The `blocks.exception` module handles exceptions across the Angular app.

It depends on the `blocks.logger` module, because the implementation logs the exceptions.

### blocks.router Module
The `blocks.router` module contains a routing helper module that assists in adding routes to the $routeProvider.

## License

MIT

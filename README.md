# useit

A readable method to load and initialize a module and use it everywhere.

## Motivation

As is well known a large Node application is structured in some (or a lot!) of small modules. Some of this modules may require an initial configuration like this:

```javascript
// load module
var mod = require('a module');
// initialize it
mod.init(args);

// the module is now initialized
```

When you need to use the module already initialized into another module, you need only to `require` it into the other module, because Node do not load it again, but gets the previous cached module:

```javascript
// this is into another module of the same application
var mod = require('a module');

// the module is already initialized
```

If the required module does not have a dedicated `init` method but exports only a `function` to use for the initialization, like in this case:

```javascript
var intiMod = require('a module')(args);

// the module is now initialized
```

you need to access `initMod` from another module. Do to this you can use another module to store all shared variables or use the Node `global` namespace or use this simple loader (see below).

## Usage

```javascript
// instead to use this
var intiMod = require('a module')(arg1, arg2, arg3, ...);

// use this
var useit = require('useit');
var intiMod = useit.load('a module').init(arg1, arg2, arg3, ...);

// use initMod

```

Now into all other modules you can simply use `initMod`:

```javascript
var useit = require('useit');
var intiMod = useit.use('a module');

// use initMod

```

Another way is this:

```javascript
var useit = require('useit');
var intiMod = useit.load('./file-with-full-path').as('myModule').init(arg1, arg2, arg3, ...);

// use initMod

```

and use it into another module:

```javascript
var useit = require('useit');
var intiMod = useit.myModule;

// use initMod

```

The latest method is also useful if you want to manage a flat global list of modules (with or without initialization needs):

```javascript
var useit = require('useit');
var firstModule = useit.load('./first-file-with-full-path').as('first').init(args);
var secondModule = useit.load('./second-file-with-full-path').as('second').init(args);

```

and use them into another module:

```javascript
var useit = require('useit');
var firstModule = useit.first;
var secondModule = useit.second;

```

The follow method is equivalent to previous:

```javascript
var useit = require('useit');
var firstModule = useit.use('first');
var secondModule = useit.use('second');

```

You can use also a relative path. In the following example, if you have a node application with this structure:

```bash
/app/
    /lib/
        file1.js
        file2.js
        loader.js
index.js
```

you can load all files from `loader` script:

```javascript
// content of loader.js:
var useit = require('useit');
var firstModule = useit.load('./file1').as('first').init(args);
var secondModule = useit.load('./file2').as('second').init(args);

```

Since the 1.2.0 version of [useit](htts://www.npmjs.org/package/useit) is possible to load a previous required module:

```javascript
var useit = require('useit');
var someModule = require('some-module');
var firstModule = useit.load(someModule).as('first').init(args);

```

In all other modules you can use the initialized module:

```javascript
var useit = require('useit');
var firstModule = useit.first;

```

Since the 1.3.0 version is possible to load a previous initialized module without reinitialize it:

```javascript
var useit = require('useit');
var someModule = require('some-module')(opts);
var firstModule = useit.load(someModule).as('first').init();

```

In all other modules you can use the initialized module:

```javascript
var useit = require('useit');
var firstModule = useit.first;

```


__NOTE__ Only a module that exports a function is allowed.

## Installation

Install `useit` as usual:

    $ npm install useit

## Tests

As usual our tests are written in the BDD styles for the [Mocha](http://visionmedia.github.com/mocha) test runner using the `should` assertion interface and the best coverage tool [Blanket](http://blanketjs.org).
To run the test simply type in your terminal:

```bash
$ npm test
```

To run the coverage test type instead:

```bash
$ npm run cov
```

## License

Copyright (c) 2014 Yoovant by Marcello Gesmundo. All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

   * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
     disclaimer in the documentation and/or other materials provided with the distribution.
   * Neither the name of Yoovant nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/**
 *
 * License
 *
 * Copyright (c) 2014 Yoovant by Marcello Gesmundo. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above
 *      copyright notice, this list of conditions and the following
 *      disclaimer in the documentation and/or other materials provided
 *      with the distribution.
 *    * Neither the name of Yoovant nor the names of its
 *      contributors may be used to endorse or promote products derived
 *      from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var path = require('path');
var callsite = require('callsite');
var debug = require('debug')('useit');

/**
 * Load a module
 *
 * @param {String|Function} source The module to load or a function returned by a required module.
 * @return {Loader} The loader instance
 * @chainable
 */
function load(source) {
  var _source = source
    .toString()
    .replace(/\s{2,}/g,' ')
    .replace(/\r?\n|\r/g, '');
  if (_source.length > 60) {
    _source = _source.substr(0, 57) + '...';
  }
  debug('load "%s"', _source);
  return new Loader(source);
}

/**
 * Assign a name to the loaded module
 * @param {String} name The name assigned to the instance of the loaded module
 * @chainable
 */
function as(name) {
  debug('as "%s"', name);
  this.name = name;
  return this;
}

function _load(module) {
  try {
    debug('try load module using "%s"', module);
    return require(module);
  } catch (e) {
    debug('error loading module "%s"', module);
    return null;
  }
}

function init() {
  debug('init');
  var args = [].slice.call(arguments);
  var stack = callsite();
  var requester = stack[1].getFileName();
  var requesterPath = path.dirname(requester);

  var mod, instance;
  if ('function' === typeof this.source) {
    debug('load module not initialized');
    mod = this.source;
  } else if ('object' === typeof this.source && !!this.source) {
    debug('load module already initialized');
    mod = this.source;
  } else {
    var sourcePath = path.resolve(requesterPath, this.source);
    mod = _load(sourcePath);
    if (!mod) {
      sourcePath = path.resolve(this.source);
      mod = _load(sourcePath);
    }
    if (!mod) {
      mod = _load(this.source);
    }
  }
  if (!mod) {
    throw new Error('unable to load module ' + this.source);
  }
  if ('function' === typeof mod) {
    debug('created instance with arguments %o', args);
    instance = mod.apply(this, args);
  } else {
    if (args.length > 0) {
        throw new Error('unable to initialize with options a module already initialized.');
    } else {
      debug('use already initialized instance');
      instance = mod;
    }
  }
  Object.defineProperty(Loader, this.name, {
    get: function get() {
      debug('read "%s" config', this.name);
      return instance;
    }.bind(this),
    configurable: true,
    enumerable: true
  });
  return instance;
}

function use(name) {
  debug('use "%s" config', name);
  return this[name];
}

function Loader(source){
  this.source = source;
  this.name = source;
}

Loader.load = load;
Loader.use = use;
Loader.prototype.as = as;
Loader.prototype.init = init;

exports = module.exports = Loader;
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

/**
 * Load a module
 *
 * @param {String} source The module to load
 * @return {Loader} The loader instance
 * @chainable
 */
function load(source) {
  return new Loader(source);
}

/**
 * Assign a name to the loaded module
 * @param {String} name The name assigned to the instance of the loaded module
 * @chainable
 */
function as(name) {
  this.name = name;
  return this;
}

function init() {
  var args = [].slice.call(arguments);
  var mod = require(this.source);
  var instance = mod;
  if ('function' === typeof mod && args.length > 0) {
    instance = mod.apply(this, args);
  }
  Object.defineProperty(Loader, this.name, {
    get: function get() {
      return instance;
    },
    enumerable: true
  });
  return instance;
}

function use(name) {
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
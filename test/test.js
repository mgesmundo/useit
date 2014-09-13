var useit = require('..');
var should = require('should');

describe('useit', function() {
  it('should load a module in current path', function(done) {
    var mod = useit.load('a').as('relative').init({
      param1: 1,
      param2: 2
    });
    useit.relative.param1.should.eql(1);
    useit.use('relative').param2.should.eql(2);
    done();
  });
  it('should load a module using a relative path', function(done) {
    var mod = useit.load('./a').as('relative').init({
      param1: 1,
      param2: 2
    });
    useit.relative.param1.should.eql(1);
    useit.use('relative').param2.should.eql(2);
    done();
  });
  it('should load a module using an absolute relative path', function(done) {
    var mod = useit.load(__dirname + '/a').as('absolute').init({
      param1: 1,
      param2: 2
    });
    useit.absolute.param1.should.eql(1);
    useit.use('absolute').param2.should.eql(2);
    done();
  });
  it('should load a module using its name', function(done) {
    var mod = useit.load('callsite').init();
    useit.callsite.toString().should.eql(mod.toString());
    done();
  });
  it('should load a module already required', function(done) {
    var lmod = require('./a');
    var mod = useit.load(lmod).as('test').init({
      name: 'test'
    });
    useit.test.name.should.eql(lmod({ name: 'test' }).name);
    useit.test.name.should.eql(mod.name);
    done();
  });
  it('should load a module already initialized without options', function(done) {
    var lmod = require('callsite')();
    var mod = useit.load(lmod).as('callsite').init();
    lmod.should.eql(mod);
    useit.callsite.should.eql(lmod);
    done();
  });
  it('should load a module already initialized with options', function(done) {
    var lmod = require('./a')({ foo: 'bar' });
    var mod = useit.load(lmod).as('test').init();
    lmod.should.eql(mod);
    useit.use('test').foo.should.eql('bar');
    useit.test.should.eql(lmod);
    lmod.foo.should.eql('bar');
    done();
  });
  it('should throw error loading (with options) a module already initialized', function(done) {
    useit.load(require('./a')).as('test').init({
      name: 'test'
    });
    var lmod = require('./a')({ foo: 'bar' });
    (function () {
      useit.load(lmod).as('test').init({
        foo: 'foo'
      });
    }).should.throw('unable to initialize with options a module already initialized');
    done();
  });
  it('should throw error loading an already required module without specifying a name', function(done) {
    var lmod = require('callsite')();
    (function () {
      useit.load(lmod).init();
    }).should.throw();
    done();
  });
});
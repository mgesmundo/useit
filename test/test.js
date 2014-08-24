var useit = require('..');

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
    var lmod = require('callsite');
    var mod = useit.load(lmod).as('callsite').init();
    useit.callsite.toString().should.eql(lmod.toString());
    useit.callsite.toString().should.eql(mod.toString());
    done();
  });
});
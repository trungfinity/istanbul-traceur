'use strict';

var istanbulTraceur = requireLib('istanbul');

describe('istanbul-traceur', function () {
  describe('.mock', function () {
    it('should return modified `istanbul` module after mocking', function () {
      istanbulTraceur.mock();

      var istanbul = require('istanbul');
      expect(istanbul).to.be.equal(istanbulTraceur);

      istanbulTraceur.unmock();
    });
  });

  describe('.unmock', function () {
    it('should return original `istanbul` module after unmocking', function () {
      var originalIstanbul = require('istanbul');

      istanbulTraceur.mock();
      require('istanbul');
      istanbulTraceur.unmock();

      var istanbul = require('istanbul');
      expect(istanbul).to.be.equal(originalIstanbul);
    });
  });
});

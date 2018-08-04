'use strict';

const RGPD = artifacts.require('./RGPD.sol');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

contract('RGPD', function(accounts) {

  // create accounts
  const user = web3.eth.accounts.create();
  const company = accounts[0];

  // calculate timestamp of today + 1 year
  const date = new Date(); date.setFullYear(date.getFullYear() + 1);

  // Message to opt-in
  const message = 'I agree the terms and conditions.';

  it("should let a user opt-in", function() {
    let contract;
    let sig;
    return RGPD.deployed()
      .then(function(instance) {
        contract = instance;
        // Sign the opt-in, a timeframe & the company concerned
        sig = user.sign(message + date + company);
        return contract.write(user.address, sig.v, sig.r, sig.s, {from: company});
      }).then(function() {
        return contract.verify(user.address, company, sig.messageHash);
      }).then(function(res) {
        assert(res);
      }).then(function() {
        return contract.remove(user.address, {from: company});
      }).then(function() {
        return contract.verify(user.address, company, sig.messageHash);
      }).then(function(res) {
        assert(!res);
      });
  });

});

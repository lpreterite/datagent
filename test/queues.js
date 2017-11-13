var Queue = require('../src/utils/queue.js');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var assert =chai.assert;
describe('utils/queue.js', function() {
  describe('#run', function() {
    it('should return 12', function() {
      assert.eventually.equal(Queue.run([
        function(data){
          return new Promise((resolve, reject)=>{
            setTimeout(() => {
              resolve(data+1);
            }, 500);
          });
        },
        function(data){
          return new Promise((resolve, reject)=>{
            setTimeout(() => {
              resolve(data+2);
            }, 500);
          });
        },
        function(data){
          return new Promise((resolve, reject)=>{
            setTimeout(() => {
              resolve(data+3);
            }, 500);
          });
        },
      ])(6), 12);
    });
  });
});
import { Queue } from '../src/utils/queue.js';

describe('utils/queue.js', function() {
  describe('#run', function() {
    it('should return "Packy, hollow word"', function() {
      assert.eventually.equal(Queue.run([
        function(data){
          return new Promise((resolve, reject)=>{
            setTimeout(() => {
              resolve(data+'hollow');
            }, 600);
          });
        },
        function(data){
          return new Promise((resolve, reject)=>{
            setTimeout(() => {
              resolve(data+" ");
            }, 200);
          });
        },
        function(data){
          return new Promise((resolve, reject)=>{
            setTimeout(() => {
              resolve(data+"word!");
            }, 450);
          });
        },
      ])("Packy, "), "hollow word!");
    });
  });
});
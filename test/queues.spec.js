import { Queue } from '../src/utils/queue.js';

describe('utils/queue.js', function() {
  describe('#run', function() {
    it('should return "Packy, hollow word"', function() {
      assert.eventually.equal(Queue.run([
        function(data){
          return new Promise((resolve, reject)=>{
            setTimeout(() => {
              console.log(data, 1);
              resolve(data+'hollow');
            }, 600);
          });
        },
        function(data){
          return new Promise((resolve, reject)=>{
            setTimeout(() => {
              console.log(data, 2);
              resolve(data+" ");
            }, 200);
          });
        },
        function(data){
          return new Promise((resolve, reject)=>{
            setTimeout(() => {
              console.log(data, 3);
              resolve(data+"word!");
            }, 450);
          });
        },
      ])("Packy, "), "hollow word!");
    });
  });
});
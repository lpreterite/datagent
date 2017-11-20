var Queue = require('../src/utils/queue.js');

describe('utils/queue.js', function() {
  describe('#run', function() {
    it('should return "Packy, hollow word"', function() {
      var queues = [
        function (data) {
          console.log(data, 1);
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(data + 'hollow');
            }, 400);
          });
        },
        function (data) {
          console.log(data, 2);
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(data + " ");
            }, 100);
          });
        },
        function (data) {
          console.log(data, 3);
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(data + "word!");
            }, 600);
          });
        },
      ];

      return assert.eventually.equal(Queue.run(queues)("Packy, "), "Packy, hollow word!");
    });
  });
});
// var Queue = require('../src/classes/Queue.class.js');

import Queue from "../src/classes/Queue.class.js";

describe('Queue Class Test', function() {
  describe('#run', function() {
    it('should return "Packy, hollow word"', function() {
      var queues = [
        function (ctx, next) {
          console.log(ctx.result, ctx.args , 1);
          setTimeout(() => {
            ctx.result = ctx.args + 'hollow';
            next();
          }, 400);
        },
        function (ctx, next) {
          console.log(ctx.result, 2);
          setTimeout(() => {
            ctx.result += " ";
            next();
          }, 100);
        },
        function (ctx, next) {
          console.log(ctx.result, 3);
          setTimeout(() => {
            ctx.result += "word!";
            next();
          }, 600);
        },
      ];

      return assert.eventually.include(Queue.run({}, "Packy, ", queues),"Packy, hollow word!");
    });
  });
});
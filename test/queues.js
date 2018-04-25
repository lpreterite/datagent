import Queue from "../src/classes/Queue.class.js";

describe('Queue Class Test', function() {
  var err, result;
  var ctx = {};
  var data = [];

  describe('#run', function() {
    it('应当输出内容顺序为[1,2,3]的数组', async function() {
      const operations = [
        function (ctx, next) {
          // console.log('first start');
          setTimeout(() => {
            ctx.result = [].concat(ctx.args, 1);
            // console.log('first value:' + ctx.result);
            next();
          }, 150);
          // console.log('first end');
        },
        function (ctx, next) {
          // console.log('second start');
          setTimeout(() => {
            ctx.result = [].concat(ctx.result, 2);
            // console.log('second value:' + ctx.result);
            next();
          }, 100);
          // console.log('second end');
        },
        function (ctx, next) {
          // console.log('third start');
          setTimeout(() => {
            ctx.result = [].concat(ctx.result, 3);
            // console.log('third value:' + ctx.result);
            next();
          }, 200);
          // console.log('third start');
        },
      ];

      let ctx={};
      [err, result, ctx] = await Queue.run(operations)(data, ctx);
      
      // console.log(result);
      // console.log(ctx);

      return assert.includeOrderedMembers(result, [1,2,3]);
    });
  });
});
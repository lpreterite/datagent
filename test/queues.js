import Queue from "../src/classes/Queue.class.js";

describe('Queue Class Test', function() {
  var err, result;
  var ctx = {};
  var data = [];

  function asyncFun(fn, time){
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        try{
          fn();
          resolve();
        }catch(e){
          reject(e);
        }
      }, time);
    });
  }

  describe('run()', function() {
    it('应当输出内容顺序为[1,2,3]的数组', async function() {
      const operations = [
        async function (ctx, next) {
          await asyncFun(()=>{
            ctx.result = [].concat(ctx.args, 1);
          }, 150);
          return next();
        },
        async function (ctx, next) {
          await asyncFun(() => {
            ctx.result = [].concat(ctx.result || [], 2);
          }, 100);
          return next();
        },
        async function (ctx, next) {
          await asyncFun(() => {
            ctx.result = [].concat(ctx.result, 3);
          }, 200);
          return next();
        },
      ];

      [err, result, ctx] = await Queue.run(operations)(data, ctx);
      
      // console.log(result);
      // console.log(ctx);

      return assert.includeOrderedMembers(result, [1,2,3]);
    });
  });
});
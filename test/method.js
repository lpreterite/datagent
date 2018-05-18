import Method from "../src/classes/Method.class.js";

describe('Method Class Test', function() {
  var err, result;
  var ctx = {};
  var data = [];

  function asyncFun(fn, time){
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        try{
          resolve(fn());
        }catch(e){
          reject(e);
        }
      }, time);
    });
  }

  describe('generate()', function() {
    it('应当输出内容顺序为[1,2,3]的数组', async function() {
      const operations = [
        async function (ctx) {
          return await asyncFun(()=>{
            ctx.result = [].concat(ctx.args, 1);
            return ctx;
          }, 150);
        },
        async function (ctx) {
          return await asyncFun(() => {
            ctx.result = [].concat(ctx.result || [], 2);
            return ctx;
          }, 100);
        },
        async function (ctx) {
          return await asyncFun(() => {
            ctx.result = [].concat(ctx.result, 3);
            return ctx;
          }, 200);
        },
      ];

      result = await Method.generate(operations)(data, ctx);

      return assert.includeOrderedMembers(result, [1,2,3]);
    });
  });
});
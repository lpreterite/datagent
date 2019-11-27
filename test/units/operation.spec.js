import {
    respondData,
    formatFor,
    filterFor
} from '../../src/operations';
import _schema from '../../src/schema';

describe('Hook operations function test', ()=>{
    describe('respondData', ()=>{
        let ctx = {};
        it('当respond的status小于200时，上下文的result应当替换为respond.data', async () => {
            ctx = {
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom' }]
                }
            };
            const context = await respondData()(ctx);
            assert.equal(context.result.constructor, Array);
        })
        it('当respond的status大于200时，应当抛出错误', async () => {
            ctx = {
                result: {
                    status: 500
                }
            };
            try{
                const context = await respondData()(ctx);
            } catch (e) {
                assert.equal(e.constructor, Error);
            }
        })
    })
    describe('formatFor', () => {
        let ctx, schema;
        beforeEach(()=>{
            schema = _schema({
                id: { type: Number, default: null },
                name: { type: String, default: null },
                sex: { type: Number, default: 0 },
            });
        })
        it('默认转义ctx.result的数据', async () => {
            ctx = {
                method: 'find',
                result: { id: 1, name: 'Tom' }
            };
            ctx = await formatFor(schema)(ctx);
            assert.ownInclude(ctx.result, { id: 1, name: 'Tom', sex: 0 });
        })
        it('支持指定转义数据的字段', async () => {
            ctx = {
                method: 'find',
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom' }]
                }
            };
            ctx = await respondData()(ctx);
            ctx = await formatFor(schema, (ctx, format)=>{
                ctx.result=ctx.result.map(item=>format(item))
            })(ctx);
            assert.ownInclude(ctx.result[0], { id: 1, name: 'Tom', sex: 0 });
        })
    })
    describe('filterFor', () => {
        let ctx, schema;
        beforeEach(() => {
            schema = _schema({
                id: { type: Number, default: null },
                name: { type: String, default: null },
                sex: { type: Number, default: 0 },
            });
        })
        it('默认过滤ctx.result的字段', async () => {
            ctx = {
                method: 'find',
                result: { id: 1, name: 'Tom', sex: 0, abc: "111" }
            };
            ctx = await filterFor(schema)(ctx);
            assert.ownInclude(ctx.result, { id: 1, name: 'Tom', sex: 0 });
        })
        it('支持指定过滤数据的字段', async () => {
            ctx = {
                method: 'find',
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom', sex: 0, abc: "111" }]
                }
            };
            ctx = await respondData()(ctx);
            ctx = await filterFor(schema, (ctx, filter)=>{
                ctx.result=ctx.result.map(item=>filter(item, ['id','name','sex']))
            })(ctx);
            assert.ownInclude(ctx.result[0], { id: 1, name: 'Tom', sex: 0 });
        })
    })
})
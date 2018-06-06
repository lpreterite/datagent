import {
    respondData,
    awaitTo,
    format,
    filter,
    formatFor,
    filterFor
} from '../src/operations/';
import Schema from '../src/classes/Schema.class';

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
    describe('format', () => {
        let ctx, schema;
        beforeEach(()=>{
            schema = new Schema({
                id: { type: Number, default: null },
                name: { type: String, default: null },
                sex: { type: Number, default: 0 },
            });
        })
        it('当方法运作在find:after的钩子且返回对象时，应当转义数据字段', async () => {
            ctx = {
                method: 'find',
                hook: 'after',
                scope: {
                    schema
                },
                result: {
                    status: 200,
                    data: { id: 1, name: 'Tom' }
                }
            };
            ctx = await respondData()(ctx);
            ctx = await format()(ctx);
            assert.hasAllKeys(ctx.result, { id: 1, name: 'Tom', sex: 0 });
        })
        it('当方法运作在fetch:after的钩子且返回对象是数组时，应当转义数组内的数据字段', async () => {
            ctx = {
                method: 'fetch',
                hook: 'after',
                scope: {
                    schema
                },
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom' }]
                }
            };
            ctx = await respondData()(ctx);
            ctx = await format()(ctx);
            assert.hasAllKeys(ctx.result[0], { id: 1, name: 'Tom', sex: 0 } );
        })
        it('当方法运作在save:before的钩子且返回对象时，应当转义传入数据字段', async () => {
            ctx = {
                method: 'save',
                hook: 'before',
                scope: {
                    schema
                },
                args: [{ id: 1, name: 'Tom' }]
            };
            ctx = await format()(ctx);
            assert.hasAllKeys(ctx.args[0], { id: 1, name: 'Tom', sex: 0 });
        })
        it('当方法运作在fetch:after, find:after, save:before以外的钩子时，应当抛出错误', async () => {
            ctx = {
                method: 'save',
                hook: 'after',
                scope: {
                    schema
                },
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom' }]
                }
            };
            try{
                ctx = await format()(ctx);
            }catch(e){
                assert.include(e.message, 'The format operation must use in');
            }
        })
    })
    describe('formatFor', () => {
        let ctx, user, role;
        beforeEach(() => {
            user = new Schema({
                id: { type: Number, default: null },
                name: { type: String, default: null },
                sex: { type: Number, default: 0 },
            })
            role = new Schema({
                id: { type: Number, default: null },
                name: { type: String, default: null },
                created_at: { type: Number, default: Date.now() }
            })
        })
        it('当方法运作在find:after的钩子且返回对象时，应当转义数据字段', async () => {
            ctx = {
                method: 'find',
                hook: 'after',
                scope: {
                    schema: user
                },
                result: {
                    status: 200,
                    data: { id: 1, name: 'Tom', role: { id: 1, name: 'member' } }
                }
            };
            ctx = await respondData()(ctx);
            ctx = await formatFor('role', role)(ctx);
            assert.property(ctx.result.role, 'created_at');
        })
        it('当方法运作在fetch:after的钩子且返回对象是数组时，应当转义数组内的数据字段', async () => {
            const now = Date.now();
            ctx = {
                method: 'fetch',
                hook: 'after',
                scope: {
                    schema: user
                },
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom', role: { id: 1, name: 'member' } }]
                }
            };
            ctx = await respondData()(ctx);
            ctx = await formatFor('role', role)(ctx);
            assert.property(ctx.result[0].role, 'created_at');
        })
        it('当方法运作在save:before的钩子且返回对象时，应当转义传入数据字段', async () => {
            ctx = {
                method: 'save',
                hook: 'before',
                scope: {
                    schema: user
                },
                args: [{ id: 1, name: 'Tom', role: { id: 1, name: 'member' } }]
            };
            ctx = await formatFor('role', role)(ctx);
            assert.property(ctx.args[0].role, 'created_at');
        })
        it('当方法运作在fetch:after, find:after, save:before以外的钩子时，应当抛出错误', async () => {
            ctx = {
                method: 'save',
                hook: 'after',
                scope: {
                    schema: user
                },
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom' }]
                }
            };
            try {
                ctx = await formatFor('role', role)(ctx);
            } catch (e) {
                assert.include(e.message, 'The formatFor operation must use in');
            }
        })
    })
    describe('filter', () => {
        let ctx, schema;
        beforeEach(() => {
            schema = new Schema({
                id: { type: Number, default: null },
                name: { type: String, default: null },
                sex: { type: Number, default: 0 },
            });
        })
        it('当传入fields参数时，应当保留fields包含的字段', async () => {
            ctx = {
                method: 'save',
                hook: 'before',
                scope: {
                    schema
                },
                args: [{ id: 1, name: 'Tom', order: 1 }]
            };
            ctx = await filter(['id', 'name', 'order'])(ctx);
            assert.hasAllKeys(ctx.args[0], { id: 1, name: 'Tom', order: 1 });
        })
        it('当方法运作在find:after的钩子且返回对象时，应当过滤数据字段', async () => {
            ctx = {
                method: 'find',
                hook: 'after',
                scope: {
                    schema
                },
                result: {
                    status: 200,
                    data: { id: 1, name: 'Tom', order: 1 }
                }
            };
            ctx = await respondData()(ctx);
            ctx = await filter()(ctx);
            assert.hasAllKeys(ctx.result, { id: 1, name: 'Tom' });
        })
        it('当方法运作在fetch:after的钩子且返回对象是数组时，应当过滤数组内的数据字段', async () => {
            ctx = {
                method: 'fetch',
                hook: 'after',
                scope: {
                    schema
                },
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom', order: 1 }]
                }
            };
            ctx = await respondData()(ctx);
            ctx = await filter()(ctx);
            assert.hasAllKeys(ctx.result[0], { id: 1, name: 'Tom' });
        })
        it('当方法运作在save:before的钩子且返回对象时，应当转义传入数据字段', async () => {
            ctx = {
                method: 'save',
                hook: 'before',
                scope: {
                    schema
                },
                args: [{ id: 1, name: 'Tom', order: 1 }]
            };
            ctx = await filter()(ctx);
            assert.hasAllKeys(ctx.args[0], { id: 1, name: 'Tom' });
        })
        it('当方法运作在fetch:after, find:after, save:before以外的钩子时，应当抛出错误', async () => {
            ctx = {
                method: 'save',
                hook: 'after',
                scope: {
                    schema
                },
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom' }]
                }
            };
            try {
                ctx = await filter()(ctx);
            } catch (e) {
                assert.include(e.message, 'The filter operation must use in');
            }
        })
    })
    describe('filterFor', () => {
        let ctx, user, role;
        beforeEach(() => {
            user = new Schema({
                id: { type: Number, default: null },
                name: { type: String, default: null },
                sex: { type: Number, default: 0 },
            })
            role = new Schema({
                id: { type: Number, default: null },
                name: { type: String, default: null },
                created_at: { type: Number, default: Date.now() }
            })
        })
        it('当传入fields参数时，应当保留fields包含的字段', async () => {
            ctx = {
                method: 'save',
                hook: 'before',
                scope: {
                    schema: user
                },
                args: [{ id: 1, name: 'Tom', order: 1, role: { id: 1, name: 'member' } }]
            };
            ctx = await filterFor('role', ['id'])(ctx);
            assert.deepInclude(ctx.args[0].role, { id: 1 });
        })
        it('当方法运作在find:after的钩子且返回对象时，应当过滤数据字段', async () => {
            ctx = {
                method: 'find',
                hook: 'after',
                scope: {
                    schema: user
                },
                result: {
                    status: 200,
                    data: { id: 1, name: 'Tom', order: 1, role: { id: 1, name: 'member' } }
                }
            };
            ctx = await respondData()(ctx);
            ctx = await filterFor('role', ['id'])(ctx);
            assert.hasAllKeys(ctx.result.role, { id: 1 });
        })
        it('当方法运作在fetch:after的钩子且返回对象是数组时，应当过滤数组内的数据字段', async () => {
            ctx = {
                method: 'fetch',
                hook: 'after',
                scope: {
                    schema: user
                },
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom', order: 1, role: { id: 1, name: 'member' } }]
                }
            };
            ctx = await respondData()(ctx);
            ctx = await filterFor('role', ['id'])(ctx);
            assert.hasAllKeys(ctx.result[0].role, { id: 1 });
        })
        it('当方法运作在save:before的钩子且返回对象时，应当转义传入数据字段', async () => {
            ctx = {
                method: 'save',
                hook: 'before',
                scope: {
                    schema: user
                },
                args: [{ id: 1, name: 'Tom', order: 1, role: { id: 1, name: 'member' } }]
            };
            ctx = await filterFor('role', ['id'])(ctx);
            assert.hasAllKeys(ctx.args[0].role, { id: 1 });
        })
        it('当方法运作在fetch:after, find:after, save:before以外的钩子时，应当抛出错误', async () => {
            ctx = {
                method: 'save',
                hook: 'after',
                scope: {
                    schema: user
                },
                result: {
                    status: 200,
                    data: [{ id: 1, name: 'Tom' }]
                }
            };
            try {
                ctx = await filterFor()(ctx);
            } catch (e) {
                assert.include(e.message, 'The filterFor operation must use in');
            }
        })
    })
})
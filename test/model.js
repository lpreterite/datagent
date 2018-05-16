import Model from '../src/classes/Model.class';
import Remote from '../src/classes/Remote.class';
import Schema from '../src/classes/Schema.class';
import Dataflow from '../src/Dataflow';
import { defaults } from '../src/utils/';
import { format } from '../src/operations/';

const handle = (res) => {
    // console.log(res);
    let result, err;
    if (res.data.code < 200) {
        err = new Error(res.data.msg);
    }
    result = res.data.data;
    return Promise.resolve([err, result, res]);
};

describe('Model Class Test', function () {
    let Model;
    before(function () {
        Model = Dataflow.Model({
            name: 'user',
            fields: {
                id: { type: Number, default: 0 },
                nickname: { type: String, default: '' },
                sex: { type: Number, default: '1' },
                create_at: { type: String, default: Date.now() }
            },
            methods: {
                test: (some)=>{
                    return some+"thing";
                }
            }
        })
    });

    it('应当包含schema对象', function () {
        return assert.equal(Model.schema.constructor, Schema);
    })
    it('prototype应当包含fetch方法', function(){
        return assert.isDefined(Model.prototype.fetch);
    })
    it('prototype应当包含find方法', function () {
        return assert.isDefined(Model.prototype.find);
    })
    it('prototype应当包含save方法', function () {
        return assert.isDefined(Model.prototype.save);
    })
    it('prototype应当包含delete方法', function () {
        return assert.isDefined(Model.prototype.delete);
    })
    it('prototype应当包含自定义方法', function () {
        return assert.isDefined(Model.prototype.test);
    })
})

describe('Model instace Test', function () {
    let mock, hosts, contact, model;
    before(function () {
        hosts = {
            base: 'http://localhost/api',
            test: 'http://localhost:8081/api'
        };

        contact = Dataflow.Contact({
            base: axios.create({ baseURL: hosts.base }),
            test: axios.create({ baseURL: hosts.test })
        });
        const UserModel = Dataflow.Model({
            name: 'user',
            fields: {
                id: { type: Number, default: 0 },
                nickname: { type: String, default: '' },
                sex: { type: Number, default: '1' },
                create_at: { type: String, default: Date.now() },
                disabled: { type: Number, default: 0 }
            },
            methods: {
                ban(id, opts) {
                    return this.save({ id, disabled: 1 }, opts);
                },
                errorTest() {
                    throw new Error('just a bug');
                }
            }
        });
        model = new UserModel({ name: 'user', url: '/users', contact });

        // init mock XHR
        mock = {
            base: new MockAdapter(contact.remote('base').origin),
            test: new MockAdapter(contact.remote('test').origin)
        }
    })
    after(function () {
        mock.base.restore();
        mock.test.restore();
    })

    describe('instance.fetch()', function () {
        afterEach(function () {
            mock.base.reset();
            mock.test.reset();
        })
        it('应当发起[GET]请求', async function () {
            const data = [
                { id: 1, name: 'John Smith' },
                { id: 2, name: 'Packy Tang' }
            ];
            mock
                .base
                .onGet(hosts.base + '/users')
                .reply(200, { code: 200, data, msg: '' });

            let err, result;
            [err, result] = await model.fetch().then(handle);
            assert.sameDeepMembers(result, data);
        })
        it('当传入参数时，[GET]请求的路由应当带上传入参数', async function () {
            mock
                .base
                .onGet(hosts.base + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.fetch({ q: 'John' }).then(handle);
            assert.propertyVal(result, 'id', 1);
        })
        it('当传入origin参数时，应当切换至对应的远端服务', async function () {
            mock
                .test
                .onGet(hosts.test + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.fetch({ q: 'John' }, { origin: 'test' }).then(handle);
            assert.propertyVal(result, 'id', 1);
        })
    })
    describe('instance.find()', function () {
        afterEach(function () {
            mock.base.reset();
            mock.test.reset();
        })
        it('应当发起带有id路由的[GET]请求', async function () {
            mock
                .base
                .onGet(hosts.base + '/users/1')
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.find(1).then(handle);
            assert.propertyVal(result, 'id', 1);
        })
        it('当传入origin参数时，应当切换至对应的远端服务', async function () {
            mock
                .test
                .onGet(hosts.test + '/users/1')
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.find(1, { origin: 'test' }).then(handle);
            assert.propertyVal(result, 'id', 1);
        })
    })
    describe('instance.save()', function () {
        afterEach(function () {
            mock.base.reset();
            mock.test.reset();
        })
        it('当数据不存在id字段时，应当发送[POST]请求新增对象', async function () {
            mock
                .base
                .onPost(hosts.base + '/users', { name: 'Cathy Yan' })
                .reply(200, { code: 200, data: { id: 3, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.save({ name: 'Cathy Yan' }).then(handle);
            assert.propertyVal(result, 'id', 3);
        })
        it('当数据包含id字段时，应当发送[PUT]请求更新对象', async function () {
            mock
                .base
                .onPut(hosts.base + '/users/3', { id: 3, name: 'Cathy Yan' })
                .reply(200, { code: 200, data: { id: 3, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.save({ id: 3, name: 'Cathy Yan' }).then(handle);
            assert.propertyVal(result, 'id', 3);
        })
    })
    describe('instance.delete()', function () {
        afterEach(function () {
            mock.base.reset();
            mock.test.reset();
        })
        it('应当发起带有id路由的[DELETE]请求', async function () {
            mock
                .base
                .onDelete(hosts.base + '/users/1')
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.delete(1).then(handle);
            assert.propertyVal(result, 'id', 1);
        })
        it('当传入origin参数时，应当切换至对应的远端服务', async function () {
            mock
                .test
                .onDelete(hosts.test + '/users/1')
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.delete(1, { origin: 'test' }).then(handle);
            assert.propertyVal(result, 'id', 1);
        })
    })

    describe('一些额外情况', function () {
        it('方法内发生错误时应当报错', async function () {
            let err, result;
            try {
                [err, result] = await model.errorTest();
            } catch (e) {
                assert.equal("just a bug", e.message);
            }
        })
        it('自定义方法应当能使用', async function () {
            mock
                .base
                .onPut(hosts.base + '/users/1', { id: 1, disabled: 1 })
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith', disabled: 1 }, msg: '' });

            let err, result;
            [err, result] = await model.ban(1).then(handle);
            assert.propertyVal(result, 'disabled', 1);
            mock.base.reset();
        })
        it('Model类方法钩子应当生效', async function () {
            const UserModel = Dataflow.Model({
                name: 'user',
                fields: {
                    id: { type: Number, default: 0 },
                    nickname: { type: String, default: '' },
                    sex: { type: Number, default: '1' },
                    create_at: { type: String, default: Date.now() },
                    disabled: { type: Number, default: 0 }
                },
                methods: {
                    typeahead(q, opts) {
                        return this.fetch({ q }, opts);
                    }
                },
                hooks: {
                    fetch: {
                        after: (ctx, next) => {
                            const result = ctx.result;
                            if (result.data.code < 200) return;
                            result.data.data = result.data.data.map((item, index)=>{
                                item.order=index;
                                return item;
                            });
                            next();
                        }
                    }
                }
            });
            model = new UserModel({ name: 'user', url: '/users', contact });

            mock
                .base
                .onGet(hosts.base + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: [{ id: 1, name: 'John Smith' }], msg: '' });

            let err, result;
            [err, result] = await model.typeahead('John').then(handle);
            assert.propertyVal(result[0], 'order', 0);
            mock.base.reset();
        })
        it('自定义方法的钩子应当生效', async function(){
            const UserModel = Dataflow.Model({
                name: 'user',
                fields: {
                    id: { type: Number, default: 0 },
                    nickname: { type: String, default: '' },
                    sex: { type: Number, default: '1' },
                    create_at: { type: String, default: Date.now() },
                    disabled: { type: Number, default: 0 }
                },
                methods: {
                    typeahead(q, opts) {
                        return this.fetch({ q }, opts);
                    }
                },
                hooks: {
                    typeahead: {
                        before: (ctx, next) => {
                            let [query] = ctx.args;
                            query = query.q ? query.q : query.keyword;
                            ctx.args = [query];
                            next();
                        }
                    }
                }
            });
            model = new UserModel({ name: 'user', url: '/users', contact });

            mock
                .base
                .onGet(hosts.base + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: [{ id: 1, name: 'John Smith' }], msg: '' });

            let err, result;
            [err, result] = await model.typeahead({ keyword: 'John' }).then(handle);
            assert.propertyVal(result[0], 'id', 1);
            mock.base.reset();
        })
        it('方法运行时应当支持添加钩子', async function () {
            const UserModel = Dataflow.Model({
                name: 'user',
                fields: {
                    id: { type: Number, default: 0 },
                    nickname: { type: String, default: '' },
                    sex: { type: Number, default: '1' },
                    create_at: { type: String, default: Date.now() },
                    disabled: { type: Number, default: 0 }
                },
                methods: {
                    typeahead(q, opts) {
                        console.log(q);
                        return this.fetch({ q }, opts);
                    }
                },
                hooks: {
                    typeahead: {
                        before: (ctx, next) => {
                            let [query] = ctx.args;
                            query = query.q ? query.q : query.keyword;
                            ctx.args = [query];
                            next();
                        }
                    }
                }
            });
            model = new UserModel({ name: 'user', url: '/users', contact });

            mock
                .base
                .onGet(hosts.base + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: [{ id: 1, name: 'John Smith' }], msg: '' });

            let err, result;
            [err, result] = await model.typeahead({ keyword: 'John' }, {
                hooks: {
                    after: (ctx, next) => {
                        let [query] = ctx.args;
                        let res = ctx.result;
                        if (res.data.code < 200) return;
                        res.data.data = {
                            keyword: query,
                            typeahead: res.data.data
                        };
                        next();
                    }
                }
            }).then(handle);
            // console.log(result);
            assert.propertyVal(result, 'keyword', 'John');
            mock.base.reset();
        })
    });

    describe('额外钩子Receive', function () {
        it('应当在fetch后生效', async function () {
            const UserModel = Dataflow.Model({
                name: 'user',
                fields: {
                    id: { type: Number, default: 0 },
                    nickname: { type: String, default: '' },
                    sex: { type: Number, default: '1' },
                    create_at: { type: String, default: Date.now() },
                    disabled: { type: Number, default: 0 }
                },
                methods: {
                    typeahead(q, opts) {
                        return this.fetch({ q }, opts);
                    }
                },
                hooks: {
                    ...Dataflow.mapReceiveHook([
                        (ctx, next) => {
                            const result = ctx.result;
                            if (result.data.code < 200) return next();
                            result.data.data = result.data.data.map((item, index) => {
                                item.order = index;
                                return item;
                            });
                            next();
                        }
                    ])
                }
            });
            model = new UserModel({ name: 'user', url: '/users', contact });

            mock
                .base
                .onGet(hosts.base + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: [{ id: 1, name: 'John Smith' }], msg: '' });

            let err, result;
            [err, result] = await model.typeahead('John').then(handle);
            assert.propertyVal(result[0], 'order', 0);
            mock.base.reset();
        })
        it('应当在find后生效', async function () {
            const create_at = Date.now();
            const UserModel = Dataflow.Model({
                name: 'user',
                fields: {
                    id: { type: Number, default: 0 },
                    nickname: { type: String, default: '' },
                    sex: { type: Number, default: '1' },
                    create_at: { type: String, default: create_at },
                    disabled: { type: Number, default: 0 }
                },
                hooks: {
                    ...Dataflow.mapReceiveHook([
                        format()
                        // (ctx, next) => {
                        //     const res = ctx.result;
                        //     if (res.data.code < 200) return next();
                        //     res.data.data = ctx.scope.schema.format(res.data.data);
                        //     ctx.result = res;
                        //     next();
                        // }
                    ])
                }
            });
            model = new UserModel({ name: 'user', url: '/users', contact });

            mock
                .base
                .onGet(hosts.base + '/users/1')
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.find(1).then(handle);
            assert.propertyVal(result, 'create_at', create_at);
            mock.base.reset();
        })
    });
    describe('额外钩子Send', function () {
        it('应当在save前生效', async function () {
            const create_at = Date.now();
            const UserModel = Dataflow.Model({
                name: 'user',
                fields: {
                    id: { type: Number, default: 0 },
                    nickname: { type: String, default: '' },
                    sex: { type: Number, default: '1' },
                    create_at: { type: String, default: create_at },
                    disabled: { type: Number, default: 0 }
                },
                hooks: {
                    ...Dataflow.mapSendHook([
                        (ctx, next) => {
                            let data = ctx.args.pop();
                            ctx.args = [ctx.scope.schema.filter(data, ['id', 'name', 'create_at']), ...ctx.args];
                            next();
                        }
                    ])
                }
            });
            model = new UserModel({ name: 'user', url: '/users', contact });

            mock
                .base
                .onPost(hosts.base + '/users', { name: 'John Smith', create_at })
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith', create_at }, msg: '' });

            let err, result;
            [err, result] = await model.save({ name: 'John Smith', create_at, sex: 0 }).then(handle);
            assert.propertyVal(result, 'create_at', create_at);
            mock.base.reset();
        })
    });
});
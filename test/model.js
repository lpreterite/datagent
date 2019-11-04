import datagent from '../src/';
import { awaitTo } from '../src/utils/';
import { formatFor, respondData } from '../src/operations';

const parseData = ()=> ctx => {
    let result;
    if (ctx.result.code < 200) {
        throw new Error(ctx.result.msg);
    }
    result = ctx.result.data;
    ctx.result = result
    return Promise.resolve(ctx);
};

describe('Model Test', function () {
    let mock, hosts, contact, model, userSchema;
    before(function () {
        hosts = {
            base: 'http://localhost/api',
            test: 'http://localhost:8081/api'
        };

        contact = datagent.contact({
            base: axios.create({ baseURL: hosts.base }),
            test: axios.create({ baseURL: hosts.test })
        });

        userSchema = datagent.schema({
            id: { type: Number, default: 0 },
            nickname: { type: String, default: '' },
            sex: { type: Number, default: '1' },
            create_at: { type: String, default: Date.now() },
            disabled: { type: Number, default: 0 }
        })

        model = datagent.model({
            name: 'user',
            url: '/users',
            contact,
            methods: {
                ban(id, opts) {
                    const { origin } = {...opts}
                    // return this.save({ id, disabled: 1 }, opts);
                    return this.contact.remote(origin).patch(this.getURL(id), {id, disabled: 1})
                },
                errorTest() {
                    throw new Error('just a bug');
                }
            },
            hooks: {
                fetch:method=>[method(),respondData(), parseData()],
                find:method=>[method(),respondData(), parseData()],
                save:method=>[method(),respondData(), parseData()],
                destroy:method=>[method(),respondData(), parseData()],
            }
        });

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
            [err, result] = await awaitTo(model.fetch())
            assert.sameDeepMembers(result, data);
        })
        it('当传入参数时，[GET]请求的路由应当带上传入参数', async function () {
            mock
                .base
                .onGet(hosts.base + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.fetch({ q: 'John' }))
            assert.propertyVal(result, 'id', 1);
        })
        it('当传入origin参数时，应当切换至对应的远端服务', async function () {
            mock
                .test
                .onGet(hosts.test + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.fetch({ q: 'John' }, { origin: 'test' }))
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
            [err, result] = await awaitTo(model.find({id: 1}))
            assert.propertyVal(result, 'id', 1);
        })
        it('当传入origin参数时，应当切换至对应的远端服务', async function () {
            mock
                .test
                .onGet(hosts.test + '/users/1')
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.find({id: 1}, { origin: 'test' }))
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
                .reply(200, { code: 200, data: { id: 3, name: 'Cathy Yan' }, msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.save({ name: 'Cathy Yan' }))
            assert.propertyVal(result, 'id', 3);
        })
        it('当id字段为空字符时，应当发送[POST]请求新增对象', async function () {
            mock
                .base
                .onPost(hosts.base + '/users', { name: 'Cathy Yan' })
                .reply(200, { code: 200, data: { id: 3, name: 'Cathy Yan' }, msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.save({ id: undefined, name: 'Cathy Yan' }))
            assert.propertyVal(result, 'id', 3);
        })
        it('当数据包含id字段时，应当发送[PUT]请求更新对象', async function () {
            mock
                .base
                .onPut(hosts.base + '/users/3', { id: 3, name: 'Cathy Yan' })
                .reply(200, { code: 200, data: { id: 3, name: 'Cathy Yan' }, msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.save({ id: 3, name: 'Cathy Yan' }))
            assert.propertyVal(result, 'id', 3);
        })
    })
    describe('instance.destroy()', function () {
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
            [err, result] = await awaitTo(model.destroy({id:1}))
            assert.propertyVal(result, 'id', 1);
        })
        it('当传入origin参数时，应当切换至对应的远端服务', async function () {
            mock
                .test
                .onDelete(hosts.test + '/users/1')
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.destroy({id:1}, { origin: 'test' }))
            assert.propertyVal(result, 'id', 1);
        })
    })

    describe('一些额外情况', function () {
        it('方法内发生错误时应当报错', async function () {
            let err, result;
            try {
                [err, result] = await model.errorTest({});
            } catch (e) {
                assert.equal("just a bug", e.message);
            }
        })
        it('支持自定义方法', async function () {
            mock
                .base
                .onPatch(hosts.base + '/users/1', { id: 1, disabled: 1 })
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith', disabled: 1 }, msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.ban(1))
            assert.propertyVal(result.data.data, 'disabled', 1);
            mock.base.reset();
        })
        it('Model类方法钩子应当生效', async function () {
            model = datagent.model({
                name: 'user',
                url: '/users',
                contact,
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
                    fetch(method){
                        return [
                            method(),
                            (ctx) => {
                                const result = ctx.result;
                                if (result.data.code < 200) return;
                                result.data.data = result.data.data.map((item, index)=>{
                                    item.order=index;
                                    return item;
                                });
                                return Promise.resolve(ctx);
                            },
                            respondData(),
                            parseData()
                        ]
                    }
                }
            });

            mock
                .base
                .onGet(hosts.base + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: [{ id: 1, name: 'John Smith' }], msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.typeahead('John'))
            assert.propertyVal(result[0], 'order', 0);
            mock.base.reset();
        })
        it('自定义方法的钩子应当生效', async function(){
            model = datagent.model({
                name: 'user',
                url: '/users',
                contact,
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
                    typeahead(method){
                        return [
                            (ctx) => {
                                let [query] = ctx.args;
                                query = query.q ? query.q : query.keyword;
                                ctx.args = [query];
                                return Promise.resolve(ctx);
                            },
                            method(),
                            respondData(),
                            parseData()
                        ]
                    }
                }
            });

            mock
                .base
                .onGet(hosts.base + '/users', { params: { q: 'John' } })
                .reply(200, { code: 200, data: [{ id: 1, name: 'John Smith' }], msg: '' });

            let err, result;
            [err, result] = await awaitTo(model.typeahead({ keyword: 'John' }))
            assert.propertyVal(result[0], 'id', 1);
            mock.base.reset();
        })
    });
});
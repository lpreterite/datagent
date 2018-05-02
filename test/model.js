import Model from '../src/classes/Model.class';
import Remote from '../src/classes/Remote.class';
import { ContactFactory } from '../src/utils/';

const handle = res => {
    let err, result;
    if (res.data.code < 200) {
        err = new Error(res.data.msg);
    }
    result = res.data.data;
    return Promise.resolve([err, result]);
};

describe('Model Class Test', function () {
    let mock, hosts, contact, model;
    before(function () {
        hosts = {
            base: 'http://localhost/api',
            test: 'http://localhost:8081/api'
        };

        contact = ContactFactory({
            base: axios.create({ baseURL: hosts.base }),
            test: axios.create({ baseURL: hosts.test })
        });
        model = new Model({ name: 'user', url: '/users', contact });
        // init mock XHR
        mock = {
            base: new MockAdapter(contact.remote('base').origin),
            test: new MockAdapter(contact.remote('test').origin)
        }
    })
    after(function(){
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
            [err, result] = await model.find(1, { origin : 'test' }).then(handle);
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
                .onPost(hosts.base + '/users')
                .reply(200, { code: 200, data: { id: 3, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.save({ name: 'Cathy Yan' }).then(handle);
            assert.propertyVal(result, 'id', 3);
        })
        it('当数据包含id字段时，应当发送[PUT]请求更新对象', async function () {
            mock
                .base
                .onPut(hosts.base + '/users/3')
                .reply(200, { code: 200, data: { id: 3, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await model.save({ id:3, name: 'Cathy Yan' }).then(handle);
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
})
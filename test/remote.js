import _remote from '../src/remote';

const handle = res => {
    let err, result;
    if(res.data.code < 200){
        err = new Error(res.data.msg);
    }
    result = res.data.data;
    return Promise.resolve([err, result]);
};

describe('Remote Class Test', function () {
    let mock, remote;
    let baseURL = 'http://localhost/api';
    before(function () {
        remote = _remote(axios.create({ baseURL }));
        // init mock XHR
        mock = new MockAdapter(remote.origin);
    })
    after(function () {
        mock.restore();
    })

    describe('instance.get()', function () {
        afterEach(function(){
            mock.reset();
        })
        it('应当发起[GET]请求', async function () {
            const data = [
                { id: 1, name: 'John Smith' },
                { id: 2, name: 'Packy Tang' }
            ];
            mock.onGet(baseURL + '/users').reply(200, { code: 200, data, msg: '' });

            let err, result;
            [err, result] = await remote.get('/users').then(handle);
            assert.sameDeepMembers(result, data);
        })
        it('当传入参数时，[GET]请求的路由应当带上传入参数', async function () {
            mock
                .onGet(baseURL + '/user', { params: { id: 1 } })
                .reply(200, { code: 200, data: { id: 1, name: 'John Smith' }, msg: '' });

            let err, result;
            [err, result] = await remote.get('/user', { id: 1 }).then(handle);
            assert.propertyVal(result, 'id', 1 );
        })
    })
    describe('instance.post()', function () {
        afterEach(function () {
            mock.reset();
        })
        it('应当发起[POST]请求', async function () {
            mock
                .onPost(baseURL + '/user', { name: 'Cathy Yan' })
                .reply(200, { code: 200, data: { id: 3, name: 'Cathy Yan' }, msg: '' });

            let err, result;
            [err, result] = await remote.post('/user', { name: 'Cathy Yan' }).then(handle);
            assert.propertyVal(result, 'id', 3);
        })
    })
    describe('instance.put()', function () {
        afterEach(function () {
            mock.reset();
        })
        it('应当发起[PUT]请求', async function () {
            mock
                .onPut(baseURL + '/user/3', { id: 3, name: 'Cathy Yang' })
                .reply(200, { code: 200, data: { id: 3, name: 'Cathy Yang' }, msg: '' });

            let err, result;
            [err, result] = await remote.put('/user/3', { id: 3, name: 'Cathy Yang' }).then(handle);
            assert.propertyVal(result, 'name', 'Cathy Yang');
        })
    })
    describe('instance.patch()', function () {
        afterEach(function () {
            mock.reset();
        })
        it('应当发起[PATCH]请求', async function () {
            mock
                .onPatch(baseURL + '/user/3', { name: 'Cathy Yan' })
                .reply(200, { code: 200, data: { id: 3, name: 'Cathy Yan' }, msg: '' });

            let err, result;
            [err, result] = await remote.patch('/user/3', { name: 'Cathy Yan' }).then(handle);
            assert.propertyVal(result, 'name', 'Cathy Yan');
        })
    })
    describe('instance.delete()', function () {
        afterEach(function () {
            mock.reset();
        })
        it('应当发起[DELETE]请求', async function () {
            mock
                .onDelete(baseURL + '/user/3')
                .reply(200, { code: 200, data: { id: 3, name: 'Cathy Yan' }, msg: '' });

            let err, result;
            [err, result] = await remote.delete('/user/3').then(handle);
            assert.propertyVal(result, 'id', 3);
        })
    })
})
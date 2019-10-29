import datagent from '../src/';
const { awaitTo } = datagent.utils

describe('Model Test', function () {
    let mock, hosts, contact;
    describe('on()', function () {
        before(function() {
            hosts = {
                base: 'http://localhost/api',
                test: 'http://localhost:8081/api'
            };
    
            contact = datagent.contact({
                base: axios.create({ baseURL: hosts.base })
            });

            mock = {
                base: new MockAdapter(contact.remote('base').origin)
            }
        })
        afterEach(function () {
            mock.base.reset();
        })

        it('出错时回调on绑定的error函数', async function () {
            let [err, result] = await awaitTo(new Promise((resolve, reject)=>{
                mock
                    .base
                    .onGet(hosts.base + '/users')
                    .reply(401);
                const model = datagent.model({
                    name: 'user',
                    url: '/users',
                    contact
                });
                const agent = datagent.agent([model])
                agent.on('error', err=>resolve(err))
                agent.fetch(model.name)
            }))
            assert.equal(result, "Error: Request failed with status code 401", "应该返回错误信息为：'Error: Request failed with status code 401'");
        })
        it('每次执行方法前回调on绑定的before函数', async function () {
            let [err, result] = await awaitTo(new Promise((resolve, reject)=>{
                mock
                    .base
                    .onGet(hosts.base + '/users')
                    .reply(200, [{id:1, name:"Packy"}]);
                const model = datagent.model({
                    name: 'user',
                    url: '/users',
                    contact
                });
                const agent = datagent.agent([model])
                agent.on('before', ({model_name, action})=>resolve(`The ${model_name} use ${action}`))
                agent.fetch(model.name)
            }))
            assert.equal(result, "The user use fetch", "应该返回的信息为：'The user use fetch'");
        })
        it('每次执行方法后回调on绑定的after函数', async function () {
            const data = [{id:1, name:"Packy"}]
            let [err, result] = await awaitTo(new Promise((resolve, reject)=>{
                mock
                    .base
                    .onGet(hosts.base + '/users')
                    .reply(200, data);
                const model = datagent.model({
                    name: 'user',
                    url: '/users',
                    contact
                });
                const agent = datagent.agent([model])
                agent.on('after', (err, result)=>resolve(result.data))
                agent.fetch(model.name)
            }))
            assert.sameDeepMembers(result, data);
        })
    })
})
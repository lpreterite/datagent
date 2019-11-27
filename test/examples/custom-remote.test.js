import datagent from "../../src/"
import CustomRemote from './Remote.class'

const handle = res => {
    let err, result;
    if(res.status < 200){
        err = new Error(res.statusText);
    }
    result = res.data;
    return Promise.resolve([err, result]);
};

describe('Custom Remote Test', function(){
    let contact, remote, post;
    before(function (){
        contact = datagent.contact(
            //remote的设定
            {
                base: { baseURL: 'https://jsonplaceholder.typicode.com' }
            },
            //生成时替换为自定义的remote
            {
                RemoteConstructor: CustomRemote
            }
        )
    })
    after(function (){
        post = null
    })
    it('发送GET请求', async function(){
        let err, result;
        [err, result] = await contact.remote().get('/todos/3').then(handle);
        assert.propertyVal(result, 'title', 'fugiat veniam minus')
    })
    it('发送POST请求', async function(){
        let err, result;
        [err, result] = await contact.remote().post('/todos', { title: "do something", completed: false, userId: 1 }).then(handle);
        assert.property(result, "id", "应当返回id字段");
    })
    it('发送PUT请求', async function(){
        let err, result;
        [err, result] = await contact.remote().put('/todos/3', { id: 3, title: "fugiat veniam minus", completed: true, userId: 1 }).then(handle);
        assert.propertyVal(result, "completed", true);
    })
    it('发送PATCH请求', async function(){
        let err, result;
        [err, result] = await contact.remote().patch('/todos/3', { id: 3, completed: true }).then(handle);
        assert.propertyVal(result, "completed", true);
    })
    it('发送DELETE请求', async function(){
        const res = await contact.remote().delete('/todos/3');
        assert.propertyVal(res, "status", 200);
    })
})
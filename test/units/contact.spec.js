import _remote from '../../src/remote';
import _contact from '../../src/contact';
import datagent from '../../src/';

describe('Contact Class Test', () => {
    let contact, remotes;

    beforeEach(() => {
        remotes = {
            'base': axios.create('localhost/api'),
            'test': axios.create('localhost:8881/api')
        };
        contact = _contact();
    });

    describe('instance.remote()', () => {
        it('应当根据名称记录远端服务', () => {
            contact.remote('base', _remote(remotes.base));
            contact.remote('test', _remote(remotes.test));
            assert.exists(contact.remote('base'), '没有添加至连接器中');
        })
        it('应当支持默认设置', () => {
            const testRemote = _remote(remotes.test);
            contact.remote('base', _remote(remotes.base));
            contact.remote('test', testRemote);
            contact.default('test');
            assert(contact.remote() === testRemote, "获得远端服务应为test");
        })
        it('当不传入名称时应当返回默认远程服务', () => {
            contact.remote('base', _remote(remotes.base));
            contact.default('base')
            assert.exists(contact.remote(), '没有返回远程服务');
        })
        it('当传入名称没有找到远端服务时要报错', () => {
            contact.remote('base', _remote(remotes.base));
            assert.throws(()=>contact.remote('develop'), /No 'develop' found in remotes/);
        })
    })

    describe('instance.default()', ()=>{
        it('输入参数name必须是字符串', ()=>{
            contact = datagent.contact(remotes);
            assert.throws(()=>contact.default(233), /The name must be String in contact/);
        })
        it('输入参数name必须存在于remote的键', () => {
            contact = datagent.contact(remotes);
            assert.throws(()=>contact.default('233'), /No '233' found in remotes/);
        })
    })
});
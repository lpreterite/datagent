import _remote from '../src/remote';
import _contact from '../src/contact';
import datagent from '../src/';

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
    })

    describe('instance.default()', ()=>{
        it('输入参数name必须是字符串', ()=>{
            contact = datagent.contact(remotes);
            try{
                contact.default(233);
            } catch (e) {
                assert.equal(e.constructor, TypeError, e.msg);
            }
        })
        it('输入参数name必须存在于remote的键', () => {
            contact = datagent.contact(remotes);
            try {
                contact.default("233");
            } catch (e) {
                assert.equal(e.constructor, RangeError, e.msg);
            }
        })
    })
});
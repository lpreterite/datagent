import Remote from '../src/classes/Remote.class';
import Contact from '../src/classes/Contact.class';
import DataPlumber from '../src/DataPlumber';

describe('Contact Class Test', () => {
    let contact, remotes;

    beforeEach(() => {
        remotes = {
            'base': axios.create('localhost/api'),
            'test': axios.create('localhost:8881/api')
        };
        contact = new Contact();
    });

    describe('instance.remote()', () => {
        it('应当根据名称记录远端服务', () => {
            contact.remote('base', new Remote({ origin: remotes.base }));
            contact.remote('test', new Remote({ origin: remotes.test }), { default: true });
            assert.exists(contact.remote('base'), '没有添加至连接器中');
        })
        it('应当支持默认设置', () => {
            const testRemote = new Remote({ origin: remotes.test });
            contact.remote('base', new Remote({ origin: remotes.base }));
            contact.remote('test', testRemote, { default: true });
            assert(contact.remote() === testRemote, "获得远端服务应为test");
        })
        it('当不传入名称时应当返回默认远程服务', () => {
            contact.remote('base', new Remote({ origin: remotes.base }));
            assert.exists(contact.remote(), '没有返回远程服务');
        })
    })

    describe('instance.default()', ()=>{
        it('输入参数name必须是字符串', ()=>{
            contact = DataPlumber.Contact(remotes);
            try{
                contact.default(233);
            } catch (e) {
                assert.equal(e.constructor, TypeError, e.msg);
            }
        })
        it('输入参数name必须存在于remote的键', () => {
            contact = DataPlumber.Contact(remotes);
            try {
                contact.default("233");
            } catch (e) {
                assert.equal(e.constructor, RangeError, e.msg);
            }
        })
    })
});
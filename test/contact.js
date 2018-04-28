import Remote from '../src/classes/Remote.class';
import Contact from '../src/classes/Contact.class';

// const contact = new Contact();
// contact.remote('test', testRemote, { default: true });
// contact.remote('test'); // get Test Remote
// contact.remote(); // get default Remote, Test Remote is default

describe('Contact Class Test', () => {
    let contact, remotes;

    beforeEach(() => {
        remotes = {
            'base': axios.create('localhost/api'),
            'test': axios.create('localhost:8881/api')
        };
        contact = new Contact();
    });

    describe('instance.remote()', ()=>{
        it('应当根据名称记录远端服务', ()=>{
            contact.remote('base', new Remote({ origin: remotes.base }));
            assert.exists(contact.remote('base'), '没有添加至连接器中');
        })
        it('应当支持默认设置', () => {
            const testRemote = new Remote({ origin: remotes.test });
            contact.remote('base', new Remote({ origin: remotes.base }));
            contact.remote('test', testRemote, { default: true });
            assert(contact.remote() === testRemote, "获得远端服务应为test");
        })
    })
});
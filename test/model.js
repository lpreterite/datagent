import Model from '../src/classes/Model.class';
import Remote from '../src/classes/Remote.class';
import Contact from '../src/classes/Contact.class';

describe('Model Class Test', function () {
    let mock, contact, model;
    let baseURL = 'http://localhost/api';
    before(function () {
        let remote = new Remote({ origin: axios.create({ baseURL }) });
        contact = new Contact();
        contact.remote('base', remote);
        model = new Model({ name: 'user', url: '/users', contact });
        // init mock XHR
        mock = new MockAdapter(remote.origin);
    })
    after(function(){
        mock.restore();
    })

    describe('The Remote Fetch Test', function () {
        let data;

        before(function(){
            data = {
                users: [
                    { id: 1, name: 'John Smith' },
                    { id: 2, name: 'Packy Tang' }
                ]
            };
        })

        beforeEach(function () {
            mock.onGet(baseURL+'/users').reply(200, data);
        });

        afterEach(function () {
            mock.reset();
        });

        it('just for a single spec', async ()=>{
            const result = await model.remote().get('/users').then(res=>res.data);
            assert.sameDeepMembers(result.users, data.users);
        })

    })
})
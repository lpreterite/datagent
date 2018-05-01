import Model from '../src/classes/Model.class';
import Remote from '../src/classes/Remote.class';
import Contact from '../src/classes/Contact.class';

describe('mocking axios requests', function () {
    let mock, contact, model, remotes;
    before(function () {
        remotes = {
            'base': axios.create({ baseURL: 'localhost/api' })
        };
        contact = new Contact();
        contact.remote('base', new Remote({ origin: remotes.base }));

        model = new Model({ name: 'user', url: '/users', contact });
        // console.log(model.remote().get('/'));

        mock = new MockAdapter(remotes.base);
    })
    after(function(){
        mock.restore();
    })
    describe('across entire suite', function () {
        beforeEach(function () {
            mock.onGet('/users', { params: { searchText: 'John' } }).reply(200, {
                users: [
                    { id: 1, name: 'John Smith' }
                ]
            });
        });

        afterEach(function () {
            mock.reset();
        });

        it('just for a single spec', async ()=>{
            const result = await model.remote().get('/users', { params: { searchText: 'John' } }).then(res=>res.data);
            assert.sameDeepMembers(result.users, [
                { id: 1, name: 'John Smith' }
            ]);
        })

    })
})
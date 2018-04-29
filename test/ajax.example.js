describe('mocking axios requests', function () {
    let mock;
    before(function(){
        mock = new MockAdapter(axios);
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
            const result = await axios.get('/users', { params: { searchText: 'John' } }).then(res=>res.data);
            assert.sameDeepMembers(result.users, [
                { id: 1, name: 'John Smith' }
            ]);
        })

    })
})
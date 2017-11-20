const Modeler = require('../src/modeler');
const axios = require('axios');
const operations = {
    http: require('../src/operations/HttpMethods'),
    restful: require('../src/operations/RestfulMethods'),
    common: require('../src/operations/common'),
}

const modeler = new Modeler();
const TestModel = modeler.create({
    fields: {
        id: { type: Number, default: null },
        title: { type: String, default: '' },
        content: { type: String, default: '' },
        type: { type: String, default: '' },
    },
    methods: Object.assign({}, operations.https, operations.restful, operations.common )
});
const $test = new TestModel({
    instance: axios.create({
        baseURL: 'localhost:300/api'
    })
});

describe('Array', function () {
    describe('#indexOf()', function () {
        it('use modeler create model', function () {
            return assert.exists($test.find, '$test is not has find function');
        });

        is('$test use schame', function () {
            return assert.eventually.propertyVal($test.schame(1), 'id', null);
        })

        is('$test use find', function(){
            return assert.eventually.propertyVal( $test.find(1), 'id', 1);
        })
    });
});
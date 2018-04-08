import Modeler from '../src/modeler.js';
import axios from 'axios';
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
    methods: Object.assign({}, operations.http, operations.restful, operations.common )
});
const $test = new TestModel({
    instance: axios.create({
        baseURL: 'localhost:300/api'
    })
});

describe('Modeler', function () {
    it('use modeler create model', function () {
        return assert.exists($test.find, '$test is not has find function');
    });

    it('$test use schame', function () {
        const schame = $test.schame();
        return assert.propertyVal(schame, 'id', null);
    })

    it('$test use find', function () {
        return assert.eventually.propertyVal($test.find(1), 'id', 1);
    })
});
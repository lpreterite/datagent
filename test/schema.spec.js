import fecha from "fecha";
import Schema from "../src/classes/Schema.class.js";

function Fecha(val){
    let result = val;
    if (typeof result === "number"){
        result = new Date(val);
    }
    if (result.constructor === Date) {
        result = fecha.format(val, "YYYY-MM-DD HH:mm:ss");
    }
    return result;
}

describe('Schema Class Test', function(){
    var data, format = {
        id: { type: Number, defaults: null },
        nickname: { type: String, defaults: "" },
        sex: { type: String, defaults: 0 },
        created_at: { type: Fecha, defaults: "" },
        updated_at: { type: Fecha, defaults: "" }
    };
    before(function(){
        let metas = {
            id: 1,
            nickname: "Packy",
            sex: 0,
            created_at: Date.now(),
            updated_at: new Date,
            other: "Test"
        }
        data = Schema.format(metas, format);
    })
    describe('#format', function(){
        it('return data field "sex" should be String', function(){
            assert.isString(data.sex);
        })
        it('return data field "created_at" should be String', function () {
            console.log(data.created_at);
            assert.isString(data.created_at);
        })
        it('return data field "updated_at" should be String', function () {
            console.log(data.updated_at);
            assert.isString(data.updated_at);
        })
        it('return data has other field', function () {
            assert.isDefined(data.other);
        })
    })
});
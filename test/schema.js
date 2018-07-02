import fecha from "fecha";
import Schema from "../src/classes/Schema.class.js";

class DateFormat {
    static format(format){
        return val => {
            if (typeof val === 'string') return val;
            if (typeof val === "number") val = new Date(val);
            return fecha.format(val, format);
        }
    }
    static parse(format) {
        return val => {
            if (val.constructor === Date) return val;
            if (typeof val === "number") return new Date(val);
            return fecha.parse(val, format);
        }
    }
}

describe('Schema Class Test', function(){
    describe('format()', function(){
        it('传入数据字段为空（或未定义）时应当返回默认值', function(){
            const format = {id: { type: Number, default: 3 }};
            const data = Schema.format({}, format);
            assert.equal(data.id, 3);
        })
        it('数据字段类型应当是设定的类型', function () {
            const format = { id: { type: String, default: null } };
            const data = Schema.format({ id:1 }, format);
            assert.isString(data.id, '类型不一致');
        })
        it('应当保留所有数据字段', function () {
            const format = {
                id: { type: String, default: null },
                sex: { type: String, default: 0 },
            };
            const data = Schema.format({ id: 1, sex: 1, nickname: "Packy" }, format);
            assert.isDefined(data.nickname, "nickname字段应该保留");
        })
        it('处理字段的值与默认值一致时应当不处理', function () {
            const format = {
                id: { type: String, default: null },
                sex: { type: String, default: 0 },
                created_at: { type: Date, default: null }
            };
            const data = Schema.format({ id: 1, sex: 1, nickname: "Packy", created_at: null }, format);
            assert.equal(data.created_at, null, "created_at应该为null");
        })
        it('支持自定义类型转换', function () {
            const format = {
                created_at: { type: DateFormat.format('YYYY-MM-DD HH:mm:ss'), default: '' }
            };
            const data = Schema.format({ id: 1, sex: 1, nickname: "Packy", created_at: Date.now() }, format);
            assert.isString(data.created_at, "created_at字段应当被转义为String");
        })
    })
    describe('filter()', function () {
        it('应当只保留给定字段', function () {
            const data = Schema.filter({ id: 1, sex: 1, nickname: "Packy" }, ['id','sex']);
            assert.isUndefined(data.nickname, "nickname字段应该被过滤掉");
        })
    })
    describe('default()', function () {
        it('应当返回所以设定字段的默认值', function () {
            const format = {
                id: { type: String, default: 1 },
                sex: { type: String, default: 0 },
                nickname: { type: String, default: 'Packy' }
            };
            const data = Schema.default(format);
            assert.include(data, {id:1,sex:0,nickname:'Packy'});
        })
        it('支持defaul为函数', function () {
            const now = Date.now();

            const format = {
                id: { type: String, default: 1 },
                sex: { type: String, default: 0 },
                nickname: { type: String, default: 'Packy' },
                created_at: { type: Date, default:()=>now  }
            };
            const data = Schema.default(format);
            assert.include(data, { id: 1, sex: 0, nickname: 'Packy', created_at: now });
        })
    })
});

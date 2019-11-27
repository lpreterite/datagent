import fecha from "fecha";
import { serialize, format, filter } from '../../src/schema';

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
        it('没有定义给与默认值', function(){
            const fieldSet = {id: { type: Number, default: 3 }};
            const data = format({}, fieldSet);
            assert.equal(data.id, 3);
        })
        it('空值均给与默认值', function(){
            const fieldSet = {id: { type: Number, default: 3 }};
            const data = format({id: null}, fieldSet);
            assert.equal(data.id, 3);
        })
        it('数据字段类型应当是设定的类型', function () {
            const fieldSet = { id: { type: String, default: null } };
            const data = format({ id:1 }, fieldSet);
            assert.isString(data.id, '类型不一致');
        })
        it('应当保留所有数据字段', function () {
            const fieldSet = {
                id: { type: String, default: null },
                sex: { type: String, default: 0 },
            };
            const data = format({ id: 1, sex: 1, nickname: "Packy" }, fieldSet);
            assert.isDefined(data.nickname, "nickname字段应该保留");
        })
        it('支持自定义类型转换', function () {
            const fieldSet = {
                created_at: { type: DateFormat.format('YYYY-MM-DD HH:mm:ss'), default: '' }
            };
            const data = format({ id: 1, sex: 1, nickname: "Packy", created_at: Date.now() }, fieldSet);
            assert.isString(data.created_at, "created_at字段应当被转义为String");
        })
    })
    describe('filter()', function () {
        it('应当只保留给定字段', function () {
            const data = filter({ id: 1, sex: 1, nickname: "Packy" }, ['id','sex']);
            assert.isUndefined(data.nickname, "nickname字段应该被过滤掉");
        })
    })
    describe('serialize()', function () {
        it('应当返回所以设定字段的默认值', function () {
            const format = {
                id: { type: String, default: 1 },
                sex: { type: String, default: 0 },
                nickname: { type: String, default: 'Packy' }
            };
            const data = serialize(format);
            assert.include(data, {id:1,sex:0,nickname:'Packy'});
        })
        it('支持defaul值为函数', function () {
            const now = Date.now();

            const format = {
                id: { type: String, default: 1 },
                sex: { type: String, default: 0 },
                nickname: { type: String, default: 'Packy' },
                created_at: { type: Date, default:()=>now  }
            };
            const data = serialize(format);
            assert.include(data, { id: 1, sex: 0, nickname: 'Packy', created_at: now });
        })
    })
});

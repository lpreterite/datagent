function value(val){
    if(typeof val === 'function') return val()
    return val
}
const isNull = val=>!val

export function serialize(fieldSet){
    return Object.keys(fieldSet).reduce((result,field)=>({...result, [field]:value(fieldSet[field].default)}), {})
}
export function format(data, fieldSet){
    const _defaults = serialize(fieldSet)
    return {
        ..._defaults,
        ...Object.keys(data).reduce((result, field)=>{
            const fieldVal = isNull(fieldSet[field]) ? data[field] : fieldSet[field].type(data[field])
            return {...result, [field]:isNull(fieldVal)?_defaults[field]:fieldVal}
        }, {})
    }
}
export function filter(data, fields){
    return fields.reduce((result, field)=>({...result, [field]:data[field]}), {})
}

/**
 * 数据模型，记录并提供数据格式化操作
 *
 * @param {*} [fieldSet={}] - 字段设定
 * @property {String[]} fields - 字段名称列表
 * @property {Object} fieldSet - 字段设定
 * @class
 * 
 * @example
 * import datagent from "datagent"
 * const userSchema = datagent.schema({
 *   id: { type: Number, default: null },
 *   username: { type: String, default: "" },
 *   nickname: { type: String, default: "" }
 * })
 * 
 * console.log(userSchema.fields)
 * // ['id', 'username', 'nickname']
 */
function Schema(fieldSet={}){ 
    fieldSet = {...fieldSet} 
    const _fields = Object.keys(fieldSet) 
 
    const context = {
        /**
         * 获得初次化的数据
         * @memberof Schema
         * @return {Object}
         * 
         * @example
         * const user = userSchema.serialize()
         * console.log(user)
         * // { id: null, username: "", nickname: "" }
         */
        serialize: ()=>serialize(fieldSet), 
        /**
         * 格式化数据，根据字段类型的设定转义数据
         * @memberof Schema
         * @param {Object} data - 原数据
         * @return {Object} 格式化后数据
         * 
         * @example
         * const user = userSchema.format({ id: "12345", username: "PackyTang", nickname: "packy" })
         * console.log(user)
         * // Id converted to numeric
         * // { id: 12345, username: "PackyTang", nickname: "packy" }
         */
        format: data=>format(data, fieldSet),
        /**
         * 过滤字段，移除所有未指定的字段数据
         * @memberof Schema
         * @param {Object} data - 原数据
         * @param {String[]} fields - 保留字段的列表
         * @return {Object} 过滤后数据
         * 
         * @example
         * const user = userSchema.filter({ id: "12345", username: "PackyTang", nickname: "packy" }, ['id','username'])
         * console.log(user)
         * // { id: "12345", username:"PackyTang" }
         */
        filter: (data, fields=_fields)=>filter(data, fields) 
    } 
 
    Object.defineProperties(
        context,
        {
            "fields":{ 
                get(){ 
                    return _fields 
                } 
            }, 
            "fieldSet":{ 
                get(){ 
                    return fieldSet 
                } 
            } 
        }
    ) 
 
    return Object.freeze(context)
}

const factory = (fieldSet={}) => new Schema(fieldSet)
export const constructor = Schema
export default factory
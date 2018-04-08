/**

{
    fields: {
        id: { type: Number, default: null },
        title: { type: String, default: '' },
        content: { type: String, default: '' },
        type: { type: String, default: '' },
    },
    methods: {
        filter($model, query){
            return $model.instance.get('/select', { params: query });
        },
        success($model, data){
            return $mode.instance.post('/success', data);
        },
        // in $model
        save($model, data){
            if($model.isNew(data)){
                return $model.instance.post('/', data);
            }else{
                return $model.instance.put('/', data);
            }
        }
    },
}

 */

const isDef = v => v !== undefined;
const isString = v => typeof v === 'string';
const isArray = v => v.constructor === Array;
const isFunction = v => v.constructor === Function;

class Modeler{
    constructor(options){
        options = options || {};
        this._operations = Object.assign({}, options.oper_operations);
    }
    create(options){
        options = options || {};
        const fields = options.fields;
        const methods = Object.assign(this._operations, options.methods);

        const constructor = function (options) {
            this._fields = fields;
            this._operations = methods;
            this.instance = options.instance;
            this.options = options || {};
        };

        const prototype = {};
        Object.keys(methods).forEach(methodName=>{
            const method = methods[methodName];
            prototype[methodName] = function(...arg){
                return method(this.options)(this, ...arg);
            }
        })
        constructor.prototype = prototype;

        return constructor;
    }
}

export default Modeler;
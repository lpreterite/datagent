export const isNew = data => !data.id;
export const getURL = (url, id, emulateIdKey) => emulateIdKey ? url : `${url}/${id}`;

export function ModelFactory(options) {
    //产出含有模型类
    //包含 Model.schema 静态方法
    const _schema = options.fields(Schema);
    class ProxyModel extends Model { };
    ProxyModel.prototype._name = options.name;
    ProxyModel.prototype._url = options.url;
    // 注册模型字段
    ProxyModel.prototype._schema = _schema;
    ProxyModel.schema = function (fields) {
        return _schema.format(fields);
    }
    const methods = { ...Object.getOwnPropertyDescriptors(Model.prototype), ...options.methods };
    // 注册方法
    Object.keys(methods).forEach(methodName => {
        if (methodName === 'constructor') return;
        const method = (ctx, next) => {
            methods[methodName]
                .apply(ctx.$model, ctx.args)
                .then(data => {
                    ctx.result = data;
                    next();
                });
        };
        const hooks = options.hooks(new Hooks(), _schema);
        ProxyModel.prototype[methodName] = function (...args) {
            return Queue.run(this, args, [
                ...hooks.getHooks(methodName, 'before'),
                method,
                ...hooks.getHooks(methodName, 'after'),
            ]);
        };
    })
    return ProxyModel;
}

/**
 * format code like that:
 * ```
 * {
 *   "id": { type: Number, default: null },
 *   "nickname": { type: String, default: "" },
 *   "emial": { type: String, default:"" },
 *   "password": { type: String, default:"" }
 * }
 * ```
 */
export function convert(data, format, opts={}) {
    let { fields } = opts;
    fields = typeof fields === 'undefined' ? [].concat(Object.keys(data), Object.keys(format)) : fields;
    
    const result = {};
    fields.forEach(fieldName => {
        const fieldSet = format[fieldName];
        if (!fieldSet) return result[fieldName] = data[fieldName];
        let fieldVal = data[fieldName];
        if (fieldSet.type === Array){
            return result[fieldName] = fieldVal ? fieldVal : [];
        }
        if (fieldVal === null || fieldVal === undefined) fieldVal = fieldSet.default;
        else fieldVal = fieldSet.type(fieldVal);
        if (result[fieldName] === fieldVal) return;
        result[fieldName] = fieldVal === NaN ? fieldSet.default : fieldVal;
    });
    return result;
}
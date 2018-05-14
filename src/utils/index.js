import Method from '../classes/Method.class';

export const isNew = data => !data.id;
export const getURL = (url, id, emulateIdKey) => emulateIdKey ? url : (url + (isDef(id) ? `/${id}` : ''));
export const isDef = val => typeof val !== 'undefined';
export const isArray = val => val.constructor === Array;
export const isNumber = val => val.constructor === Number;
export const defaults = (obj, defaults = {}) =>{
    const merge = (defaults, obj) => defaults.constructor === Array ? defaults.concat(obj) : Object.assign(defaults, obj);
    return isDef(obj) ? merge(defaults, obj) : defaults;
};

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
export function convert(format = {}, options){
    options = defaults(options, { format: false });
    return (data = {}, fields = [].concat(Object.keys(data), Object.keys(format)))=>{
        const result = {};
        fields.forEach(fieldName => {
            const fieldSet = format[fieldName];
            if (!fieldSet) return result[fieldName] = data[fieldName];
            result[fieldName] = options.format ? formatField(fieldSet.type, fieldSet.default)(data[fieldName]) : data[fieldName];
        });
        return result;
    }
}

export function formatField(to, defaultVal){
    return val=>{
        let result;
        if(!isDef(val)) result = defaultVal;
        else result = to(val);
        if (defaultVal === result) return result;
        if (isNumber(result) && result === NaN) result = defaultVal;
        if (result === null) result = defaultVal;
        return result;
    }
}

export function mapReceiveHook(hooks, options){
    options = defaults(options, { hooks: ['fetch', 'find'], abouts: ['after'] });
    return mapHooks(hooks, options)
}
export function mapSendHook(hooks, options) {
    options = defaults(options, { hooks:['save'], abouts:['before'] });
    return mapHooks(hooks, options)
}
export function mapHooks(hooks, options={}){
    if (!isDef(options.hooks)) throw new Error('The options must have hooks parameter in mapHooks');
    if (!isArray(options.hooks)) throw new Error('The options.hooks must be Array in mapHooks');
    if (!isDef(options.abouts)) throw new Error('The options must have abouts parameter in mapHooks');
    if (!isArray(options.abouts)) throw new Error('The options.abouts must be Array in mapHooks');
    const result = options.hooks.map(hookName => { return { [hookName]: {} } }).reduce(Object.assign);
    Object.keys(result).forEach(hookName=>{
        result[hookName] = options.abouts.map(hookName => { return { [hookName]: hooks } }).reduce(Object.assign);
    })
    return result;
}

export default {
    isNew,
    getURL,
    isDef,
    defaults,
    convert,
    mapSendHook,
    mapReceiveHook
};
import Method from '../classes/Method.class';
import Hooks from '../classes/Hooks.class';

export const isNew = data => !data.id;
export const getURL = (url, id, emulateIdKey) => emulateIdKey ? url : (url + (isDef(id) ? `/${id}` : ''));
export const isDef = val => typeof val !== 'undefined';
export const isArray = val => val.constructor === Array;
export const isNumber = val => val.constructor === Number;
export const defaults = (obj, defaults = {}) =>{
    const merge = (defaults, obj) => defaults.constructor === Array ? defaults.concat(obj) : Object.assign(defaults, obj);
    return isDef(obj) ? merge(defaults, obj) : defaults;
};

export const compose = (...list) => acc => list.reduce((acc, fn) => acc.then(fn), Promise.resolve(acc));

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
            if (isDef(data[fieldName])) result[fieldName] = data[fieldName];
            if (options.format && isDef(fieldSet)) result[fieldName] = formatField(fieldSet.type, fieldSet.default)(data[fieldName]);
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

export function mapReceiveHook(methods, options){
    options = defaults(options, Hooks.ReceiveBehaviour);
    return mapHooks(methods, options)
}
export function mapSendHook(methods, options) {
    options = defaults(options, Hooks.SendBehaviour);
    return mapHooks(methods, options)
}
export function mapHooks(methods, options={}){
    if (!isDef(options.methods)) throw new Error('The options must have methods parameter in mapHooks');
    if (!isArray(options.methods)) throw new Error('The options.methods must be Array in mapHooks');
    if (!isDef(options.hooks)) throw new Error('The options must have hooks parameter in mapHooks');
    if (!isArray(options.hooks)) throw new Error('The options.hooks must be Array in mapHooks');
    const result = options.methods.map(hookName => { return { [hookName]: {} } }).reduce(Object.assign);
    Object.keys(result).forEach(hookName=>{
        result[hookName] = options.hooks.map(hookName => { return { [hookName]: methods } }).reduce(Object.assign);
    })
    return result;
}

export default {
    isNew,
    getURL,
    isDef,
    defaults,
    convert,
    compose,
    mapSendHook,
    mapReceiveHook
};
export function awaitTo(promise) {
    return promise.then(data => {
        return [null, data];
    }).catch(err => [err]);
}
export function existError(compare, err){
    return (...vals)=>{
        if(!compare(...vals)){throw err}
    }
}
export const isDef = val => typeof val !== 'undefined'
export const isString = val => typeof val === 'string'
export const isArray = val => val.constructor === Array
export const isFunction = val => val.constructor === Function
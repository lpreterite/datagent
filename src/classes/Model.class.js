import { isNew, getURL, defaults, isDef } from "../utils/";
import Contact from './Contact.class';

export default class Model {
    constructor(options) {
        const name = this._name = options.name;
        if(!isDef(name) || typeof name != 'string'){
            throw new Error('options.name must be string in Model');
        }
        this._url = isDef(options.url) ? options.url : `/${name}`;
        if (!isDef(options.contact) || options.contact.constructor != Contact){
            throw new Error('options.contact must be Contact class in Model');
        }
        this._contact = options.contact;
        this._emulateIdKey = typeof options.emulateIdKey === 'undefined' ? false : options.emulateIdKey;
    }
    fetch(params, opts) {
        const { origin } = defaults(opts);
        return this.remote(origin).get(this._url, params);
    }
    find(id, opts) {
        const { origin } = defaults(opts);
        const params = this._emulateIdKey ? { [this._emulateIdKey]: id } : {};
        return this.remote(origin).get(getURL(this._url, id, this._emulateIdKey), params );
    }
    save(data, opts) {
        const { origin } = defaults(opts);
        const { id } = data;
        const url = getURL(this._url, id, this._emulateIdKey);
        console.log(isNew(data) ? 'post' : 'put', data);
        return this.remote(origin)[isNew(data) ? 'post' : 'put'](url, data);
    }
    destroy(id, opts) {
        const { origin } = defaults(opts);
        const params = this._emulateIdKey ? { [this._emulateIdKey]: id } : {};
        return this.remote(origin).delete(getURL(this._url, id, this._emulateIdKey), params);
    }
    delete(...args){
        return this.destroy(...args);
    }
    remote(name) {
        return this._contact.remote(name);
    }
    get contact(){
        return this._contact;
    }
}
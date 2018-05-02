import { isNew, getURL, defaults, isDef } from "../utils/";
import Contact from './Contact.class';

export default class Model {
    constructor(options) {
        this._url = options.url;
        this._name = options.name;
        if (typeof options.contact == 'undefined' || options.contact.constructor != Contact){
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
        return this.remote(origin)[isNew(data) ? 'post' : 'put'](url, data);
    }
    delete(id, opts) {
        const { origin } = defaults(opts);
        const params = this._emulateIdKey ? { [this._emulateIdKey]: id } : {};
        return this.remote(origin).delete(getURL(this._url, id, this._emulateIdKey), params);
    }
    remote(name) {
        return this._contact.remote(name);
    }
    get contact(){
        return this._contact;
    }
}
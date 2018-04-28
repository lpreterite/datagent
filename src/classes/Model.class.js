import { isNew, getURL } from "../utils/";

class Model {
    constructor(options) {
        this._url = options.url;
        this._name = options.name;
        this._contact = options.contact;
        this._emulateIdKey = typeof options.emulateIdKey === 'undefined' ? false : options.emulateIdKey;
    }
    fetch(query, { origin }) {
        return this.remote(origin).get(this._url, { params: query });
    }
    find(id, { origin }) {
        return this.remote(origin).get(getURL(this._url, id, this._emulateIdKey), { params: this._emulateIdKey ? { [this._emulateIdKey]: id } : undefined });
    }
    save(data, { origin }) {
        return this.remote(origin)({ url: this._url, method: isNew(data) ? 'post' : 'put', data });
    }
    delete(id, { origin }) {
        return this.remote(origin).delete(getURL(this._url, id, this._emulateIdKey), { params: this._emulateIdKey ? { [this._emulateIdKey]: id } : undefined });
    }
    remote(name) {
        return this._contact.remote(name);
    }
}
import { isNew, getURL } from "utils/";

class Model {
    // 包含fetch, find, save, delete方法的基础模型类
    constructor(options) {
        this._url = options.url;
        this._name = options.name;
        this._remote = 'base';
        this._origins = options.remotes;
        this._emulateIdKey = typeof options.emulateIdKey === 'undefined' ? false : options.emulateIdKey;
    }
    fetch(query) {
        return this.contact.get(this._url, { params: query });
    }
    find(id) {
        return this.contact.get(getURL(this._url, id, this._emulateIdKey), { params: this._emulateIdKey ? { [this._emulateIdKey]: id } : undefined });
    }
    save(data) {
        return this.contact({ url: this._url, method: isNew(data) ? 'post' : 'put', data });
    }
    delete(id) {
        return this.contact.delete(getURL(this._url, id, this._emulateIdKey), { params: this._emulateIdKey ? { [this._emulateIdKey]: id } : undefined });
    }
    get contact() {
        return this._origins.get(this._remote);
    }
}
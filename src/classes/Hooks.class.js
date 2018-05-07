class Hooks {
    constructor() {
        this._map = new Map();
    }
    addHooks(key, operations) {
        const hooks = [].concat(this._map.get(key), operations);
        return this._map.set(key, hooks);
    }
    getHooks(key) {
        return this._map.get(key);
    }
    each(fn) {
        return this._map.forEach(fn);
    }
    get length() {
        return this._map.size;
    }
}

export default Hooks;
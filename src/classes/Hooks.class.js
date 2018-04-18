class Hooks {
    constructor() {
        this.map = new Map();
    }
    addHooks(method, about, operations) {
        const key = `${method}::${about}`;
        const hooks = [].concat(this.map.get(key), operations);
        return this.map.set(key, hooks);
    }
    getHooks(method, about) {
        const key = `${method}::${about}`;
        return this.map.get(key);
    }
}

export default Hooks;
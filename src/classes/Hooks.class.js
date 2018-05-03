class Hooks {
    constructor() {
        this._map = new Map();
    }
    addHooks(method, about, operations) {
        const key = `${method}::${about}`;
        const hooks = [].concat(this._map.get(key), operations);
        return this._map.set(key, hooks);
    }
    getHooks(method, about) {
        const key = `${method}::${about}`;
        return this._map.get(key);
    }
    each(fn) {
        return this._map.forEach(fn);
    }
    get length() {
        return this._map.size;
    }
    static merge(methodName, method, hooks) {
        const method = Hooks.wrapper(method);
        return function (...args) {
            return Queue.run(this, args, [
                ...hooks.getHooks(methodName, 'before'),
                method,
                ...hooks.getHooks(methodName, 'after'),
            ]);
        }
    }
    static wrapper(method) {
        return (ctx, next) => {
            return method
                .apply(ctx.$model, ctx.args)
                .then(data => {
                    ctx.result = data;
                    next();
                });
        }
    }
}

export default Hooks;
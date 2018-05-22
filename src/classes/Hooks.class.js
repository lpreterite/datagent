class Hooks {
    constructor() {
        this._map = new Map();
    }
    addHooks(key, operations) {
        return this._map.set(key, operations);
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

    static parse({ method, hook }, type = 'method'){
        let result = `${method}:${hook}`;
        if (type === 'behaviour') {
            if (Hooks.isReceiveBehaviour(method, hook)) result = 'receive';
            if (Hooks.isSendBehaviour(method, hook)) result = 'send';
        }
        return result;
    }

    static get ReceiveBehaviour(){
        return {
            methods: ['fetch','find'],
            hooks: ['after']
        }
    }
    static get SendBehaviour() {
        return {
            methods: ['save'],
            hooks: ['before']
        }
    }

    static isReceiveBehaviour(method, hook){
        if (typeof method !== 'string') throw new TypeError('The method must be string in isReceiveBehaviour()');
        if (typeof hook !== 'string') throw new TypeError('The hook must be string in isReceiveBehaviour()');
        return Hooks.ReceiveBehaviour.methods.indexOf(method) > -1 && Hooks.ReceiveBehaviour.hooks.indexOf(hook) > -1;
    }

    static isSendBehaviour(method, hook) {
        if (typeof method !== 'string') throw new TypeError('The method must be string in isSendBehaviour()');
        if (typeof hook !== 'string') throw new TypeError('The hook must be string in isSendBehaviour()');
        return Hooks.SendBehaviour.methods.indexOf(method) > -1 && Hooks.SendBehaviour.hooks.indexOf(hook) > -1;
    }
}

export default Hooks;
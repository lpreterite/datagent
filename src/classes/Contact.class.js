import Remote from './Remote.class';

export default class Contact {
    constructor() {
        this._remotes = {};
        this._default_remote = "";
    }
    remote(...args) {
        let name = args[0],
            remote = args[1],
            opts = { default: false, ...args[2] };
        if (args.length >= 2) {
            // set remote
            if (typeof name !== 'string') throw new Error('The first arguments must be String');
            if (remote.constructor !== Remote) throw new Error('The second arguments must be Remote');
            this._remotes[name] = remote;
            if (opts.default || this.length == 1) this.default(name);
        } else {
            // get remote
            remote = this._remotes[name ? name : this._default_remote];
            return remote;
        }
    }
    default(name) {
        if(typeof name !== 'string') throw new Error('The name must be string in default()');
        this._default_remote = name;
    }
    get length() {
        return Object.keys(this._remotes).length;
    }
}
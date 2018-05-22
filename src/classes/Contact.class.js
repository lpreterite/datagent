import Remote from './Remote.class';
import { defaults } from '../utils/';

export default class Contact {
    constructor() {
        this._remotes = {};
        this._default_remote = "";
    }
    remote(...args) {
        let name = args[0],
            remote = args[1],
            opts = defaults(args[2], { default: false });
        if (args.length >= 2) {
            // set remote
            if (typeof name !== 'string') throw new TypeError('The first arguments must be String');
            if (remote.constructor !== Remote) throw new TypeError('The second arguments must be Remote');
            this._remotes[name] = remote;
            if (opts.default || this.length == 1) this.default(name);
        } else {
            name = name ? name : this._default_remote;
            if (!this.has(name)) throw new RangeError(`Remote does not exist ${name} in remote()`);
            // get remote
            remote = this._remotes[name];
            return remote;
        }
    }
    default(name) {
        if(typeof name !== 'string') throw new TypeError('The name must be string in default()');
        if (!this.has(name)) throw new RangeError(`Remote does not exist ${name} in default()`);
        this._default_remote = name;
    }
    has(name) {
        return Object.keys(this._remotes).indexOf(name) !== -1;
    }
    get length() {
        return Object.keys(this._remotes).length;
    }
}
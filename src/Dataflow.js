import utils from './utils/';
import Model from './classes/Model.class';
import Hooks from './classes/Hooks.class';
import Contact from './classes/Contact.class';
import Remote from './classes/Remote.class';
import Schema from './classes/Schema.class';
import Queue from './classes/Queue.class';

const Dataflow = {};

function merge(opts={}) {
    const { method, scope, before = [], after = [] } = opts;
    return function (...args) {
        return Queue.run([
            ...before,
            method,
            ...after,
        ])(args, { scope });
    }
}

export function ModelFactory(options) {
    const methods = {
        'fetch': Model.prototype.fetch,
        'find': Model.prototype.find,
        'save': Model.prototype.save,
        'delete': Model.prototype.delete,
        ...options.methods
    }
    //RichModel
    class ProxyModel extends Model{
        constructor(opts){
            opts = utils.defaults(opts);
            opts.name = options.name;
            super(opts);
            this.initHooks(options.hooks);
        }
        initHooks(options){
            this._hooks = HooksFactory(options);
        }
        // exec(methodName, opts){
        //     let { before, after } = utils.defaults(opts, { before:[], after: [] });

        //     before = [].concat(utils.defaults(this._hooks.getHooks(`${methodName}::before`), []), utils.defaults(before, []));
        //     after = [].concat(utils.defaults(this._hooks.getHooks(`${methodName}::after`), []), utils.defaults(after, []));

        //     const method = utils.methods.wrapper(this[methodName]);
        //     console.log(methodName, method, before, after);
        //     return (...arg)=>{
        //         return utils.methods.mergeHooks(methodName, method, before, after)(...arg)
        //     };
        // }
    }
    ProxyModel.schema = ProxyModel.prototype.schema = new Schema(options.fields);
    
    // const hooks = HooksFactory(options.hooks);

    Object
        .keys(methods)
        .forEach(methodName => {
            const method = utils.methods.wrapper(methods[methodName]);
            ProxyModel.prototype[methodName] = function (...args){
                let before = utils.defaults(this._hooks.getHooks(`${methodName}::before`), []);
                let after = utils.defaults(this._hooks.getHooks(`${methodName}::after`), []);
                return merge({ method, scope: this, before, after })(...args);
            }
        });

    // // 重写fetch,find,save,delete方法支持hook处理
    // ['fetch', 'find', 'save', 'delete'].forEach(methodName => {
    //     ProxyModel.prototype[methodName] = function (...args) {
    //         return this.exec(methodName, args);
    //     };
    // })
    
    // Object
    //     .keys(methods)
    //     .forEach(methodName=>{
    //         const method = utils.methods.wrapper(methods[methodName]);
    //         ProxyModel.prototype[methodName] = utils.methods.merge(
    //             methodName,
    //             method,
    //             hooks
    //         )
    //     });

    return ProxyModel;
}

export function ContactFactory(remotes = {}, defaults = 'base') {
    const contact = new Contact();
    Object.keys(remotes).forEach((remoteName, index) => {
        contact.remote(remoteName, new Remote({ origin: remotes[remoteName] }), { default: index == 0 });
    })
    return contact;
}

export function HooksFactory(options){
    const hooks = new Hooks();
    //解析hooks的逻辑，并添加hook记录
    
    Object
        .keys(utils.defaults(options))
        .forEach(hookName=>{
            const hook = options[hookName];
            Object.keys(hook).forEach(aboutName=>{
                hooks.addHooks(`${hookName}::${aboutName}`, hook[aboutName]);
            })
        });

    return hooks;
}

Dataflow.Contact = ContactFactory;
Dataflow.Model = ModelFactory;
Dataflow.Hooks = HooksFactory;

export default Dataflow;
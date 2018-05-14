import utils from './utils/';
import Model from './classes/Model.class';
import Hooks from './classes/Hooks.class';
import Contact from './classes/Contact.class';
import Remote from './classes/Remote.class';
import Schema from './classes/Schema.class';
import Method from './classes/Method.class';

export function ModelFactory(options) {
    const schema = new Schema(options.fields);
    const methods = {
        'fetch': Model.prototype.fetch,
        'find': Model.prototype.find,
        'save': Model.prototype.save,
        'delete': Model.prototype.delete,
        ...options.methods
    }
    //RichModel
    class RichModel extends Model{
        constructor(opts){
            opts = utils.defaults(opts);
            opts.name = options.name;
            super(opts);
            this.initHooks(options.hooks);
        }
        initHooks(options){
            this._hooks = HooksFactory(options);
        }
        get schema(){
            return schema;
        }
        static get schema(){
            return schema;
        }
    }
    Object
        .keys(methods)
        .forEach(methodName => {
            const method = Method.wrapper(methods[methodName]);
            RichModel.prototype[methodName] = function (...args){
                const opts = utils.defaults(args[args.length-1]);
                const hooks = utils.defaults(opts.hooks, { before: [], after: [] });

                before = Method.concat(hooks.before, this._hooks.getHooks(`${methodName}::before`));
                after = Method.concat(hooks.after, this._hooks.getHooks(`${methodName}::after`));

                return Method.merge({ method, scope: this, before, after })(...args);
            }
        });

    return RichModel;
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

const Dataflow = {
    Contact: ContactFactory,
    Model: ModelFactory,
    Schema,
    mapReceiveHook: utils.mapReceiveHook,
    mapSendHook: utils.mapSendHook,
};

export default Dataflow;
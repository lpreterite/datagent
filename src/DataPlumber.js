import utils from './utils/';
import operations from './utils/';
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
            // all hook action magic in here.
            RichModel.prototype[methodName] = function (...args){
                const opts = utils.defaults(args[args.length-1]);
                const hooks = utils.defaults(opts.hooks, { before: [], after: [] });

                const before = Method.concat(hooks.before, this._hooks.getHooks(`${methodName}::before`));
                const after = Method.concat(hooks.after, this._hooks.getHooks(`${methodName}::after`));

                const method = (ctx) => methods[methodName].apply(ctx.scope, ctx.args).then(data => {
                    ctx.hook = 'after';
                    ctx.result = data;
                    return Promise.resolve(ctx);
                });
                const ctx = { scope: this, method: methodName, hook: 'before' };

                return Method.generate([...before, method, ...after])(args, ctx);
            }
        });

    return RichModel;
}

export function ContactFactory(remotes = {}, defaults) {
    const contact = new Contact();
    Object.keys(remotes).forEach((remoteName, index) => {
        contact.remote(remoteName, new Remote({ origin: remotes[remoteName] }), { default: index == 0 });
    })
    if (defaults) contact.default(defaults);
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

const DataPlumber = {
    Contact: ContactFactory,
    Model: ModelFactory,
    Hooks: HooksFactory,
    Schema,
    mapReceiveHook: utils.mapReceiveHook,
    mapSendHook: utils.mapSendHook,
    operations
};

export default DataPlumber;
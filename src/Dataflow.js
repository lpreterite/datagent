import { defaults } from './utils/';
import Model from './classes/Model.class';
import Hooks from './classes/Hooks.class';

const Dataflow = {};

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
            super(opts);
            this.initHooks(options.hooks);
        }
        initHooks(hooks){
            this._hooks = HooksFactory(hooks);
        }
        get hooks(){
            return this._hooks;
        }
    }
    ProxyModel.name = options.name;
    ProxyModel.schema = ProxyModel.prototype.schema = new Schema(options.fields);
    
    Object
        .keys(methods)
        .forEach(methodName=>{
            ProxyModel.prototype[methodName] = (...arg)=>{
                return Hooks.merge(
                    methodName,
                    ProxyModel.prototype[methodName],
                    this.hooks
                )(...arg);
            }
        });

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
    return hooks;
}

Dataflow.Contact = ContactFactory;
Dataflow.Model = ModelFactory;

export default Dataflow;
# 使用场景

```js

class Remote { // 远端链接
    constructor(options){
        this._origin = options.origin;
    }
    get(){
        return this.origin.get();
    }
    post(){

    }
    put(){

    }
    delete(){

    }
    get origin(){
        return this._origin;
    }
}

class Contact { // 管理远端链接
    constructor(){
        this._remotes = {};
        this._default_remote = "";
    }
    remote(...args){
        let name = args[0],
            remote = args[1],
            opts = { default:false, ...args[2] };
        if(args.length > 2){
            // set remote
            if(typeof name !== 'string') throw new Error('The first arguments must be String');
            if(typeof remote === 'object' && remote.constructor === Remote) throw new Error('The second arguments must be Remote');
            this._remotes[name] = remote;
            if(opts.default || this.length == 1) this.default(remote);
        }else{
            // get remote
            remote = this._remotes[name ? name : this._default_remote];
            return remote;
        }
    }
    default(name){
        this._default_remote = name;
    }
    get lenght(){
        return Object.keys(this._remotes).length;
    }
}

const remotes = {
    'base': axios.create({ baseURL: '/' }),
    'test': axios.create({ baseURL: location.host+':8088/' }),
};

const testRemote = new Remote({ origin: remotes.test });

const contact = new Contact();
contact.remote('test', testRemote, {default:true});
contact.remote('test'); // get Test Remote
contact.remote(); // get default Remote, Test Remote is default

// 实际创建 contact
// in contact.js
export default Dataflow.Contact({
    'base': axios.create({ baseURL: '/' }),
    'test': axios.create({ baseURL: location.host+':8088/' }),
});
// 使用 contact
// 具体可看 UserModel
import contact from 'contact';
import UserModel from 'UserModel';
const $user = new UserModel({ contact });

export const isNew = data=>!data.id;
export const getURL = (url, id, emulateIdKey) => emulateIdKey ? url : `${url}/${id}`;
class Model { //支持多源操作
    // 包含fetch, find, save, delete方法的基础模型类
    constructor(options){
        this._url = options.url;
        this._name = options.name;
        this._contact = options.contact;
        this._emulateIdKey = typeof options.emulateIdKey === 'undefined' ? false : options.emulateIdKey;
    }
    fetch(query, {origin}){
        return this.remote(origin).get(this._url, { params: query });
    }
    find(id, {origin}){
        return this.remote(origin).get(getURL(this._url, id, this._emulateIdKey), { params: this._emulateIdKey ? { [this._emulateIdKey]: id } : undefined } );
    }
    save(data, {origin}){
        return this.remote(origin)({ url: this._url, method:isNew(data)?'post':'put', data });
    }
    delete(id, {origin}){
        return this.remote(origin).delete(getURL(this._url, id, this._emulateIdKey), { params: this._emulateIdKey ? { [this._emulateIdKey]: id } : undefined });
    }
    remote(name){
        return this._contact.remote(name);
    }
}

class LocalStorageModel extends Model {
    constructor(options){
    }

    fetch(){}
    find(){}
    save(){}
    delete(){}
}

class Schema {
    constructor(fields){
        this._fields = fields;
    }
    format(data){
        return this._convert(data, this._fields);
    }
    _convert(data, fields){
        return {}
    }
}

// hook
function convert(options){
    // options.field   需要格式化的字段
    // options.to      格式化方法
    const field = options.field;
    const format = options.to;
    return (ctx, next) => {
        const result = ctx.result;
        result[field] = format(result[field]);
        next();
    }
}

class Hooks {
    constructor(){
        this._map = new Map();
    }
    addHooks(method, about, operations){
        
    }
    getHooks(method, about){

    }
    each(fn){
        return this._map.forEach(fn);
    }
    static merge(methodName, method, hooks){
        const method = Hooks.wrapper(method);
        return function(...args){
            return Queue.run(this, args, [
                ...hooks.getHooks(methodName, 'before'),
                method,
                ...hooks.getHooks(methodName, 'after'),
            ]);
        }
    }
    static wrapper(method){
        return (ctx, next)=>{
            return method
                .apply(ctx.$model, ctx.args)
                .then(data=>{
                    ctx.result = data;
                    next();
                });
        }
    }
}

class Queue{
    static run($model, args, queues){
        const compose = require('koa-compose');
        return new Promise((resolve, reject) => {
            const queue = compose(queues);
            try{
                queue({ $model, args, result:null }, ctx=>resolve([null, ctx.result, ctx.$model]));
            }catch(e){
                reject([e, ctx.$model]);
            }
        });
    }
}

export function ContactFactory(remotes={}, defaults='base'){
    const contact = new Contact();
    Object.keys(remotes).forEach((remoteName, index)=>{
        contact.remote(remoteName, new Remote({ origin: remotes[remoteName] }), { default: index == 0 });
    })
    return contact;
}

export function ModelFactory(name, options){
    //产出含有模型类
    class ProxyModel{};
    ProxyModel.name = name;
    ProxyModel.url = isDef(options.url) ? options.url : `/${name}`;
    // 注册模型字段
    const schema = ProxyModel.schema = ProxyModel.prototype.schema = new Schema(options.fields);
    // model hooks ['fetch','find','save','delete'];
    // remote hooks ['get', 'post', 'put', 'patch', 'delete']
    // active hooks ['receive', 'send']
    const hooks = ProxyModel.hooks = ProxyModel.prototype.hooks = new Hooks();
    const special = ['receive', 'send'];
    Object.keys(hooks)
        .filter(methodName=>special.indexOf(methodName) > -1)
        .forEach(methodName=>{
            const { after, before } = hooks[methodName];
            hooks.addHooks(methodName, 'before', before);
            hooks.addHooks(methodName, 'after', after);
        })
    
    const methods = ['fetch','find','save','delete'];
    methods.forEach(methodName=>{
        ProxyModel.prototype[methodName] = Hooks.merge(
            methodName,
            (params,opts) => Model.fetch(ProxyModel.url, params, opts),
            hooks
        );
    });
    
    return ProxyModel;
}

export default { Model: ModelFactory, Contact: ContactFactory };

// const UserModel = ModelFactory({
//     name: 'user',
//     url: '/user',
//     fields(Schema){
//         return new Schema({
//             id: { type: Number, defaults: 0 },
//             nickname: { type: String, defaults: '' },
//             sex: { type: Number, defaults: '1' },
//             create_at: { type: String, defaults: Date.now() }
//         });
//     },
//     hooks(hooks, $schema){
//         // hooks: all, fethc, find, save, delete
//         // hooks 可定义别名如：all:after
//         // hooks 同时适用于下面的`methods`方法
        
//         // 获得数据后转换create_at字段类型
//         hooks.addHooks(['fetch','find'], 'after', [convert({ field:'create_at', to: Fecha.parse })]);
//         // 保存前保留定义字段，移除其他字段
//         hooks.addHooks('save', 'before', [keep({ fields:$schema.fields() })]);
//         return hooks;
//     },
//     methods: {
//         //其他额外方法
//     }
// });

// in UserModel.js
export default Dataflow.Model('user', {
    url: '/user',
    fields: {
        id: { type: Number, defaults: 0 },
        nickname: { type: String, defaults: '' },
        sex: { type: Number, defaults: '1' },
        create_at: { type: String, defaults: Date.now() }
    },
    hooks: {
        // 定义两种hook：receive接收数据, send发送数据
        // 接收数据hook将会添加至fetch, find之后, 发送数据hook将会添加至save之前
        "receive": [convert({ field:'create_at', to: Fecha.parse })],
        "send": [keep(['id','nickname','sex','create_at'])]
        //支持hooks包括：
        // - 基础的请求：get, post, put, patch, delete
        // - 基于模型的：fetch, find, save, delete
        // - 基于处理的：receive, send
    },
    methods: {
        ban(id){
            return this.save({ id, disabled: true });
        }
    }
});

import UserModel from 'UserModel';

UserModel.schema; // Schema instance
UserModel.schema.default(); // Schema instance.default()
UserModel.hooks; // Hooks instance
UserModel.name;

/** 直接使用 */
const $user = new UserModel({ contact });

$user.remote() // Contact instance.remote()
$user.contact // Contact instance

//所有接口统一返回Promise

//获取多份数据
$user.fetch({sex:1});
//异步获取多份数据
$user.fetch({sex:1}, {async:true});

//获取单份数据
$user.find(1);
//异步获取单份数据
$user.find(1, {async:true});

//存储数据
$user.save({ nickname:'Packy', sex:1 });
//异步存储数据
$user.save({ nickname:'Packy', sex:1 }, {async:true});

//删除数据
$user.delete(1);
//异步删除数据
$user.delete(1, {async:true});

//订阅数据更新，出现在socket情况下
$user.subscribe(data=>{
    this.list = data;
});
$user.unsubscribe();


/** 在Vue中使用 */
function ModelMixin(options){
    // options.storage //存储对象
    // options.modelPrefix //模型前缀
    // options.models //绑定的模型
    // options.contact //远端链接

    // 给vue组件生成并绑定模型类实例
}

export default {
    mixins: [
        StatusMixin('user')(['loading']),
        ModelMixin({ contact, models:{'user':UserModel} })
    ],
    mounted(){
        this.refresh();
    },
    beforeRouteUpdate(to, from, next){
        this.refresh();
        next();
    },
    data(){
        return {
            detail: UserModel.schema({
                sex: '0'
            })
        }
    },
    methods: {
        async refresh(){
            let err, user;
            this.user.loading = true;
            [err, user] = await this.$user.find(this.$route.params.id, {async:true});
            this.user.loading = false;
            if(err) return this.$msg('请求出错');
            this.detail = user;
        },
        async save(data){
            let err, user;
            this.user.loading = true;
            [err, user] = await this.$user.save(data, {async:true});
            this.user.loading = false;
            if(err) return this.$msg('存储出错');
            this.detail = user;
        }
    }
};
```
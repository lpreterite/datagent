import Queue from './queue';

export function ModelFactory({ fields, methods, hooks }){
    
    this.fields = fields;
    this.methods = methods;
    this.hooks = hooks;

    const factory = ()=>{};
    factory.prototype._fields = fields;
    factory.prototype = initMethods(factory.prototype, methods, hooks);

    return factory;
}

initMethods(prototype, methods, hooks){
    Object.keys(methods).forEach(method => {
        prototype[method] = function(...arg){
            return Queue.run([
                ...hooks[method].before,
                methods[method],
                ...hooks[method].after
            ])(this, ...arg);
        };
    });
    return prototype;
}
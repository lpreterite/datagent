export function agent(_models, options){
    const { contact, model_name="name" } = {...options}
    const MODEL_NAME = model_name
    const models = [].concat(_models).reduce((result, model)=>({...result, [model[MODEL_NAME]]:new model({ contact })}),{})

    const events = {
        error: err=>console.error(err),
        before: ctx=>ctx,
        after: (err, result, ctx)=>{}
    }
    function eventWrapper(result, fn, args){
        return fn(...args) || result
    }

    function active(model_name, action, query, options){
        options = {origin:"develop", ...options}
        let ctx = {model_name, action, query, options}
        ctx = eventWrapper(ctx, events.before, [ctx])
        return models[ctx.model_name][ctx.action](ctx.query, ctx.options)
            .then(data=>[null, data], err=>([err]))
            .then(([err, result])=>{
                if(err) events.error(err)
                events.after(err, result, ctx)
                return [err, result]  
            })
    }

    const context = {
        //operator
        active,
        fetch(model_name, query, options){ return active(model_name, "fetch", query, options) },
        find(model_name, query, options){ return active(model_name, "find", query, options) },
        save(model_name, query, options){ return active(model_name, "save", query, options) },
        destroy(model_name, query, options){ return active(model_name, "destroy", query, options) },
        on(event_name, cb){
            if(!events[event_name]) return false
            events[event_name] = cb
        }
    }

    Object.defineProperties(context, {
        "models":{
            get(){
                return models
            }
        }
    })

    return Object.freeze(context)
}
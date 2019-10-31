function Remote(origin){
    const sync = (options)=>{
        return origin(options);
    }
    const methods = {
        get: (url, params)=>sync({ method: 'GET', url, params }),
        post: (url, data)=>sync({ method: 'POST', url, data }),
        put: (url, data)=>sync({ method: 'PUT', url, data }),
        patch: (url, data)=>sync({ method: 'PATCH', url, data }),
        delete: (url, data)=>sync({ method: 'DELETE', url, data })
    }
    const context = {
        sync,
        ...methods
    }

    Object.defineProperties(context, {
        "origin":{
            get(){
                return origin
            }
        }
    })

    return Object.freeze(context)
}


const factory = origin => new Remote(origin)

export const constructor = Remote
export default factory
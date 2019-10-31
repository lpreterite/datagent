
function Context(options){
    const { scope, method, ..._opts } = {args:null, result:null, ...options}
    const context = {
        ..._opts
    }
    Object.defineProperties(context, {
        "scope":{
            get(){
                return scope
            }
        },
        "method":{
            get(){
                return method
            }
        }
    })
    return context
}

const factory = options => new Context(options)
export const constructor = Context
export default factory
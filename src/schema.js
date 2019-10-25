function value(val){
    if(typeof val === 'function') return val()
    return val
}

export function serialize(fieldSet){
    return Object.keys(fieldSet).reduce((result,field)=>({...result, [field]:value(fieldSet[field].default)}), {})
}
export function format(data, fieldSet){
    return {
        ...serialize(fieldSet),
        ...Object.keys(data).reduce((result, field)=>({...result, [field]:fieldSet[field].type(data[field])}), {})
    }
}
export function filter(data, fields){
    return Object.keys(fields).reduce((result, field)=>({...result, [field]:data[field]}), {})
}

function schema(fieldSet={}){
    fieldSet = {...fieldSet}
    const fields = Object.keys(fieldSet)

    const context = {
        serialize: ()=>serialize(fieldSet),
        format: data=>format(data, fieldSet),
        filter: (data, fields=fields)=>filter(data, fields)
    }

    Object.defineProperties(context, {
        "fields":{
            get(){
                return fields
            }
        },
        "fieldSet":{
            get(){
                return fieldSet
            }
        }
    })

    return Object.freeze(context)
}

export default schema
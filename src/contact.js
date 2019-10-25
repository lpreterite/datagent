export default function contact(remotes={}){
    let _default = null
    remotes = {...remotes}
    _default = Object.values(remotes).shift()

    const has = name=>Object.keys(remotes).indexOf(name) > -1
    const getRemote = name=>remotes[Object.keys(remotes).find(item=>item==name)]
    const setRemote = (name, remote)=>has(name) && (remotes[name]=remote)
    const setDefault = name=>_default=getRemote(name)
    const remote = (...args)=>{
        const [name, remote] = args
        if(args.lengt>1) setRemote(name, remote)
        else if(!name) return _default
        else return getRemote(name)
    }

    const context = {
        has,
        default: setDefault,
        remote
    }

    Object.defineProperties(context, {
        "default":{
            get(){
                return _default
            }
        }
    })

    return Object.freeze(context)
}
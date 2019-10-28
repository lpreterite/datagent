export default function contact(remotes={}){
    let _default = null
    remotes = {...remotes}
    _default = Object.values(remotes).shift()

    const has = name=>Object.keys(remotes).indexOf(name) > -1
    const getRemote = name=>remotes[Object.keys(remotes).find(item=>item==name)]
    const setRemote = (name, remote)=>(remotes[name]=remote)
    const setDefault = name=>_default=getRemote(name)
    const remote = (...args)=>{
        const [name, remote] = args
        if(args.length>1) setRemote(name, remote)
        else if(!name) return _default
        else return getRemote(name)
    }

    const context = {
        has,
        default:name=>!!name?setDefault(name):_default,
        remote
    }

    return Object.freeze(context)
}
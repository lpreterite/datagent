import { install } from "./install";
export default class VueModeler{
    static install;
    static version;

    constructor(options={}){
        if(typeof options.instance === 'undefined'){
            throw new Error('Instance in VueModeler is a must');
        }

        this.instance = options.instance;
        this.models = options.models;
        this.emulateIdKey = options.emulateIdKey;
    }

    init(app){

    }

    create(modelName){

    }
}

VueModeler.install = install;
VueModeler.version = '0.0.1';
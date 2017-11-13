export let _Vue;
export function install(Vue){
    if(install.installed && _Vue === Vue) return;
    install.installed = true;
    _Vue = Vue;

    const isDef = v => v !== undefined;

    Vue.mixin({
        beforeCreate(){
            if(isDef(this.$options.modeler)){
                this._modelerRoot = this;
                this._modeler = this.$options.modeler;
                this._modeler.init(this);
            }
        }
    });

    Vue.prototype.$$model = function(modelName){
        return this._modeler.create(modelName);
    };
}
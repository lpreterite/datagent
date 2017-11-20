/*
// actions
// params operations
function example({ convert, schame }){
    retrun ($model, ...arg)=>{
        // any
        return {}
        
        // promise
        return new Promise((resolve, reject)=>{...});
    }
}

// middleware
function convertSchame({ convert, schame }){
    return ($model, { fields })=>{
        // promise of queue
        return Queues.run([ convert(fields) ])(schame()($model));
    }
}
*/

function schame() {
    return ($model) => {
        const defaultsData = {};
        Object.keys($model._fields).forEach(fieldName => {
            defaultsData[fieldName] = $model._fields[fieldName].default;
        });
        return defaultData;
    }
}

module.exports = {
    schame
};
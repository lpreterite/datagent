function fetch(){
    return ($model, params)=>{
        return $model.get('/search', { params });
    }
}

function find({ emulateIdKey }){
    return ($model, id)=>{
        const path = emulateIdKey ? '/' : '/'+id;
        const params = emulateIdKey ? { id } : undefined;
        return $model.get(path, { params });
    }
}

function save({ emulateIdKey }){
    return ($model, data)=>{
        const { id } = data;
        const isNew = !!id;
        const path = isNew ? '/' : ( emulateIdKey ? '/' : '/' + id );
        const method = isNew ? 'post' : 'put';
        return $model[method](path, data);
    }
}

function destroy({ emulateIdKey }){
    return ($model, id) => {
        const path = emulateIdKey ? '/' : '/' + id;
        const params = emulateIdKey ? { id } : undefined;
        return $model.del(path, { params });
    }
}

module.exports = {
    fetch,
    find,
    save,
    destroy
}
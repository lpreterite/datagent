function get (){
    return ($model, ...args) => {
        return $model.instance.get(path, ...args);
    }
}

function post() {
    return ($model, ...args) => {
        return $model.instance.post(path, ...args);
    }
}

function del() {
    return ($model, ...args) => {
        return $model.instance.delete(path, ...args);
    }
}

function patch() {
    return ($model, ...args) => {
        return $model.instance.patch(path, ...args);
    }
}

function put() {
    return ($model, ...args) => {
        return $model.instance.put(path, ...args);
    }
}


module.exports = {
    get,
    post,
    del,
    patch,
    put
};
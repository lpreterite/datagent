function get (){
    return ($model, ...args) => {
        return $model.instance.get(...args);
    }
}

function post() {
    return ($model, ...args) => {
        return $model.instance.post(...args);
    }
}

function del() {
    return ($model, ...args) => {
        return $model.instance.delete(...args);
    }
}

function patch() {
    return ($model, ...args) => {
        return $model.instance.patch(...args);
    }
}

function put() {
    return ($model, ...args) => {
        return $model.instance.put(...args);
    }
}


module.exports = {
    get,
    post,
    del,
    patch,
    put
};
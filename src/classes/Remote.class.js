export default class Remote {
    constructor(options) {
        this._origin = options.origin;
    }
    get(url, params) {
        return this.sync({
            url,
            method: 'GET',
            params
        });
    }
    post(url, data) {
        return this.sync({
            method: 'POST',
            url,
            data
        });
    }
    put(url, data) {
        return this.sync({
            method: 'PUT',
            url,
            data
        });
    }
    patch(url, data) {
        return this.sync({
            method: 'PATCH',
            url,
            data
        });
    }
    delete(url, data) {
        return this.sync({
            method: 'DELETE',
            url,
            data
        });
    }
    sync(options){
        return this._origin(options);
    }
    get origin() {
        return this._origin;
    }
}
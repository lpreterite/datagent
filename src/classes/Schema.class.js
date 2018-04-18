import { convert } from "utils/";

class Schema {
    constructor(fields) {
        this._fields = fields;
    }
    format(data) {
        return this.convert(data, this._fields);
    }
}
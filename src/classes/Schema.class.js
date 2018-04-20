import { convert } from "../utils/";

export default class Schema {
    constructor(fields) {
        this._fields = fields;
    }
    format(data) {
        return convert(data, this._fields);
    }
    static format(data, fields){
        return convert(data, fields);
    }
}
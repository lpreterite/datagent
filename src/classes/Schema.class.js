import { convert } from "../utils/";

export const format = (data, fields) => convert(data, fields);
export const filter = (data, fields) => convert(data, fields, { fields: Object.keys(fields) });
export const schema = fields => convert({}, fields, { fields: Object.keys(fields) });

export default class Schema {
    constructor(fields) {
        this._fields = fields;
    }
    format(data) {
        return format(data, this._fields);
    }
    filter(data){
        return filter(data, this._fields);
    }
    default(){
        return schema(this._fields);
    }
    static format(data, fields){
        return format(data, fields);
    }
    static filter(data, fields) {
        return filter(data, fields);
    }
    static default(fields) {
        return schema(fields);
    }

    get fields(){
        return this._fields;
    }
}
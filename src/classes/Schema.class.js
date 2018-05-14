import { convert } from "../utils/";

export const format = (data, fieldSet) => convert(fieldSet, { format:true })(data);
export const filter = (data, fields) => convert()(data, fields);
export const schema = fieldSet => convert(fieldSet, { format: true })({}, Object.keys(fieldSet));

export default class Schema {
    constructor(fieldSet) {
        this._fieldSet = fieldSet;
    }
    format(data) {
        return format(data, this._fieldSet);
    }
    filter(data, fields = Object.keys(this._fieldSet)){
        return filter(data, fields);
    }
    default(){
        return schema(this._fieldSet);
    }
    static format(data, fieldSet){
        return format(data, fieldSet);
    }
    static filter(data, fields) {
        return filter(data, fields);
    }
    static default(fieldSet) {
        return schema(fieldSet);
    }

    get fields(){
        return this._fieldSet;
    }
}
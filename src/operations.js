import { convert } from "./utils/";

export function convert(options) {
    // options.field   需要格式化的字段
    // options.to      格式化方法
    const field = options.field;
    const format = options.to;
    return (ctx, next) => {
        const result = ctx.result;
        result[field] = format(result[field]);
        next();
    }
}

export function keep(...fields) {
    return (ctx, next)=>{
        const obj = {};
        fields
            .filter(fieldName => ctx.result.hasOwnProperty(fieldName))
            .forEach(fieldName => obj[fieldName] = result[fieldName]);
        ctx.result = convert(ctx.result, fieldsSet);
        next();
    }
}
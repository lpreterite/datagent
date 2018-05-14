import { defaults, isDef } from "../utils/";
import Schema from "../classes/Schema.class";

export function format() {
    return (ctx, next) => {
        ctx.result = ctx.scope.schema.format(ctx.result);
        next();
    }
}

export function filter(fields){
    return (ctx, next) => {
        ctx.result = ctx.scope.schema.filter(ctx.result, fields);
        next();
    }
}

export function formatFor(field, schema){
    return (ctx, next) => {
        if (isDef(ctx.result[field])) ctx.result[field] = schema.format(ctx.result[field]);
        else ctx.result[field] = schema.defaults();
        next();
    }
}

export function filterFor(field, fields) {
    return (ctx, next) => {
        if (isDef(ctx.result[field])) ctx.result[field] = Schema.format(ctx.result[field], fields);
        next();
    }
}
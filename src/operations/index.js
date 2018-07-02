import { defaults, isDef, isArray } from "../utils/";
import Schema from "../classes/Schema.class";
import Hooks from "../classes/Hooks.class";

export function respondData() {
    return (ctx)=>{
        const res = ctx.result;
        if(res.status < 200){
            const err = new Error(res.message);
            err.respose = res.response;
            throw err
        };
        ctx.result = res.data;
        return Promise.resolve(ctx);
    }
}

export function format(schema) {
    return (ctx) => {
        schema = isDef(schema) ? schema : ctx.scope.schema;
        switch (ctx.hook) {
            case 'after':
                if (isDef(ctx.result) && isArray(ctx.result)) {
                    ctx.result = ctx.result.map(item => schema.format(item));
                } else {
                    ctx.result = schema.format(ctx.result);
                }
                break;
            case 'before':
                const data = ctx.args.shift();
                ctx.args = [schema.format(data), ...ctx.args];
                break;
        }
        return Promise.resolve(ctx);
    }
}

export function filter(fields){
    return (ctx) => {
        switch (ctx.hook) {
            case 'after':
                if (isDef(ctx.result) && isArray(ctx.result)) {
                    ctx.result = ctx.result.map(item => ctx.scope.schema.filter(item, fields));
                } else {
                    ctx.result = ctx.scope.schema.filter(ctx.result, fields);
                }
                break;
            case 'before':
                const data = ctx.args.shift();
                ctx.args = [ctx.scope.schema.filter(data, fields), ...ctx.args];
                break;
        }
        return Promise.resolve(ctx);
    }
}

export function formatFor(field, schema){
    return (ctx) => {
        schema = isDef(schema) ? schema : ctx.scope.schema;
        switch (ctx.hook) {
            case 'after':
                if (isArray(ctx.result)){
                    ctx.result = ctx.result.map(item =>{
                        item[field] = isDef(item[field]) ? Schema.format(item[field], schema.fieldSet) : schema.default();
                        return item;
                    });
                }else{
                    ctx.result[field] = isDef(ctx.result[field]) ? Schema.format(ctx.result[field], schema.fieldSet) : schema.default();
                }
                break;
            case 'before':
                const data = ctx.args.shift();
                if (isDef(data[field])) data[field] = Schema.format(data[field], schema.fieldSet);
                else data[field] = schema.default();
                ctx.args = [data, ...ctx.args];
                break;
        }
        return Promise.resolve(ctx);
    }
}

export function filterFor(field, fields) {
    return (ctx) => {
        switch (ctx.hook) {
            case 'after':
                if (isArray(ctx.result)) {
                    ctx.result = ctx.result.map(item => {
                        item[field] = isDef(item[field]) ? Schema.filter(item[field], fields) : item[field];
                        return item;
                    });
                } else {
                    ctx.result[field] = isDef(ctx.result[field]) ? Schema.filter(ctx.result[field], fields) : ctx.result[field];
                }
                break;
            case 'before':
                const data = ctx.args.shift();
                if (isDef(data[field])) data[field] = Schema.filter(data[field], fields);
                ctx.args = [data, ...ctx.args];
                break;
        }
        return Promise.resolve(ctx);
    }
}

export function getField(fieldName, action) {
    return async ctx => {
        switch (ctx.hook){
            case 'after':
                if (isDef(ctx.result[fieldName])){
                    const fieldVal = ctx.result[fieldName]
                    const _ctx = await action({ ...ctx, result: fieldVal })
                    ctx.result[fieldName] = _ctx.result
                }
                break;
            case 'before':
                const data = ctx.args.shift();
                if (isDef(data[fieldName])) {
                    const fieldVal = data[fieldName]
                    const _ctx = await action({ ...ctx, args: [fieldVal] })
                    data[fieldName] = _ctx.args[0]
                    ctx.args = [data, ...ctx.args]
                }
                break;
        }
        return Promise.resolve(ctx)
    }
}
import { defaults, isDef } from "../utils/";
import Schema from "../classes/Schema.class";
import Hooks from "../classes/Hooks.class";

export function requestData() {
    return (ctx)=>{
        const res = ctx.result;
        if(res.status < 200) throw new Error('ajax error');
        ctx.result = res.data;
        return Promise.resolve(ctx);
    }
}

export function awaitTo(promise) {
    return promise.then(data => {
        return [null, data];
    }).catch(err => [err]);
}

export function format() {
    return (ctx) => {
        const hook = Hooks.parse(ctx, 'behaviour');
        switch (hook) {
            case 'receive':
                ctx.result = ctx.scope.schema.format(ctx.result);
                break;
            case 'send':
                const data = ctx.args.pop();
                ctx.args = [ctx.scope.schema.format(data), ...ctx.args];
                break;
            default:
                throw new Error(`The format operation must use in ${hook}.`);
        }
        return Promise.resolve(ctx);
    }
}

export function filter(fields){
    return (ctx) => {
        const hook = Hooks.parse(ctx, 'behaviour');
        switch (hook) {
            case 'receive':
                ctx.result = ctx.scope.schema.filter(ctx.result, fields);
                break;
            case 'send':
                const data = ctx.args.pop();
                ctx.args = [ctx.scope.schema.filter(data, fields), ...ctx.args];
                break;
            default:
                throw new Error(`The filter operation must use in ${hook}.`);
        }
        return Promise.resolve(ctx);
    }
}

export function formatFor(field, schema){
    return (ctx) => {
        const hook = Hooks.parse(ctx, 'behaviour');
        switch (hook) {
            case 'receive':
                if (isDef(ctx.result[field])) ctx.result[field] = Schema.format(ctx.result[field], schema.fieldSet);
                else ctx.result[field] = schema.defaults();
                break;
            case 'send':
                const data = ctx.args.pop();
                if (isDef(data[field])) data[field] = Schema.format(data[field], schema.fieldSet);
                else data[field] = schema.defaults();
                ctx.args = [data, ...ctx.args];
                break;
            default:
                throw new Error(`The formatFor operation must use in ${hook}.`);
        }
        return Promise.resolve(ctx);
    }
}

export function filterFor(field, fields) {
    return (ctx) => {
        if (isDef(ctx.result[field])) ctx.result[field] = Schema.filter(ctx.result[field], fields);
        return Promise.resolve(ctx);
    }
    return (ctx) => {
        const hook = Hooks.parse(ctx, 'behaviour');
        switch (hook) {
            case 'receive':
                if (isDef(ctx.result[field])) ctx.result[field] = Schema.filter(ctx.result[field], fields);
                break;
            case 'send':
                const data = ctx.args.pop();
                if (isDef(data[field])) data[field] = Schema.filter(data[field], fields);
                ctx.args = [data, ...ctx.args];
                break;
            default:
                throw new Error(`The filterFor operation must use in ${hook}.`);
        }
        return Promise.resolve(ctx);
    }
}
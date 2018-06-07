import Hooks from '../src/classes/Hooks.class';
import Datagent from '../src/datagent';

describe('Hooks Class Test', () => {
    let hooks, opts;
    before(() => {
        opts = {
            fetch: {
                after: [() => console.log('some')]
            },
            save: {
                before: [() => console.log('some')]
            }
        };
    });
    describe('Hooks.parse()', () => {
        it('应当输出字符', ()=>{
            const ctx = { method: 'fetch', hook:'after' };
            const result = Hooks.parse(ctx);
            assert.typeOf(result, 'string');
        })
        it('应当以"[method]:[hook]"形式输出结果', ()=>{
            const ctx = { method: 'fetch', hook: 'after' };
            const result = Hooks.parse(ctx);
            assert.equal(result, "fetch:after");
        })
        it('当第二参数type输入值为"behaviour"时，应当以"receive"或"send"输出结果其中结果', () => {
            const ctx = { method: 'fetch', hook: 'after' };
            const result = Hooks.parse(ctx, 'behaviour');
            assert.equal(result, "receive");
        })
    })
    describe('Hooks.isReceiveBehaviour()', () => {
        beforeEach(() => {
            hooks = Datagent.Hooks(opts);
        })
        it('传入参数method应当为string', () => {
            try {
                Hooks.isReceiveBehaviour(233, 'after');
            } catch (e) {
                assert.equal(e.constructor, TypeError, e.msg);
            }
        })
        it('传入参数hook应当为string', () => {
            try {
                Hooks.isReceiveBehaviour('fetch', 233);
            } catch (e) {
                assert.equal(e.constructor, TypeError, e.msg);
            }
        })
    })
    describe('Hooks.isSendBehaviour()', () => {
        beforeEach(() => {
            hooks = Datagent.Hooks(opts);
        })
        it('传入参数method应当为string', () => {
            try {
                Hooks.isSendBehaviour(233, 'after');
            } catch (e) {
                assert.equal(e.constructor, TypeError, e.msg);
            }
        })
        it('传入参数hook应当为string', () => {
            try {
                Hooks.isSendBehaviour('fetch', 233);
            } catch (e) {
                assert.equal(e.constructor, TypeError, e.msg);
            }
        })
    })
})
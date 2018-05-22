import Hooks from '../src/classes/Hooks.class';
import Dataflow from '../src/Dataflow';

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
    describe('Dataflow.Hooks()', () => {
        beforeEach(()=>{
            hooks = Dataflow.Hooks(opts);
        })
    })
    describe('instance.getHooks()', () => {

    })
    describe('instance.each()', () => {

    })
    describe('instance.length', () => {

    })
    describe('Hooks.parse()', () => {

    })
    describe('Hooks.isReceiveBehaviour()', () => {
        beforeEach(() => {
            hooks = Dataflow.Hooks(opts);
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
            hooks = Dataflow.Hooks(opts);
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
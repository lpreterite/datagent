export * from './operations/';
export * from './datagent';

import { mapReceiveHook, mapSendHook } from './utils/';
import Datagent from './datagent';
export {
    mapReceiveHook,
    mapSendHook
}
export default {
    ...Datagent,
    mapReceiveHook,
    mapSendHook
}
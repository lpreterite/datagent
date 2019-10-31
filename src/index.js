import * as hooks from "./operations"
import * as utils from "./utils/"
import { default as model, constructor as Model } from "./model"
import { default as contact, constructor as Contact } from "./contact"
import { default as schema, constructor as Schema } from "./schema"
import { default as agent, constructor as Agent } from "./agent"
import { default as context, constructor as Context } from "./context"
const classes = { Model, Contact, Schema, Agent, Context }
const constructors = classes
export { hooks, utils, model, contact, schema, agent, context, classes, constructors }
export default { utils, hooks, model, contact, schema, agent, context, classes, constructors }
# js-dataflow

This is a simple front-end data flow application support

It has the following features

- Support definition and processing fields
- Support requests for different remote services
- Provide pre- or post-processing for each method
- Use axis for request processing

## Quick Start

```js
// import
import axios from "axios";
import { Model, Contact } from "lpreterite/js-dataflow";

// Create link
const contact = Contact({
    base: axios.create({ baseURL: '/api' })
});

// Define the model
const UserModel = Model({
    name: 'user',
    fields: {
        id: { type: Number, defaults: 0 },
        nickname: { type: String, defaults: '' },
        sex: { type: Number, defaults: '1' },
        create_at: { type: String, defaults: Date.now() },
        disabled: { type: Number, defaults: 0 }
    },
    methods: {
        ban(id, opts) {
            return this.save({ id, disabled: 1 }, opts);
        },
        errorTest() {
            throw new Error('just a bug');
        }
    }
});

// Create model
model = new UserModel({ name: 'user', url: '/users', contact });

async function(){
    // Send GET request
    const users = await model.fetch({ disabled: 0 });
    // Send GET request with id
    const Tony = await model.find(233);
    // Send POST request
    const res = await model.save({ name:"Ben", disabled: 0 });
    // With id, send PUT request with id
    const res = await model.save({ id:233, name:"Tony", disabled: 1 });
    // Send a DELETE request with id
    const res = await model.delete(233);
}()
```

Follow-up documents to be updated...
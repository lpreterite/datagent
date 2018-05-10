# example

```js
import Vue from 'vue';
import VueModeler from 'vue-restful-model';
import axios from 'axios';

Vue.use(VueModeler);

const modeler = new VueModeler({
    instance: axios.create({
        baseURL: 'https://some-domain.com/api/',
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
    }),
    emulateIdKey: false,
    models: {
        'Article': {
            fields: {
                id: { type: Number, default: null },
                title: { type: String, default: '' },
                content: { type: String, default: '' },
                type: { type: String, default: '' },
            },
            methods: {
                // find: ['get'], // get is base method in axios
                // fetch: ['get'], // this funciton can set itself
                // save: ['save'],
                // destroy: ['delete'],
                filter($model, query){
                    return $model.instance.get('/select', { params: query });
                },
                success($model, data){
                    return $mode.instance.post('/success', data);
                },
                // in $model
                save($model, data){
                    if($model.isNew(data)){
                        return $model.instance.post('/', data);
                    }else{
                        return $model.instance.put('/', data);
                    }
                }
            },
            // 钩子， 根据方法调用前后钩子进行处理数据
            hooks: {
                before: {
                    save: [filter(['id','title','content'])]
                },
                after: {
                    get: [
                        function(json, xhr){
                            if(data.code > 300){
                                return Promise.resolve(json.data);
                            }else{
                                return Promise.reject(new Error('abc'));
                            }
                        }
                    ],
                    fetch: [
                        filter(['id', 'title', 'content']),
                        convert(['id', 'title', 'content']),
                        convert({
                            'id': Number,
                            'title': String,
                            'content': function(content){
                                return content+'<p>123</p>';
                            }
                        })
                    ]
                }
            }
        }
    }
});

const app = new Vue({
    name: 'root',
    el: '#app',
    template: '<section></section>',
    modeler,
    created(){
        this.$Article = this.$$model('Article');
    },
    data(){
        return {
            detail: this.$Article.schema();
        }
    },
    methods: {
        async save(data){
            try{
                this.$Article.save(data);
            }catch(e){
                alert(e.message);
            }
        }
    }
});

export default app;
```
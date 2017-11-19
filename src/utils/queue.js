export class Queue{
    static run(queues){

        return (data)=>{
            console.log("++++++++ test start +++++++++");
            
            function* gen (time) {
                try {
                    for (let pending = 0; pending < queues.length; pending++) {
                        const queue = queues[pending];
                        const result = yield queue(data);
                        console.log(pending);
                    }
                } catch (e) {
                    console.log(e);
                }
            };

            function run(g) {
                var it = g();

                function go(result) {
                    console.log(result);
                    if (result.done) {
                        return result.value;
                    }

                    return result.value.then(function (value) {
                        return go(it.next(value));
                    }, function (err) {
                        return go(it.throw(value));
                    });
                }

                go(it.next());
            };

            console.log(gen);
            run(gen);

            console.log("++++++++ test end +++++++++");
            return Promise.resolve();
        }

        return ()=>{
            return new Promise((resolve, reject) => {
                var pending = 0;
                function* next(data) {
                    var result = queues[pending++](data);
                    if (result.constructor === Error) reject(result);
                    if (pending >= queues.length) resolve(result);
                    yield next;
                }
            });
        }
    }
}
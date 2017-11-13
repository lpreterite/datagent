class Queue{
    static run(queues){    
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

module.exports = module.Queue = Queue;
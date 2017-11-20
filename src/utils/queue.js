class Queue{
    static run(queues){
        var pending = 0;
        function next(result) {
            return new Promise(function (resolve, reject) {
                if (result.constructor === Error) return reject(result);
                if (pending >= queues.length) return resolve(result);
                var promise = queues[pending++](result);
                if (promise && promise.then && typeof promise.then == 'function') {
                    resolve(promise.then(next, next));
                }
            });
        }

        return next;
    }
}

module.exports = Queue;
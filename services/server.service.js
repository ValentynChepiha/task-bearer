const { performance } = require('perf_hooks');
const fetch = require('node-fetch');

class ServerService {

    async getLatencyServer(url = 'http://google.com'){
        const t0 = performance.now();
        return fetch(url)
            .then(res => res.text())
            .then(data => {
                const  t1 = performance.now();
                return t1 - t0;
            });
    }

}

module.exports = new ServerService();
const fetch = require("node-fetch");

class RestManager {

    constructor() {
        throw new Error("Cannot instantiate RestManager class.");
    }

    /**
     * Create POST request
     * @param {String} url url to post
     * @param {data} data data
     */
    static post(url, data) {
        const params = {
            method: "POST",
            headers: data.headers,
            body: typeof data.body !== "string" ? JSON.stringify(data.body) : data.body
        };
        return new Promise((resolve, reject) => {
            fetch(url, params)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Create GET request
     * @param {String} url url to fetch
     * @param {data} data data
     */
    static get(url, data) {
        const params = {
            method: "GET",
            headers: data.headers        
        };
        return new Promise((resolve, reject) => {
            fetch(url, params)
                .then(resolve)
                .catch(reject);
        });
    }

}

module.exports = RestManager;
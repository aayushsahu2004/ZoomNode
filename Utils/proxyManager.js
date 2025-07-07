const fs = require('fs');

const loadProxies = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            const proxies = data.split('\n').map(line => line.trim()).filter(line => line);
            resolve(proxies);
        });
    });
};

module.exports = { loadProxies };
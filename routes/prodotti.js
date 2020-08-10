const prodottiRoutes = (app, fs) => {

    // variables
    const dataPath = './data/prodotti.json';

    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/prodotti', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // READ ID
    app.get('/prodotti/:nome', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const prodId = req.params["nome"];
            const obj = JSON.parse(data);

            var index = obj["prodotti"].findIndex(function (item, i) {
                return item.nome === prodId
            });

            res.send(obj["prodotti"][index]);
        });
    });
};

module.exports = prodottiRoutes;
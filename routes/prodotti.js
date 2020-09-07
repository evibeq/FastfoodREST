const prodottiRoutes = (app, fs) => {

    const dataPath = './data/prodotti.json';

    const convert = require('xml-js');
    const options = {spaces: 4, compact: true};

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

    app.get('/prodottixml', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(convert.json2xml(JSON.parse(data), options));
        });
    });

    // READ ID
    app.get('/prodotti/:nome', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var index = obj.prodotti.findIndex(function (item, i) {
                return item.nome === req.params.nome
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "prodotto non esiste", nome: req.params.nome });

            res.send(obj.prodotti[index]);
        });
    });

    app.get('/prodottixml/:nome', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var index = obj.prodotti.findIndex(function (item, i) {
                return item.nome === req.params.nome
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "prodotto non esiste", nome: req.params.nome });

            res.send(convert.json2xml(obj.prodotti[index], options));
        });
    });
};

module.exports = prodottiRoutes;
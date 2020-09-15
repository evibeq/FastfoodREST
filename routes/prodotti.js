const prodottiRoutes = (app, fs) => {

    const dataPath = './data/prodotti.json';

    const convert = require('xml-js');
    const options = {spaces: 4, compact: true};

    // READ
    app.get('/prodotti', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    //XML
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

    //XML
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
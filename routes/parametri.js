const parametriRoutes = (app, fs) => {

    const dataPath = './data/parametri.json';

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

    // READ INGREDIENTI - GET /ingredienti
    app.get('/ingredienti', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            obj = JSON.parse(data)
            res.send(obj.ingredienti);
        });
    });

    app.get('/ingredientixml', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            obj = JSON.parse(data)
            res.send(convert.json2xml(obj.ingredienti,options));
        });
    });

    // READ TIPOLOGIE PRODOTTI - GET /tipologie_prodotti
    app.get('/tipologie_prodotti', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            obj = JSON.parse(data)
            res.send(obj.tipologie_prodotti);
        });
    });
    app.get('/tipologie_prodottixml', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            obj = JSON.parse(data)
            res.send(convert.json2xml(obj.tipologie_prodotti, options));
        });
    });
    
    // READ METODI PAGAMENTO - GET /metodi_pagamento
    app.get('/metodi_pagamento', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            obj = JSON.parse(data)
            res.send(obj.metodi_pagamento);
        });
    });

    app.get('/metodi_pagamentoxml', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            obj = JSON.parse(data)
            res.send(convert.json2xml(obj.metodi_pagamento,options));
        });
    });

};

module.exports = parametriRoutes;
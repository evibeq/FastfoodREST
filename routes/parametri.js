const parametriRoutes = (app, fs) => {

    const dataPath = './data/parametri.json';

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

    // READ INGREDIENTI
    app.get('/ingredienti', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            obj = JSON.parse(data)
            res.send(obj.ingredienti);
        });
    });

    // READ TIPOLOGIE PRODOTTI
    app.get('/tipologie_prodotti', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            obj = JSON.parse(data)
            res.send(obj.tipologie_prodotti);
        });
    });
    
    // READ METODI PAGAMENTO
    app.get('/metodi_pagamento', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            obj = JSON.parse(data)
            res.send(obj.metodi_pagamento);
        });
    });


};

module.exports = parametriRoutes;
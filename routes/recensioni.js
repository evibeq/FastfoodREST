const { json } = require("express");

const recensioniRoutes = (app, fs) => {

    // variables
    const dataPath = './data/recensioni.json';

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
    app.get('/recensioni', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // READ ID
    app.get('/recensioni/:id', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const id = req.params["id"];
            const obj = JSON.parse(data);

            var index = obj["recensioni"].findIndex(function (item, i) {
                return item.id_recensione === id
            });

            res.send(obj["recensioni"][index]);
        });
    });

    // READ RECENSIONI CLIENTE
    app.get('/recensioni/cliente/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const userId = req.params["user"];
            const obj = JSON.parse(data);

            var rep = { "cliente": req.params["user"], "numero_recensioni": 0, "ristoranti_recensiti": [] };

            obj["recensioni"].forEach(element => {
                if (element.user_cliente == userId) {
                    rep["ristoranti_recensiti"].push(element)
                }
            });

            rep["numero_recensioni"] = rep["ristoranti_recensiti"].length;
            res.send(rep);
        });
    });

    // READ RECENSIONI RISTORANTE
    app.get('/recensioni/ristorante/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const userId = req.params["user"];
            const obj = JSON.parse(data);

            var rep = { "ristorante": req.params["user"], "numero_recensioni": 0, "recensioni_clienti": [] };

            obj["recensioni"].forEach(element => {
                if (element.user_ristoratore == userId) {
                    rep["recensioni_clienti"].push(element)
                }
            });

            rep["numero_recensioni"] = rep["recensioni_clienti"].length;
            res.send(rep);
        });
    });

    // CREATE
    app.post('/recensioni', (req, res) => {

        readFile(data => {

            data["contatore"]++;

            req.body["id_recensione"] = toString(data["contatore"]);
            data["recensioni"].push(req.body);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(201).send(`Aggiunta nuova Recensione`);
            });
        },
            true);
    });

    // UPDATE
    app.put('/recensioni/:id', (req, res) => {

        readFile(data => {

            var index = data["recensioni"].findIndex(function (item, i) {
                return item.id_recensione === req.params["id"]
            });

            if (req.params["id"] == req.body["id"] && index > -1) {
                data["recensioni"][index] = req.body;
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1) {
                    res.status(200).send(`Recensione ${req.params["id"]} Non Esiste`);
                } else if (req.params["id"] != req.body["id"]) {
                    res.status(200).send(`L'id della Recensione non può essere modificato`); //da togliere una volta che facciamo i controlli sui campi
                } else {
                    res.status(201).send(`Recensione ${req.params["id"]} Aggiornato`);
                }
            });
        },
            true);
    });

    // DELETE
    app.delete('/recensioni/:id', (req, res) => {

        readFile(data => {

            var index = data["recensioni"].findIndex(function (item, i) {
                return item.id_recensione == req.params["id"]
            });

            if (index > -1) {
                data["recensioni"].splice(index, 1);
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1) {
                    res.status(200).send(`Recensione ${req.params["id"]} Non Esiste`);
                } else {
                    res.status(200).send(`Recensione ${req.params["id"]} Eliminata`);
                }
            });
        },
            true);
    });

};

module.exports = recensioniRoutes;
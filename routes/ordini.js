const { json } = require("express");

const ordiniRoutes = (app, fs) => {

    // variables
    const dataPath = './data/ordini.json';

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
    app.get('/ordini', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // READ ID
    app.get('/ordini/:id', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const id = req.params["id"];
            const obj = JSON.parse(data);

            var index = obj["ordini"].findIndex(function (item, i) {
                return item.id_ordine === id
            });

            res.send(obj["ordini"][index]);
        });
    });

    // READ ORDINI CLIENTE
    app.get('/ordini/cliente/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const userId = req.params["user"];
            const obj = JSON.parse(data);

            var rep = { "cliente": req.params["user"], "numero_ordini": 0, "ordini": [] };

            obj["ordini"].forEach(element => {
                if (element.user_cliente == userId) {
                    rep["ordini"].push(element)
                }
            });

            rep["numero_ordini"] = rep["ordini"].length;
            res.send(rep);
        });
    });

    // READ ORDINI RISTORANTE
    app.get('/ordini/ristorante/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const userId = req.params["user"];
            const obj = JSON.parse(data);

            var rep = { "ristorante": req.params["user"], "numero_ordini": 0, "ordini": [] };

            obj["ordini"].forEach(element => {
                if (element.user_ristoratore == userId) {
                    rep["ordini"].push(element)
                }
            });

            rep["numero_ordini"] = rep["ordini"].length;
            res.send(rep);
        });
    });

    // CREATE
    app.post('/ordini', (req, res) => {

        readFile(data => {

            data["contatore"]++;

            req.body["id_ordine"] = toString(data["contatore"]);
            data["ordini"].push(req.body);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(201).send(`Aggiunta nuova Recensione`);
            });
        },
            true);
    });

    // UPDATE
    app.put('/ordini/:id', (req, res) => {

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
    app.delete('/ordini/:id', (req, res) => {

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

module.exports = ordiniRoutes;
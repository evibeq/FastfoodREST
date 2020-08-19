const ristoratoriRoutes = (app, fs) => {

    const dataPath = './data/ristoratori.json';

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
    app.get('/ristoratori', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // READ USER
    app.get('/ristoratori/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var index = obj.ristoratori.findIndex(function (item, i) {
                return item.user === req.params.user
            });

            if (index > -1) {
                res.status(200).send(obj.ristoratori[index]);
            } else {
                res.status(404).send({ "messaggio": "Ristoratore " + req.params.user + " non esiste." });
            }
        });
    });

    // CREATE
    app.post('/ristoratori', (req, res) => {

        readFile(data => {

            var index = data["ristoratori"].findIndex(function (item, i) {
                return item.user === req.body["user"]
            });

            if (index == -1) {
                data["ristoratori"].push(req.body);
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1) {
                    res.status(201).send(`Aggiunto nuovo Ristoratore, ${req.body["user"]}`);
                } else {
                    res.status(200).send(`Ristoratore ${req.body["user"]} già esiste`);
                }
            });
        },
            true);
    });

    // UPDATE USER
    app.put('/ristoratori/:user', (req, res) => {

        readFile(data => {

            var index = data["ristoratori"].findIndex(function (item, i) {
                return item.user === req.params["user"]
            });

            if (req.params["user"] == req.body["user"] && index > -1) {
                data["ristoratori"][index] = req.body;
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1) {
                    res.status(200).send(`Ristoratore ${req.params["user"]} Non Esiste`);
                } else if (req.params["user"] != req.body["user"]) {
                    res.status(200).send(`Lo user del Ristoratore non può essere modificato`);
                } else {
                    res.status(201).send(`Ristoratore ${req.params["user"]} Aggiornato`);
                }
            });
        },
            true);
    });

    // DELETE USER
    app.delete('/ristoratori/:user', (req, res) => {

        readFile(data => {

            var index = data["ristoratori"].findIndex(function (item, i) {
                return item.user === req.params["user"]
            });

            if (index > -1) {
                data["ristoratori"].splice(index, 1);
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1) {
                    res.status(200).send(`Ristoratore ${req.params["user"]} Non Esiste`);
                } else {
                    res.status(200).send(`Ristoratore ${req.params["user"]} Eliminato`);
                }
            });
        },
            true);
    });

    // CREATE PRODOTTO PERSONALIZZATO
    app.post('/prodottipersonalizzati/:user', (req, res) => {

        readFile(data => {

            var index = data["ristoratori"].findIndex(function (item, i) {
                return item.user === req.params["user"]
            });

            if (index > -1) {
                data["ristoratori"][index]["prodotti_personalizzati"].push(req.body);
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1) {
                    res.status(201).send(`Non esiste Ristoratore ${req.params["user"]}`);
                } else {
                    res.status(200).send(`Prodotto Personalizzato aggiunto a ${req.params["user"]}`);
                }
            });
        },
            true);
    });

    // DELETE PRODOTTO PERSONALIZZATO
    app.delete('/prodottipersonalizzati/:user/:nome', (req, res) => {

        readFile(data => {

            var indexUser = data["ristoratori"].findIndex(function (item, i) {
                return item.user === req.params["user"]
            });

            if (indexUser > -1) {

                var indexNome = data["ristoratori"][indexUser]["prodotti_personalizzati"].findIndex(function (item, i) {
                    return item.nome === req.params["nome"]
                });

                if (indexNome > -1) {
                    data["ristoratori"][indexUser]["prodotti_personalizzati"].splice(indexNome, 1);
                }
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (indexUser == -1) {
                    res.status(200).send(`Ristoratore ${req.params["user"]} Non Esiste`);
                } else if (indexNome == -1) {
                    res.status(200).send(`Prodotto Personalizzato ${req.params["nome"]} Non Esiste`);
                } else {
                    res.status(200).send(`Prodotto Personalizzato ${req.params["nome"]} Eliminato`);
                }
            });
        },
            true);
    });
};

module.exports = ristoratoriRoutes;
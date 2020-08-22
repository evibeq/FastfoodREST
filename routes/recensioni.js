const recensioniRoutes = (app, fs) => {

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

            const obj = JSON.parse(data);

            var index = obj.recensioni.findIndex(function (item, i) {
                return item.id_recensione === req.params.id
            });

            if (index > -1) {
                res.status(200).send(obj.recensioni[index]);
            } else {
                res.status(404).send({ messaggio: "Recensione " + req.params.user + " non esiste." });
            }

        });
    });

    // READ RECENSIONI CLIENTE
    app.get('/recensioni/cliente/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var rep = { cliente: req.params.user, numero_recensioni: 0, recensioni: [] };

            obj.recensioni.forEach(element => {
                if (element.user_cliente == req.params.user) {
                    rep.recensioni.push(element)
                }
            });

            rep.numero_recensioni = rep.recensioni.length;
            res.status(200).send(rep);
        });
    });

    // READ RECENSIONI RISTORANTE
    app.get('/recensioni/ristorante/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var rep = { ristorante: req.params.user, numero_recensioni: 0, recensioni: [] };

            obj.recensioni.forEach(element => {
                if (element.user_ristoratore == req.params.user) {
                    rep.recensioni.push(element)
                }
            });

            rep.numero_recensioni = reprecensioni.length;
            res.status(200).send(rep);
        });
    });

    // CREATE
    app.post('/recensioni', (req, res) => {

        readFile(data => {

            var rep = {};
            var valido = true;

            if (req.body.user_ristoratore === undefined || req.body.user_ristoratore === "") {
                rep.user_ristoratore = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.user_cliente === undefined || req.body.user_cliente === "") {
                rep.user_cliente = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.recensione === undefined || req.body.recensione === "") {
                rep.recensione = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }

            if (!valido) return res.status(409).send(rep);

            var index = data.recensioni.findIndex(function (item, i) {
                return (item.user_ristoratore == req.body.user_ristoratore) && (item.user_cliente == req.body.user_cliente)
            });

            if (index > -1) {
                rep = { message: req.bodyuser_cliente + " ha già recensito " + req.bodyuser_ristoratore, recensione: req.body }
                return res.status(409).send(rep);
            }

            data.contatore++;
            var d = new Date();

            const obj = {
                user_ristoratore: req.body.user_ristoratore,
                user_cliente: req.body.user_cliente,
                recensione: req.body.recensione,
                data_recensione: d.getDate() + "/" + Number(d.getMonth() + 1) + "/" + d.getFullYear() + ", " + d.toLocaleTimeString("default", { hour12: false }),
                data: d,
                id_recensione: data.contatore
            }

            data.recensioni.push(obj);

            rep = { messaggio: "Aggiunta nuova recensione", recensione: obj }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep)
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

            var rep = { "message": "", "id_recensione": req.params["id"], "new_recensione": req.body };

            if (index == -1) {
                rep.message = "Recensione non esiste";
                res.status(404);
            } else if (("id_recensione" in req.body) && (req.params["id"] != req.body["id_recensione"])) {
                rep.message = "L'id della Recensione non può essere modificato";
                res.status(409);
            } else {
                rep.message = "Recensione modificata";
                rep["old_recensione"] = data["recensioni"][index];
                data["recensioni"][index] = req.body;
                data["recensioni"][index]["id_recensione"] = req.params["id"];
                res.status(201);
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.send(rep);
            });
        },
            true);
    });

    // DELETE
    app.delete('/recensioni/:id', (req, res) => {

        readFile(data => {

            var index = data.recensioni.findIndex(function (item, i) {
                return item.id_recensione == req.params["id"]
            });

            var rep = { "message": "", "id_recensione": req.params["id"] };

            if (index > -1) {
                rep.message = "Recensione eliminata";
                rep["recensione"] = data["recensioni"][index];
                data["recensioni"].splice(index, 1);
                res.status(200);
            } else {
                rep.message = "Recensione non esiste";
                res.status(404);
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.send(rep);
            });
        },
            true);
    });

};

module.exports = recensioniRoutes;
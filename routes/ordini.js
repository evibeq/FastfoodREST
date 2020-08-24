const ordiniRoutes = (app, fs) => {

    const dataPath = './data/ordini.json';

    // Funzione READFILE
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    // Funzione WRITEFILE
    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // GET /ordini
    app.get('/ordini', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // GET /ordini/:id
    app.get('/ordini/:id', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var index = obj.ordini.findIndex(function (item, i) {
                return item.id_ordine == req.params.id
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Ordine non esiste", id: req.params.id });

            res.status.send(obj.ordini[index]);
        });
    });

    // GET /ordini/cliente/:user
    app.get('/ordini/cliente/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var rep = { cliente: req.params.user, numero_ordini: 0, ordini: [] };

            obj.ordini.forEach(element => {
                if (element.user_cliente == req.params.user) {
                    rep.ordini.push(element)
                }
            });

            rep.numero_ordini = rep.ordini.length;
            res.status(200).send(rep);
        });
    });

    // GET /ordini/ristoratore/:user
    app.get('/ordini/ristoratore/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var rep = { ristorante: req.params.user, numero_ordini: 0, ordini: [] };

            obj.ordini.forEach(element => {
                if (element.user_ristoratore == req.params.user) {
                    rep.ordini.push(element)
                }
            });

            rep.numero_ordini = rep.ordini.length;
            res.status(200).send(rep);
        });
    });

    // POST /ordini
    app.post('/ordini', (req, res) => {

        readFile(data => {

            var rep = {};
            var valido = true;

            if (req.body.user_ristoratore === undefined || req.body.user_ristoratore === "") {
                rep.user_ristoratore = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }
            if (req.body.user_cliente === undefined || req.body.user_cliente === "") {
                rep.user_cliente = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }
            if (req.body.prodotti.length === 0 || (typeof req.body.prodotti) === "array") {
                rep.prodotti = { messaggio: "Parametro non valido" };
                valido = false;
            }
            if (req.body.prezzo === undefined || req.body.prezzo <= 0 || req.body.prezzo === "") {
                rep.prezzo = { messaggio: "Parametro non valido" };
                valido = false;
            }

            var prodotti = [];

            req.body.prodotti.forEach(element => {
                if (element.nome_prodotto === undefined || element.nome_prodotto === "" || element.quantita === undefined || element.quantita === "" || element.quantita <= 0){
                    rep.prodotti = {messaggio: "Parametri non validi"};
                    valido = false;
                    return;
                }
                var prodotto = {nome_prodotto: element.nome_prodotto, quantita: element.quantita};
                prodotti.push(prodotto);
            });

            if (!valido)
                return res.status(409).send(rep);

            data.contatore++;
            var d = new Date();

            const obj = {
                user_ristoratore: req.body.user_ristoratore,
                user_cliente: req.body.user_cliente,
                prezzo: req.body.prezzo,
                prodotti: prodotti,
                data: d.getDate() + "/" + Number(d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.toLocaleTimeString("default", { hour12: false }),
                id: data.contatore
            }

            data.ordini.push(obj);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send({ messaggio: "Ordine ricevuto", ordine: obj })
            });
        },
            true);
    });

    // PUT /ordini/:id
    app.put('/ordini/:id', (req, res) => {

        readFile(data => {

            var index = data.ordini.findIndex(function (item, i) {
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

    // DELETE /ordini/:id
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
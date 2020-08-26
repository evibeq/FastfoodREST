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

    // READ - GET /ordini
    app.get('/ordini', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // READ ID - GET /ordini/:id
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

    // READ ORDINI CLIENTE - GET /ordini/cliente/:user
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

    // READ ORDINI RISTORANTE - GET /ordini/ristoratore/:user
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

    // CREATE - POST /ordini
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
            if (req.body.prodotti.length === 0 || (typeof req.body.prodotti) != "object") {
                rep.prodotti = { messaggio: "Parametro non valido" };
                valido = false;
            }
            if (req.body.prezzo === undefined || req.body.prezzo <= 0 || req.body.prezzo === "") {
                rep.prezzo = { messaggio: "Parametro non valido" };
                valido = false;
            }
            if (req.body.punto_ritiro === undefined || req.body.punto_ritiro === "") {
                rep.punto_ritiro = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }
            if (req.body.tempo_attesa === undefined || req.body.tempo_attesa <= 0 || req.body.tempo_attesa === "") {
                rep.tempo_attesa = { messaggio: "Parametro non valido" };
                valido = false;
            }

            if (!valido)
                return res.status(409).send(rep);

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
                punto_ritiro: req.body.punto_ritiro,
                tempo_attesa: req.body.tempo_attesa,
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

    // UPDATE - PUT /ordini/:id
    app.put('/ordini/:id', (req, res) => {

        readFile(data => {

            var index = data.ordini.findIndex(function (item, i) {
                return item.id == req.params.id
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Ordine non esiste", id: req.params.id });

            var rep = {};

            var valido = true;

            if (req.body.prodotti.length === 0 || (typeof req.body.prodotti) != "object") {
                rep.prodotti = { messaggio: "Parametro non valido" };
                valido = false;
            }
            if (req.body.prezzo === undefined || req.body.prezzo <= 0 || req.body.prezzo === "") {
                rep.prezzo = { messaggio: "Parametro non valido" };
                valido = false;
            }
            if (req.body.punto_ritiro === undefined || req.body.punto_ritiro === "") {
                rep.punto_ritiro = { messaggio: "Parametro non valido" };
                valido = false;
            }
            if (req.body.tempo_attesa === undefined || req.body.tempo_attesa <= 0 || req.body.tempo_attesa === "") {
                rep.tempo_attesa = { messaggio: "Parametro non valido" };
                valido = false;
            }

            if (!valido)
                return res.status(409).send(rep);

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

            rep = {
            messaggio: "Ordine aggiornato",
            id: req.params.id,
            parametri_aggiornati:
                {
                    prodotti: prodotti,
                    prezzo: req.body.prezzo,
                    punto_ritiro: req.body.punto_ritiro,
                    tempo_attesa: req.body.tempo_attesa
                }
            }

            data.ordini[index].prodotti = prodotti;
            data.ordini[index].prezzo = req.body.prezzo;
            data.ordini[index].punto_ritiro = req.body.punto_ritiro;
            data.ordini[index].tempo_attesa = req.body.tempo_attesa;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep);
            });
        },
            true);
    });

    // DELETE ORDINE - DELETE /ordini/:id
    app.delete('/ordini/:id', (req, res) => {

        readFile(data => {

            var index = data.ordini.findIndex(function (item, i) {
                return item.id == req.params.id
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Ordine non esiste", id: req.params.id });

            const rep = {
                messaggio: "Ordine eliminato",
                ordine: data.ordini[index]
            };

            data.ordini.splice(index, 1);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep);
            });
        },
            true);
    });

};

module.exports = ordiniRoutes;
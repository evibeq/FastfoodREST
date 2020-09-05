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
                return item.user == req.params.user
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Ristoratore non esiste", user: req.params.user });

            res.send(obj.ristoratori[index]);
        });
    });

    // CREATE - POST /ristoratori
    app.post('/ristoratori', (req, res) => {

        readFile(data => {

            var rep = {};
            var valido = true;

            if (req.body.user === undefined || req.body.user === "") {
                rep.user = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.password === undefined || req.body.password === "") {
                rep.password = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.nome_ristorante === undefined || req.body.nome_ristorante === "") {
                rep.nome_ristorante = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.numero_telefono === undefined || req.body.numero_telefono === "") {
                rep.numero_telefono = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.partita_iva === undefined || req.body.partita_iva === "") {
                rep.partita_iva = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.indirizzo === undefined || req.body.indirizzo === "") {
                rep.indirizzo = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.prodotti != undefined && typeof req.body.prodotti != "object") {
                rep.prodotti = { messaggio: "Parametro non valido." };
                valido = false;
            }

            if (!valido)
                return res.status(409).send(rep);

            var index = data.ristoratori.findIndex(function (item, i) {
                return item.user === req.body.user
            });

            if (index > -1)
                return res.status(409).send({ messaggio: "Ristoratore già registrato.", user: req.body.user });

            var obj = {
                user: req.body.user,
                password: req.body.password,
                nome_ristorante: req.body.nome_ristorante,
                numero_telefono: req.body.numero_telefono,
                partita_iva: req.body.partita_iva,
                indirizzo: req.body.indirizzo,
                prodotti: [],
                prodotti_personalizzati: []
            };

            if ("prodotti" in req.body)
                obj.prodotti = req.body.prodotti;

            data.ristoratori.push(obj);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send({ messaggio: "Ristoratore registrato", ristoratore: obj });
            });
        },
            true);
    });

    // UPDATE USER
    app.put('/ristoratori/:user', (req, res) => {

        readFile(data => {

            var index = data.ristoratori.findIndex(function (item, i) {
                return item.user == req.params.user
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Ristoratore non esiste", user: req.params.user });

            var rep = {
                messaggio: "Ristoratore aggiornato",
                user: req.params.user,
                parametri_aggiornati: []
            };

            if (req.body.password != undefined && req.body.password != "") {
                rep.parametri_aggiornati.push({ parametro: "password", vecchio_parametro: data.ristoratori[index].password, nuovo_parametro: req.body.password })
                data.ristoratori[index].password = req.body.password;
            }
            if (req.body.nome_ristorante != undefined && req.body.nome_ristorante != "") {
                rep.parametri_aggiornati.push({ parametro: "nome_ristorante", vecchio_parametro: data.ristoratori[index].nome_ristorante, nuovo_parametro: req.body.nome_ristorante })
                data.ristoratori[index].nome_ristorante = req.body.nome_ristorante;
            }
            if (req.body.numero_telefono != undefined && req.body.numero_telefono != "") {
                rep.parametri_aggiornati.push({ parametro: "numero_telefono", vecchio_parametro: data.ristoratori[index].numero_telefono, nuovo_parametro: req.body.numero_telefono })
                data.ristoratori[index].numero_telefono = req.body.numero_telefono;
            }
            if (req.body.partita_iva != undefined && req.body.partita_iva != "") {
                rep.parametri_aggiornati.push({ parametro: "partita_iva", vecchio_parametro: data.ristoratori[index].partita_iva, nuovo_parametro: req.body.partita_iva })
                data.ristoratori[index].partita_iva = req.body.partita_iva;
            }
            if (req.body.indirizzo != undefined && req.body.indirizzo != "") {
                rep.parametri_aggiornati.push({ parametro: "indirizzo", vecchio_parametro: data.ristoratori[index].indirizzo, nuovo_parametro: req.body.indirizzo })
                data.ristoratori[index].indirizzo = req.body.indirizzo;
            }
            if (req.body.prodotti != undefined && typeof req.body.prodotti == "object") {
                rep.parametri_aggiornati.push({ parametro: "prodotti", vecchio_parametro: data.ristoratori[index].prodotti, nuovo_parametro: req.body.prodotti })
                data.ristoratori[index].prodotti = req.body.prodotti;
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep);
            });
        },
            true);
    });

    // DELETE USER
    app.delete('/ristoratori/:user', (req, res) => {

        readFile(data => {

            var index = data.ristoratori.findIndex(function (item, i) {
                return item.user === req.params.user
            });

            if (index === -1) {
                res.status(404).send({ messaggio: "Ristoratore non esiste", user: req.params.user });
                return;
            }

            const rep = {
                messaggio: "Ristoratore eliminato",
                ristoratore: data.ristoratori[index]
            };

            data.ristoratori.splice(index, 1);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send({ rep });
            });
        },
            true);
    });

    // CREATE PRODOTTO PERSONALIZZATO
    app.post('/prodottipersonalizzati/:user', (req, res) => {

        readFile(data => {

            var index = data.ristoratori.findIndex(function (item, i) {
                return item.user === req.params.user
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Ristoratore non esiste", user: req.params.user });

            var rep = {};
            var valido = true;

            if (req.body.nome === undefined || req.body.nome === "") {
                rep.nome = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.foto === undefined || req.body.foto === "") {
                rep.foto = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.tipologia === undefined || req.body.tipologia === "") {
                rep.tipologia = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.prezzo === undefined || req.body.prezzo === "") {
                rep.prezzo = { messaggio: "Il parametro deve essere impostato." };
                valido = false;
            }
            if (req.body.ingredienti === undefined || typeof req.body.ingredienti != "object") {
                rep.ingredienti = { messaggio: "Parametro non valido." };
                valido = false;
            }

            if (!valido)
                return res.status(409).send(rep);

            const obj = {
                nome: req.body.nome,
                foto: data.ristoratori[index].user + req.body.nome,
                tipologia: req.body.tipologia,
                prezzo: req.body.prezzo,
                ingredienti: req.body.ingredienti
            };

            data.ristoratori[index].prodotti_personalizzati.push(obj);


            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send({ messaggio: "Prodotto personalizzato aggiunto", user: req.params.user, prodotto_personalizzato: obj, id_immagine: obj.foto });
            });
        },
            true);
    });

    //CARICA IMMAGINE
    app.post('/upload/:id_immagine', function (req, res) {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).send({messaggio : "Non è stata inviata alcuna immagine"});

        let immagine = req.files.immagine;

        if (!immagine.mimetype.includes('image'))
            return res.status(400).send({messaggio : "Il file inviato deve essere un'immagine"});

        immagine.mv('./public/images/' + req.params.id_immagine, function (err) {
            if (err)
                return res.status(500).send({messaggio : "Errore", errore : err });

            res.send({messaggio : "Immagine caricata con successo"});
        });
    });

    // DELETE PRODOTTO PERSONALIZZATO
    app.delete('/prodottipersonalizzati/:user/:nome', (req, res) => {

        readFile(data => {

            var indexUser = data.ristoratori.findIndex(function (item, i) {
                return item.user == req.params.user
            });

            if (indexUser === -1)
                return res.status(404).send({ messaggio: "Ristoratore non esiste", user: req.params.user });

            var indexProd = data.ristoratori[indexUser].prodotti_personalizzati.findIndex(function (item, i) {
                return item.nome == req.params.nome
            });

            if (indexProd === -1)
                return res.status(404).send({ messaggio: "Prodotto personalizzato non esiste", user: req.params.user, prodotto_personalizzato: req.params.nome });

            const rep = {
                messaggio: "Prodotto personalizzato eliminato",
                user: req.params.user,
                prodotto_personalizzato: data.ristoratori[indexUser].prodotti_personalizzati[indexProd]
            };

            data.ristoratori[indexUser].prodotti_personalizzati.splice(indexProd, 1);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep);
            });
        },
            true);
    });
};

module.exports = ristoratoriRoutes;
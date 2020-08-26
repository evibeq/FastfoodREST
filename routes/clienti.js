const clientiRoutes = (app, fs) => {

    const dataPath = './data/clienti.json';

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

    // READ - GET /clienti 
    app.get('/clienti', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // READ CLIENTE - GET /clienti/:user
    app.get('/clienti/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var index = obj.clienti.findIndex(function (item, i) {
                return item.user == req.params.user
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Cliente non esiste", user: req.params.user });

            res.send(obj.clienti[index]);
        });
    });

    // CREATE - POST /clienti
    app.post('/clienti', (req, res) => {

        readFile(data => {

            var rep = {};
            var valido = true;

            if (req.body.user === undefined || req.body.user === "") {
                rep.user = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }
            if (req.body.password === undefined || req.body.password === "") {
                rep.password = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }
            if (req.body.nome === undefined || req.body.nome === "") {
                rep.nome = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }
            if (req.body.cognome === undefined || req.body.cognome === "") {
                rep.cognome = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }
            if (req.body.pagamento === undefined || req.body.pagamento === "") {
                rep.pagamento = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }

            if (!valido)
                return res.status(409).send(rep);

            var index = data.clienti.findIndex(function (item, i) {
                return item.user == req.body.user;
            });

            if (index > -1)
                return res.status(409).send({ messaggio: "Cliente già registrato", user: req.body.user });

            const obj = {
                user: req.body.user,
                password: req.body.password,
                nome: req.body.nome,
                cognome: req.body.cognome,
                pagamento: req.body.pagamento,
                preferenza_privacy: req.body.preferenza_privacy,
                preferenza_prodotto: req.body.preferenza_prodotto
            };

            data.clienti.push(obj);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send({ messaggio: "Cliente registrato", cliente: obj });
            });
        },
            true);
    });

    // UPDATE - PUT /clienti/:user
    app.put('/clienti/:user', (req, res) => {

        readFile(data => {

            var index = data.clienti.findIndex(function (item, i) {
                return item.user == req.params.user
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Cliente non esiste", user: req.params.user });

            var rep = {
                messaggio: "Cliente aggiornato",
                user: req.params.user,
                parametri_aggiornati: []
            };

            if (req.body.password != undefined && req.body.password != "") {
                rep.parametri_aggiornati.push({ parametro: "password", vecchio_parametro: data.clienti[index].password, nuovo_parametro: req.body.password })
                data.clienti[index].password = req.body.password;
            }
            if (req.body.nome != undefined && req.body.nome != "") {
                rep.parametri_aggiornati.push({ parametro: "nome", vecchio_parametro: data.clienti[index].nome, nuovo_parametro: req.body.nome })
                data.clienti[index].nome = req.body.nome;
            }
            if (req.body.cognome != undefined && req.body.cognome != "") {
                rep.parametri_aggiornati.push({ parametro: "cognome", vecchio_parametro: data.clienti[index].cognome, nuovo_parametro: req.body.cognome })
                data.clienti[index].cognome = req.body.cognome;
            }
            if (req.body.pagamento != undefined && req.body.pagamento != "") {
                rep.parametri_aggiornati.push({ parametro: "pagamento", vecchio_parametro: data.clienti[index].pagamento, nuovo_parametro: req.body.pagamento })
                data.clienti[index].pagamento = req.body.pagamento;
            }
            if (req.body.preferenza_privacy != undefined && req.body.preferenza_privacy != "") {
                rep.parametri_aggiornati.push({ parametro: "preferenza_privacy", vecchio_parametro: data.clienti[index].preferenza_privacy, nuovo_parametro: req.body.preferenza_privacy })
                data.clienti[index].preferenza_privacy = req.body.preferenza_privacy;
            }
            if (req.body.preferenza_prodotto != undefined && req.body.preferenza_prodotto != "") {
                rep.parametri_aggiornati.push({ parametro: "preferenza_prodotto", vecchio_parametro: data.clienti[index].preferenza_prodotto, nuovo_parametro: req.body.preferenza_prodotto })
                data.clienti[index].preferenza_prodotto = req.body.preferenza_prodotto;
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep);
            });
        },
            true);
    });

    // DELETE - DELETE /clienti/:user
    app.delete('/clienti/:user', (req, res) => {

        readFile(data => {

            var index = data.clienti.findIndex(function (item, i) {
                return item.user == req.params.user
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Cliente non esiste", user: req.params.user });

            const rep = {
                messaggio: "Cliente eliminato",
                cliente: data.clienti[index]
            };

            data.clienti.splice(index, 1);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep);
            });
        },
            true);
    });

};

module.exports = clientiRoutes;
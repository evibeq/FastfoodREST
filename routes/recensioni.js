const recensioniRoutes = (app, fs) => {

    const dataPath = './data/recensioni.json';

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

    // READ
    app.get('/recensioni', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    //XML
    app.get('/recensionixml', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(convert.json2xml(JSON.parse(data), options));
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
                return item.id == req.params.id
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Recensione non esiste", id: req.params.id });

            res.send(obj.recensioni[index]);
        });
    });

    //XML
    app.get('/recensionixml/:id', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const obj = JSON.parse(data);

            var index = obj.recensioni.findIndex(function (item, i) {
                return item.id == req.params.id
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Recensione non esiste", id: req.params.id });

            res.send(convert.json2xml(obj.recensioni[index], options));
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

    //XML
    app.get('/recensionixml/cliente/:user', (req, res) => {
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
            res.status(200).send(convert.json2xml(rep, options));
        });
    });

    // READ RECENSIONI RISTORANTE
    app.get('/recensioni/ristoratore/:user', (req, res) => {
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

            rep.numero_recensioni = rep.recensioni.length;
            res.status(200).send(rep);
        });
    });

    //XML
    app.get('/recensionixml/ristoratore/:user', (req, res) => {
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

            rep.numero_recensioni = rep.recensioni.length;
            res.status(200).send(convert.json2xml(rep, options));
        });
    });

    // CREATE
    app.post('/recensioni', (req, res) => {

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
            if (req.body.recensione === undefined || req.body.recensione === "") {
                rep.recensione = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }
            if (req.body.stelle === undefined || req.body.stelle === "" || req.body.stelle < 0 || req.body.stelle > 5 || isNaN(parseInt(req.body.stelle))) {
                rep.recensione = { messaggio: "Parametro non valido" };
                valido = false;
            }

            if (!valido)
                return res.status(409).send(rep);

            var index = data.recensioni.findIndex(function (item, i) {
                return (item.user_ristoratore == req.body.user_ristoratore) && (item.user_cliente == req.body.user_cliente)
            });

            if (index > -1)
                return res.status(409).send({ messaggio: req.body.user_cliente + " ha già recensito " + req.body.user_ristoratore, recensione: req.body });

            data.contatore++;
            var d = new Date();

            const obj = {
                user_ristoratore: req.body.user_ristoratore,
                user_cliente: req.body.user_cliente,
                recensione: req.body.recensione,
                stelle: req.body.stelle,
                data: d.getDate() + "/" + Number(d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.toLocaleTimeString("default", { hour12: false }),
                id: data.contatore
            }

            data.recensioni.push(obj);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send({ messaggio: "Recensione creata", recensione: obj })
            });
        },
            true);
    });

    // UPDATE
    app.put('/recensioni/:id', (req, res) => {

        readFile(data => {

            if (req.body.recensione === undefined || req.body.recensione === "")
                return res.status(400).send({ messaggio: "Il campo recensione non può essere vuoto" });
            if (req.body.stelle === undefined || req.body.stelle === "" || req.body.stelle < 0 || req.body.stelle > 5 || isNaN(parseInt(req.body.stelle)))
                return res.status(400).send({ messaggio: "Campo stelle non valido" });

            var index = data.recensioni.findIndex(function (item, i) {
                return item.id == req.params.id
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Recensione non esiste", id:req.params.id });

            var rep = {
                messaggio: "Recensione modificata",
                vecchia_recensione: data.recensioni[index],
            }
            data.recensioni[index].recensione = req.body.recensione;
            data.recensioni[index].stelle = req.body.stelle;
            rep.nuova_recensione = data.recensioni[index];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep);
            });
        },
            true);
    });

    // DELETE ID
    app.delete('/recensioni/:id', (req, res) => {

        readFile(data => {

            var index = data.recensioni.findIndex(function (item, i) {
                return item.id == req.params.id
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Recensione non esiste", id: req.params.id });

            const rep = {
                messaggio: "Recensione eliminata",
                recensione: data.recensioni[index]
            };

            data.recensioni.splice(index, 1);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep);
            });
        },
            true);
    });

};

module.exports = recensioniRoutes;
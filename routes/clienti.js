const { response } = require("express");

const clientiRoutes = (app, fs) => {

    // variables
    const dataPath = './data/clienti.json';
    
    

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
    app.get('/clienti', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // READ ID
    app.get('/clienti/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const userId = req.params["user"];
            const obj = JSON.parse(data);

            var index = obj["clienti"].findIndex(function (item, i) {
                return item.user === userId
            });

            res.send(obj["clienti"][index]);
        });
    });

    // CREATE
    app.post('/clienti', (req, res) => {

        readFile(data => {

            var rep = {};
            var valido = true;

            if (req.body.user === undefined || req.body.user === "" ) {
                rep.user = {"messaggio" : "Il parametro deve essere impostato"};
                valido = false;
            }
            if (req.body.password === undefined || req.body.password === "") {
                rep.password = {"messaggio" : "Il parametro deve essere impostato"};
                valido = false;
            }
            if (req.body.nome === undefined || req.body.nome === ""){
                rep.nome = {"messaggio" : "Il parametro deve essere impostato"};
                valido = false;
            }
            if (req.body.cognome === undefined || req.body.cognome === ""){
                rep.cognome = {"messaggio" : "Il parametro deve essere impostato"};
                valido = false;
            }
            if (req.body.pagamento === undefined || req.body.pagamento === ""){
                rep.pagamento = {"messaggio" : "Il parametro deve essere impostato"};
                valido = false;
            }

            if (!valido){
                res.status(409).send(rep);
                return;
            }

            var index = data.clienti.findIndex(function (item, i) {
                return item.user == req.body.user;
            });

            if (index > -1) {
                rep.user = {"messaggio" : "Il cliente " + req.body.user + " è già registrato"};
                res.status(409).send(rep);
                return;
            }

            data.clienti.push(req.body); 

            

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(201).send(`Cliente ${req.body["user"]} aggiunto`);
            });
        },
            true);
    });

    // UPDATE
    app.put('/clienti/:user', (req, res) => {

        readFile(data => {

            var index = data["clienti"].findIndex(function (item, i) {
                return item.user === req.params["user"]
            });

            if (req.params["user"] == req.body["user"] && index > -1) {
                data["clienti"][index] = req.body;
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1) {
                    res.status(200).send(`Cliente ${req.params["user"]} Non Esiste`);
                } else if (req.params["user"] != req.body["user"]) {
                    res.status(200).send(`Lo user del Cliente non può essere modificato`);
                } else {
                    res.status(201).send(`Cliente ${req.params["user"]} Aggiornato`);
                }
            });
        },
            true);
    });

    // DELETE
    app.delete('/clienti/:user', (req, res) => {

        readFile(data => {

            var index = data["clienti"].findIndex(function (item, i) {
                return item.user === req.params["user"]
            });

            if (index > -1) {
                data["clienti"].splice(index, 1);
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1) {
                    res.status(200).send(`Cliente ${req.params["user"]} Non Esiste`);
                } else {
                    res.status(200).send(`Cliente ${req.params["user"]} Eliminato`);
                }
            });
        },
            true);
    });

};

module.exports = clientiRoutes;




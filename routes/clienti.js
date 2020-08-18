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

            if (req.body.user === undefined || req.body.user === "") {
                rep["messaggio"] = `Il parametro user deve essere impostato`
                res.status(200).send(rep);
                return;
            }

            var index = data["clienti"].findIndex(function (item, i) {
                return item.user === req.body["user"]
            });

            if (index > -1) {
                rep["messaggio"] = `Cliente ${req.body["user"]} esiste`
                res.status(200).send(rep);
                return;
            }

            var newobj = {};

            if (req.body.user == undefined) {

            }

            data.clienti.push(req.body); 

            

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1) {
                    res.status(201).send(`Aggiunto nuovo Cliente, ${req.body["user"]}`);
                } else {
                    res.status(200).send(`Cliente ${req.body["user"]} già ESISTE`);
                }
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




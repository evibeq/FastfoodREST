const ristoratoriRoutes = (app, fs) => {

    // variables
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

    // READ ID
    app.get('/ristoratori/:user', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            const userId = req.params["user"];
            const obj = JSON.parse(data);

            var index = obj["ristoratori"].findIndex(function (item, i) {
                return item.user === userId
            });

            res.send(obj["ristoratori"][index]);
        });
    });

    // CREATE
    app.post('/ristoratori', (req, res) => {

        readFile(data => {

            var index = data["ristoratori"].findIndex(function (item, i) {
                return item.user === req.body["user"]
            });

            if (index == -1){
                const lastElement = data["ristoratori"].length;
                data["ristoratori"][lastElement] = req.body;  
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1){
                    res.status(200).send(`Aggiunto nuovo ristoratore, ${req.body["user"]}`);
                }else{
                    res.status(200).send(`Ristoratore ${req.body["user"]} già esiste`);
                }
            });
        },
            true);
    });

    // UPDATE
    app.put('/ristoratori/:user', (req, res) => {

        readFile(data => {

            console.log(req.params["user"], typeof req.params["user"]);
            console.log(req.body);

            var index = data["ristoratori"].findIndex(function (item, i) {
                return item.user === req.params["user"]
            });
            console.log(index);

            data["ristoratori"][index] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} updated`);
            });
        },
            true);
    });

    // DELETE
    app.delete('/users/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const userId = req.params["id"];
            delete data[userId];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} removed`);
            });
        },
            true);
    });

};

module.exports = ristoratoriRoutes;
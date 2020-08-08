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

            console.log(req.body["user"], typeof req.body["user"]);

            const lastElement = data["ristoratori"].length;

            // add the new user
            data["ristoratori"][lastElement] = req.body;    

            






            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new user added');
            });
        },
            true);
    });

    // UPDATE
    app.put('/users/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const userId = req.params["id"];
            data[userId] = req.body;

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
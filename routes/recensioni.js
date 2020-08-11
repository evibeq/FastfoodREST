const recensioniRoutes = (app, fs) => {

    // variables
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

            const id = req.params["id"];
            const obj = JSON.parse(data);

            var index = obj["recensioni"].findIndex(function (item, i) {
                return item.id_recensione === id
            });

            res.send(obj["recensioni"][index]);
        });
    });

    // CREATE
    app.post('/recensioni', (req, res) => {

        readFile(data => {

            var contatore = data["recensioni"].getInt("id_recensione");
            contatore++;
            console.log(contatore);

            var index = data["recensioni"].findIndex(function (item, i) {
                return item.id_recensione === contatore
            });

            if (index == -1){
                const lastElement = data["recensioni"].length;
                data["recensioni"][lastElement] = req.body + ["id_recensione", contatore];  
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1){
                    res.status(201).send(`Aggiunta nuova Recensione ${contatore}`);
                }else{
                    res.status(200).send(`Recensione ${contatore} già esiste`);
                }
            });
        },
            true);
    });

    // DELETE
    app.delete('/recensioni/:id', (req, res) => {

        readFile(data => {

            var index = data["recensioni"].findIndex(function (item, i) {
                return item.id_recensione === req.params["id"]
            });

            if (index > -1){
                data["recensioni"].splice(index, 1);
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                if (index == -1){
                    res.status(200).send(`Recensione ${req.params["id"]} Non Esiste`);
                } else {
                    res.status(200).send(`Recensione ${req.params["id"]} Eliminata`);
                }
            });
        },
            true);
    });

};

module.exports = recensioniRoutes;
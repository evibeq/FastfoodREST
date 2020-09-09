const loginRoutes = (app, fs) => { //STO A LAVORA'

    const dataPath = './data/login.json';

    const bcrypt = require('bcrypt');

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

    app.get('/login', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });




    app.post('/login', async (req, res) => {

        readFile(async (data) => {

            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                const user = { user: req.body.user, tipo_utente: req.body.tipo_utente, password: hashedPassword }
                data.utenti.push(user);
            } catch {
                res.status(500).send({messaggio : "hashing faillito"})
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.send({ messaggio: "user creato" })
            });
        },
            true);
    });


};

module.exports = loginRoutes;
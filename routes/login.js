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

    // READ - GET /users
    app.get('/users', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // CREATE - POST /signup REGISTRAZIONE
    app.post('/signup', (req, res) => {

        readFile(async (data) => {

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
            if (req.body.tipo_utente === undefined || req.body.tipo_utente === "") {
                rep.tipo_utente = { messaggio: "Parametro deve essere impostato" };
                valido = false;
            }

            if (!valido)
                return res.status(409).send(rep);

            var index = data.utenti.findIndex(function (item, i) {
                return item.user == req.body.user;
            });

            if (index > -1)
                return res.status(409).send({ messaggio: "User già presente", user: req.body.user });

            

            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                const user = { user: req.body.user, tipo_utente: req.body.tipo_utente, password: hashedPassword }
                data.utenti.push(user);
            } catch {
                res.status(500).send({ messaggio: "Hashing fallito" })
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.send({ messaggio: "User creato" })
            });
        },
            true);
    });

    // CREATE - POST /login LOGIN
    app.post('/login', (req, res) => {

        readFile(async (data) => {

            var index = data.utenti.findIndex(function (item, i) {
                return item.user == req.body.user
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "User non esiste", user: req.body.user });

            try {
                if (await bcrypt.compare(req.body.password, data.utenti[index].password)) {
                    res.send({messaggio: 'Accesso consentito'});
                } else {
                    res.send({messaggio: 'You shall not pass!'});
                }
            } catch {
                res.status(500).send();
            }
        },
            true);
    });

};

module.exports = loginRoutes;
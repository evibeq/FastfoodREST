const loginRoutes = (app, fs) => {

    const dataPath = './data/login.json';

    const bcrypt = require('bcrypt');

    // Funzione READFILE
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFileSync(filePath, encoding, (err, data) => {
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

    const users = []

    app.get('/users', (req, res) => {
        res.json(users)
    })

    app.post('/users', (req, res) => {

        bcrypt.hash(req.body.password, 10).then(function(hash) {
            // Store hash in your password DB.
            readFile(data => {

                const user = { user: req.body.user, password: hash }
                login.utenti.push(user)
    
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send({ messaggio: "User aggiunto" })
                });
            },
                true);
        });
    })
/*
    app.post('/users/login', async (req, res) => {
        const user = users.find(user => user.name === req.body.name)
        if (user == null) {
            return res.status(400).send('Cannot find user')
        }
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                res.send('Success')
            } else {
                res.send('Not Allowed')
            }
        } catch {
            res.status(500).send()
        }
    })
    
    /*
    
        // READ - GET /clienti 
        app.get('/clienti', (req, res) => {
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
    
                res.send(JSON.parse(data));
            });
        });
    
    
        app.post('/users', async (req, res) => {
    
            try {
                readFile(data => {
    
                    const hashedPassword = await bcrypt.hash(req.body.password, 10)
                    const user = { name: req.body.name, tipo_utente: req.body.tipo_utente, password: hashedPassword }
                    data.utenti.push(user)
                    res.status(201).send()
    
    
                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send(rep);
                    });
                },
                    true);
    
            } catch {
                res.status(500).send()
            }
        });
    
        app.post('/users/login', async (req, res) => {
            const user = users.find(user => user.name === req.body.name)
            if (user == null) {
                return res.status(400).send('Cannot find user')
            }
            try {
                if (await bcrypt.compare(req.body.password, user.password)) {
                    res.send('Success')
                } else {
                    res.send('Not Allowed')
                }
            } catch {
                res.status(500).send()
            }
        })
    */


};

module.exports = loginRoutes;
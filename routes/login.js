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

                console.log("entro nel try");
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                console.log("creo la password hashata");
                const user = { name: req.body.name, password: hashedPassword }
                data.utenti.push(obj);
                console.log("push nel doc");
            } catch {
                res.status(500).send()
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                console.log("entro nel writefile");
                res.send({ messaggio: "user creato" })
            });
        },
            true);
    });


};

module.exports = loginRoutes;
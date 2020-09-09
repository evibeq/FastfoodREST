const loginRoutes = (app, fs) => { //STO A LAVORA'

    const dataPath = './data/login.json';

    const bcrypt = require('bcrypt');

            // Funzione READFILE
            const readFile = async (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
                fs.readFileSync(filePath, encoding, (err, data) => {
                    if (err) {
                        throw err;
                    }
        
                    callback(returnJson ? JSON.parse(data) : data);
                });
            };
        
            // Funzione WRITEFILE
            const writeFile = async (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
        
                fs.writeFile(filePath, fileData, encoding, (err) => {
                    if (err) {
                        throw err;
                    }
        
                    callback();
                });
            };

    app.post('/users', async (req, res) => {

            readFile(data => {
                try{
                    const hashedPassword = await bcrypt.hash(req.body.password, 10)
                    const user = { user: req.body.user, password: hashedPassword }
                    login.utenti.push(user)
                }catch {
                    res.status(500).send()
                }
    
                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send({ messaggio: "persona ricevuta" })
                });
            },
                true);
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
    

    
        // READ - GET /clienti 
        app.get('/clienti', (req, res) => {
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
    
                res.send(JSON.parse(data));
            });
        });
    
        */


};

module.exports = loginRoutes;
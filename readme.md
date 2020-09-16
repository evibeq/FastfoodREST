# Applicazione REST
Progetto Applicazioni Web e Cloud - A.A. 2019/2020

Studenti  
931423 - Beqaj Evandro  
931531 - Ciobanu Vasile

Link Heroku: https://fastfoodrest.herokuapp.com/

## Premessa
L’obiettivo è implementare un’applicazione REST per supportare lo sviluppo dell’applicazione web FastFood.

## API
Al fine di realizzare le richieste, ci si è basati sul paradigma CRUD.  
Utilizzando metodi HTTP (GET, POST, PUT, DELETE) per la gestione delle risorse.
Per la gestione dei dati si sono utilizzati file JSON locali.
Implemetato un web server utilizzando Node JS ed il frameword Express.

### Login
```
{
    "user": "",
    "password": "",
    "tipo_utente": ""
}
```
Metodi    
`POST /signup`  
`POST /login`    
___
### Clienti
```
{
    "user": "",
    "nome": "",
    "cognome": "",
    "pagamento": "",
    "preferenza_privacy": "",
    "preferenza_prodotto": ""
}
```
Metodi  
`GET /clienti`  
`GET /clienti/:user`  
`POST /clienti`  
`PUT /clienti/:user`  
`DELETE /clienti/:user`  

XML  
`GET /clientixml`  
`GET /clientixml/:user`  
___
### Ristoratori
```
{
    "user": "",
    "nome_ristorante": "",
    "numero_telefono": "",
    "partita_iva": "",
    "indirizzo": "",
    "prodotti":[ ],
    "prodotti_personalizzati":[
        {
            "nome":"",
            "foto":"",
            "tipologia":"",
            "prezzo":"",
            "ingredienti":[ ]
        }
    ]
}
```
Metodi  
`GET /ristoratori`  
`GET /ristoratori/:user`  
`POST /ristoratori`  
`PUT /ristoratori/:user`  
`DELETE /ristoratori/:user`  

`POST /prodottipersonalizzati/:user`  
`POST /upload/:id_immagine`  
`DELETE /prodottipersonalizzati/:user/:nome`  

XML  
`GET /ristoratorixml`  
`GET /ristoratorixml/:user`
___
### Prodotti
```
{
    "nome":"",
    "foto":"",
    "tipologia":"",
    "prezzo":"",
    "ingredienti":[]
}
```
Metodi  
`GET /prodotti`  
`GET /prodotti/:nome`  

XML  
`GET /prodottixml`  
`GET /prodottixml/:nome`
___
### Recensioni
```
{
    "user_ristoratore":"",
    "user_cliente":"",
    "recensione":"",
    "stelle":"",
    "data":"",
    "id": ""
}
```
Metodi  
`GET /recensioni`  
`GET /recensioni/:id`  
`GET /recensioni/cliente/:user`  
`GET /recensioni/ristoratore/:user`  
`POST /recensioni`  
`PUT /recensioni/:id`  
`DELETE /recensioni/:id`

XML  
`GET /recensionixml`  
`GET /recensionixml/:id`  
`GET /recensionixml/cliente/:user`  
`GET /recensionixml/ristoratore/:user`
___
### Ordini
```
{
    "user_ristoratore": "",
    "user_cliente": "",
    "prezzo":"",
    "punto_ritiro":"",
    "tempo_attesa":"", 
    "prodotti": [
        {
            "nome_prodotto":"",
            "quantita":""
        }
    ],
    "data":"",
    "id":""
}
```
Metodi  
`GET /ordini`  
`GET /ordini/:id`  
`GET /ordini/cliente/:user`  
`GET /ordini/ristoratore/:user`  
`POST /ordini`  
`PUT /ordini/:id`  
`DELETE /ordini/:id`  

XML  
`GET /ordinixml`  
`GET /ordinixml/:id`  
`GET /ordinixml/cliente/:user`  
`GET /ordinixml/ristoratore/:user` 
___
### Parametri
Metodi  
`GET /ingredienti`  
`GET /tipologie_prodotti`  
`GET /metodi_pagamento`  
`GET /tipologia_utente`  

XML  
`GET /ingredientixml`  
`GET /tipologie_prodottixml`  
`GET /tipologia_utentexml`  
`GET /metodi_pagamentoxml`  

## Dettaglio tecnico e scelte implementative
Le tecnologie software e le risorse esterne utilizzate sono:
#### Node.js
https://nodejs.org/  
Runtime Javascript orientato agli eventi
#### Express (4.17.1)
https://www.npmjs.com/package/express  
Framework Node.js per applicazioni web e API flessibile e leggero
#### express-fileupload (1.2.0)
https://www.npmjs.com/package/express-fileupload  
Middleware utilizzato per implementare la funzionalità di upload di foto di prodotti personalizzati
#### bcrypt (5.0.0)
https://www.npmjs.com/package/bcrypt  
Libreria per hashing di password, utilizzato nella fase di signup e login
#### xml-js (1.6.11)
https://www.npmjs.com/package/xml-js  
Convertitore XML/JSON e viceversa  



La struttura del progetto è la seguente:
```
projectfolder
├── data
├── public
│   └── images
├── routes
├── app.js
├── package.json
└── Procfile
```
* `data` contiene tutti i file in formato .json dove salviamo le informazioni di nostro interesse. Ogni file .json corrisponde a un file .js contenuto in `routes`. Per comodità condividono lo stesso nome (prodotti.js lavora su prodotti.json).  
* `public/images` è la cartella contenente le immagini caricate o richieste dal client.  
* `routes` è la cartella contenente tutte le routes, cioè i file .js che determinano come il server deve rispondere a una determinata richiesta. Le varie routes contengono il codice che si occupa di leggere o scrivere sui file json contenuti in `data`. In seguito verrano visti nel dettaglio.
* `app.js` è il file contenente il codice che per primo viene eseguito una volta che il server è in funzione. Qui vengono create alcune delle costanti che servirano per il funzionamento di ogni singola route, viene definita su quale porta (che decide Heroku) express deve stare in ascolto, vengono inizializzati alcuni middleware ed infine il server viene messo in ascolto pronto a ricevere le varie richieste.  
* `package.json` è il file json contenente alcune configurazioni per node js. Tra le tante qui definiamo quali dependencies node js deve utilizzare. Una volta deployato su heroku sarà lui ad occuparsi di scaricare tutte questi pacchetti esterni.
* `Procfile` è il file che dovrebbe contenere una lista di comandi che heroku deve eseguire una volta iniziata la dyno. Nel nostro caso abbiamo solo un comando con cui indichiamo di eseguire app.js.

### ROUTES
Il file `routes.js` contenuto nella cartella `routes` si occupa di inizializzare tutte le routes, in modo che, fatta una richiesta, l'applicazione sappia quale porzione di codice deve eseguire per restituire la risposta corretta. Ad eccezione di questo file, tutti quelli contenuti nella cartella hanno una struttura simile per i quattro tipi di richiesta.

### READ, CREATE, UPDATE, DELETE
Qualsiasi richiesta GET, POST, DELETE, PUT posta in modo corretto al server restituisce una risposta in formato JSON. Anche se un campo è errato la risposta restituisce un oggetto JSON che avverte della non correttezza. Le richieste GET su URL che terminano con "xml" restituiscono invece oggetti XML.

#### GET
Una generica richiesta GET per richiedere tutto il contenuto di un file json è costruita nel seguente modo:
```
app.get('/percorso', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });
```
La funzione `app.get()`, dopo essere stata invocata da una richiesta GET col percorso prefissato (/percorso) si occupa, tramite il metodo `readFile` del modulo fs di node.js di restituire il contenuto in formato json, grazie a `JSON.parse`, dei dati contenuti nel file che si trova nel percorso definito all'interno della variabile `dataPath`.

Per restituire invece sono una porzione richiesta del contenuto di un file json, per esempio solo le informazioni di un ristorante, è stato implementato il seguente codice:
```
app.get('/percorso/:id', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        const obj = JSON.parse(data);

        var index = obj.elementi.findIndex(function (item, i) {
            return item.id == req.params.id
        });

        if (index === -1)
            return res.status(404).send({ messaggio: "Elemento non esiste", id: req.params.id });

        res.send(obj.elementi[index]);
    });
});
```
La funzione è simile a prima ma si impegna a restituire solo l'elemento identificato da un id che viene definito nella url della richiesta. Dopo aver creato l'oggetto `obj` prendendo il contenuto del file json viene iterato tutto l'elenco di elementi con la funzione `findIndex()`. Se l'elenco contiene un elemento con lo stesso id di quello richiesto allora viene restituito, altrimenti viene restituito un oggetto json contenente un messaggio di errore.

#### POST
Le richieste POST inviate assieme a un oggetto json col contenuto di ciò che si vuole aggiungere vengono implementate sulla falsa riga della seguente:
```
app.post('/percorso', async (req, res) => {

    readFile(data => {

        var rep = {};
        var valido = true;

        if (req.body.chiave1 === undefined || req.body.chiave1 === "" || altri controlli) {
            rep.chiave1 = { messaggio: "Parametro non valido" };
            valido = false;
        }
        if (req.body.chiave2 === undefined || req.body.chiave2 === "" || altri controlli) {
            rep.chaive2 = { messaggio: "Parametro non valido" };
            valido = false;
        }

        if (!valido)
            return res.status(409).send(rep);

        var index = data.elementi.findIndex(function (item, i) {
            return item.id == req.body.id;
        });

        if (index > -1)
            return res.status(409).send({ messaggio: "Elemento già esistente", user: req.body.id });

        const obj = {
            id: req.body.id,
            campo1: req.body.campo1,
            campo2: req.body.campo2
        };

        data.elementi.push(obj);

        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send({ messaggio: "Elemento aggiunto", elemento: obj });
        });
    },
        true);
});
```
Controlliamo dapprima se l'oggetto che il server riceve è costruito bene: non contiene campi vuoti se obbligatori e rispetta altri tipi di controllo. Se non vanno bene viene subito restituito un oggetto contenente un messaggio di errore indicando i campi non validi. Superati i controlli sui campi il codice evita che vangano creati oggetti con lo stesso id (per esempio username o codici che identificano gli acquisti) avvisando facendo ritornare un oggetto con messaggio di errore e relativi dettagli. Se l'oggetto inviato dal client supera tutti questi controlli allora il codice aggiunge il contenuto al file json tramite la funzione `writeFile` e restituisce un messaggio di avvenuta aggiunta.

#### PUT
Le richieste PUT sono accompagnate anch'esse da un oggetto json con del contenuto, ma solo coi campi che si vogliono sovrascrivere. Sono stati implementati sulla falsa riga del seguente codice:
```
app.put('/percorso/:id', (req, res) => {

        readFile(data => {

            var index = data.elementi.findIndex(function (item, i) {
                return item.id == req.params.id
            });

            if (index === -1)
                return res.status(404).send({ messaggio: "Elemento non esiste", id: req.params.id });

            var rep = {
                messaggio: "Elemento aggiornato",
                id: req.params.id,
                parametri_aggiornati: []
            };

            if (req.body.campo1 != undefined && req.body.campo1 != "" && altri controlli) {
                rep.parametri_aggiornati.push({ parametro: "campo1", vecchio_parametro: data.elementi[index].campo1, nuovo_parametro: req.body.campo1 })
                data.elementi[index].campo1 = req.body.campo1;
            }
            if (req.body.campo2 != undefined && req.body.campo2 != "" && altri controlli) {
                rep.parametri_aggiornati.push({ parametro: "campo2", vecchio_parametro: data.elementi[index].campo2, nuovo_parametro: req.body.campo2 })
                data.elementi[index].campo2 = req.body.campo2;
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(rep);
            });
        },
            true);
    });
```
Controlliamo subito se l'elemento che si vuole aggiornare effettivamente esiste altrimenti restituiamo un messaggio di errore. Se esiste allora, per ogni campo contenuto nel corpo dell'oggetto inviato dal client, verifichiamo la correttezza e effettuiamo la modifica.
#### DELETE
Le richieste DELETE devono essere eseguito su url che identificano l'identificativo dell'elemento che si vuole eliminare. Sono state implementate sulla falsa riga del seguente codice:
```
app.delete('/percorso/:id', (req, res) => {

    readFile(data => {

        var index = data.elementi.findIndex(function (item, i) {
            return item.id == req.params.id
        });

        if (index === -1)
            return res.status(404).send({ messaggio: "Elemento non esiste", id: req.params.id });

        const rep = {
            messaggio: "Elemento eliminato",
            elemento: data.elementi[index]
        };

        data.elementi.splice(index, 1);

        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(rep);
        });
    },
        true);
});
```
Verifichiamo l'effettiva esistenza dell'elemento che vogliamo eliminare. Se non esiste restituiamo un messaggio di errore. Altrimenti facciamo lo splice.

#### PASSWORD e HASHING
Per questioni legate alla sicurezza la porzione di database che si occupa di salvare gli username e le password è implementata con un file json chiamato `login.json` separato da quelli che contengono le altre informazioni legate ai clienti e ai ristoratori.
La route `login.js` utilizza la libreria bcrypt per creare il sale e svolgere l'hashing delle password. Nella fase di signup, nel quale facciamo una POST, eseguiamo il seguente codice all'interno di una funzione asincrona:
```
try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { user: req.body.user, tipo_utente: req.body.tipo_utente, password: hashedPassword }
    data.utenti.push(user);
} catch {
    res.status(500).send({ messaggio: "Hashing fallito" })
}
```
Invece per la fase di login confrontiamo l'hash generato a partire dalla password salvata e dalla password inviata sempre con un metodo POST:
```
try {
    if (await bcrypt.compare(req.body.password, data.utenti[index].password)) {
        res.send('Accesso consentito');
    } else {
        res.send('You shall not pass!');
    }
} catch {
    res.status(500).send();
}
```
#### UPLOAD FILE
Per permettere a un ristoratore di caricare l'immagine del proprio prodotto personalizzato utilizzaimo una richista POST separata da quella che si occupa di caricare i dati del prodotto personalizzato:
```
app.post('/upload/:id_immagine', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).send({messaggio : "Non è stata inviata alcuna immagine"});

    let immagine = req.files.immagine;

    if (!immagine.mimetype.includes('image'))
        return res.status(400).send({messaggio : "Il file inviato deve essere un'immagine"});

    immagine.mv('./public/images/' + req.params.id_immagine, function (err) {
        if (err)
            return res.status(500).send({messaggio : "Errore", errore : err });

        res.send({messaggio : "Immagine caricata con successo"});
    });
});
```
Nella fase di eliminzaione di un prodotto personalizzato invece vengono eliminati tramite una richiesta DELETE sia i dati che l'immagine contenuta nella crtella `public/images`.
#### XML
Per restituire come richiesto dalla consegna le informazioni anche in formato xml è stata implementata, per ogni get, una versione che restituisce un oggetto xml tramite la seguente riga di codice, che si occupa di convertire un oggettoo json in xml:
```
convert.json2xml(obj.clienti[index], options)
```
Le optiozi sono definite in una variabile e seguono le direttive indicate nella pagina della libreria xml-js.
## Prove di funzionamento 

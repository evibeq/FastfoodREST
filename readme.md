Studenti  
931423 - Beqaj Evandro  
931531 - Ciobanu Vasile

## Introduzione
L'applicazione implementata è deployata su Heroku ed è accessibile all'indirizzo: https://fastfoodrest.herokuapp.com/  
L'account free di Heroku ne limita le modifiche sui lunghi periodi o dopo aver riavviato le dynos. Tutte le modifiche fatte al database, implementato con file json, vengono percìo cancellate e i file tornano al loro stato iniziale.  
L'applicazione segue l'architettura REST ed utilizza node js combianto con express come framework.

## Funzionalità sviluppate
Il progetto si pone l'obbiettivo di supportare lo sviluppo di un'app web per la gestione di una catena di fastfood tramite la realizzazione di un'applicazione REST.
Deve ricoprire la funzione di gestire lato server tutte le possibili richieste di tipo GET, POST, DELETE, PUT che vengono fatte dal client. L'applicazione si occupa quindi di gestire l'accesso, l'aggiunta, l'eliminazione e l'aggiornamento delle informazioni nel database. La richiesta di lavorare su menù e su informazioni sui locali (dando la possibilità ai singoli ristoratori di gestire i propri dati) richiede l'implementazione di un database per i PRODOTTI e i RISTORANTI; quella di lavorare su clienti della piattaforma e loro preferenze richiede l'implementazione di un database per i CLIENTI; quella di lavorare sui loro acquisti effettuati e sulle loro recensioni richiede di implementare un database per gli ORDINI e le RECENSIONI.
Per poter garantire la registrazione e il login alla piattaforma da parte di utenti che siano ristoratori o clienti, è stato implementato un file chiamato LOGIN contenente solo username, password e tipo di utente, implementato separatamente da RISTORANTI e CLIENTI per questioni che verrano discusse in seguito (vedi Dettaglio tecnico e scelte implementative).
Per la presenza di parametri che caratterizzano una moltitudine di aspetti dell'applicazione web è stato necessario l'utilizzo di un file chiamato PARAMETRI, da cui è possibile richiedere con una lettura informazioni quali, per esempio, l'elenco di tutti gli ingredienti che è possibile utilizzare per un prodotto personalizzato.  

## API
Al fine di realizzare le richieste vengono utilizzate richieste HTTP (GET, POST, PUT, DELETE) per la gestione delle risorse.
I dati vengono salvati su file JSON locali.

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
`data` contiene tutti i file in formato .json dove salviamo le informazioni di nostro interesse. Ogni file .json corrisponde a un file .js contenuto in `routes`.Per comodità condividono lo stesso nome (prodotti.js lavora su prodotti.json).  
`public/images` è la cartella contenente le immagini caricate o richieste dal client.  
`routes` è la cartella contenente tutte le routes, cioè i file .js che determinano come il server deve rispondere a una determinata richiesta. Le varie routes contengono il codice che si occupa di leggere o scrivere sui file json contenuti in `data`. In seguito verrano visti nel dettaglio.
`app.js` è il file contenente il codice che per primo viene eseguito una volta che il server è in funzione. Qui vengono create alcune delle costanti che servirano per il funzionamento di ogni singola route, viene definita su quale porta (che decide Heroku) express deve stare in ascolto, vengono inizializzati alcuni middleware ed infine il server viene messo in ascolto pronto a ricevere le varie richieste.  
`package.json` è il file json contenente alcune configurazioni per node js. Tra le tante qui definiamo quali dependencies node js deve utilizzare. Una volta deployato su heroku sarà lui ad occuparsi di scaricare tutte questi pacchetti esterni.
`Procfile` è il file che dovrebbe contenere una lista di comandi che heroku deve eseguire una volta iniziata la dyno. Nel nostro caso abbiamo solo un comando con cui indichiamo di eseguire app.js.

## Prove di funzionamento

Qualsiasi richiesta GET, POST, DELETE, PUT posta in modo corretto al server restituisce una risposta in formato JSON. Anche se un campo è errato la risposta restituisce un oggetto JSON che avverte della non correttezza. Le richieste GET su URL che terminano con "xml" restituiscono invece oggetti XML. 

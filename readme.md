L'applicazione implementata è deployata su Heroku ed è accessibile all'indirizzo: https://fastfoodrest.herokuapp.com/  
L'account free di Heroku ne limita le modifiche sui lunghi periodi o dopo aver riavviato le dynos. Tutte le modifiche fatte al database, implementato con file json, vengono percìo cancellate e i file tornano al loro stato iniziale.  
L'applicazione segue l'architettura REST e tramite le seguenti API è possibile fare operazioni su di essa.


Le tecnologie software e le risorse esterne utilizzate utilizze sono:
```
Node.js - runtime Javascript orientato agli eventi
Express (4.17.1) - framework Node.js per applicazioni web e API flessibile e leggero
express-fileupload (1.2.0) - middleware per caricare file sul server, utilizzato per implementare la funzionalità di upload di foto di prodotti personalizzati
bcrypt (5.0.0) - libreria per hashing di password, utilizzato nelle fase di signup e login
xml-js (1.6.11) - convertitore XML/JSON e viceversa
```

La struttura del progetto è la seguente:
```
/projectfolder
  /data   //contenente tutti i file json dove salviamo le informazioni di nostro interesse
  /public/images    //cartella contenente le immagini caricate o richieste dal client
  /routes   //cartella contenente tutte le routes, cioè i file js che determinano come il server deve rispondere a una determinata richiesta
    routes.js
app.js    //file contenente il codice che per primo viene eseguito una volta che il server è in funzione
package.json    //file json di configurazioni per node js, tra le tante qui definiamo quali dependencies node js deve utilizzare
Procfile    //file contenente  una lista di comandi che heroku deve eseguire una volta iniziata la dyno, in questo indichiamo solo di eseguire app.js
```

Qualsiasi richiesta GET, POST, DELETE, PUT posta in modo corretto al server restituisce una risposta in formato JSON. Anche se un campo è errato la risposta restituisce un oggetto JSON che avverte della non correttezza. Le richieste GET su URL che terminano con "xml" restituiscono invece oggetti XML.  

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
Per la gestione dei dati vengono utilizzati file JSON locali.
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

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

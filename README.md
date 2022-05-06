# M1IF13 - TP 1 & 2

- DANTIER Florian p1710759
- SAURY Jean p1805563

## Information concernant postman
Une collection postman au format json a été mise en plus du fichier yaml swagger.
En effet la collection postman générée par ce fichier yaml comporte quelques erreurs
qui ont été corrigées dans le fichier json postman.
###Il est donc important d'importer de fichier-ci pour avoir la bonne api dans postman.

## Information concernant l'api swager
Malgré plusieurs heures de recherche, nous n'avons trouvé aucun moyen, pour les requêtes 
comportant une seule "String" en paramètre, de générer correctement la documentation
swagger, ainsi, si on teste depuis swagger ces routes qui sont : la route "PUT", pour 
modifier le mot de passe et la route "POST" logout, pour se déconnecter, cela ne fonctionnera pas.

Cela fonctionne en revanche très bien depuis postman.

## Test unitaire et scénario postman

Beaucoup de tests ont été effectués grâce à MockMVC de spring boot.
Ces tests couvrent la partie qui consomme du json et sont exécutés par la pipeline.

Egalement, un scenario postman est fourni à la racine du dépôt et ce scénario couvre
la consommation en url encoded pour l'ensemble des méthodes (ou form-data pour la méthode PUT).
# TP3
Ce tp a été réalisé en Typescript. 
On y retrouve, comme demandé une api pour gérer les ressource et une api "Admin" pour configurer une partie.
#### [Lien de l'api "Resource" : https://192.168.75.13/game/api](https://192.168.75.13/game/api)  
#### [Lien de l'api "Admin" : https://192.168.75.13/game/admin](https://192.168.75.13/game/admin)
### Attention : Nous avons fait certains choix pour l'URL des api qui ne corresponde pas forcément avec l'énoncé.
### Bien respecté, pour d'éventuel test, les url indiqué ci-dessus.
En plus de ces deux api, nous avons fait un CRUD sur chaque type d'objet sur lesquelles on travaille, à savoir :  
1. User
2. Zrr
3. Trésor  

Nous avons fait cela car, nous avions compris qu'il fallait faire ces routes (avant de se rendre compte que non).  
Nous les avons tout de même gardé, car cela permet malgré tout de présenter du contenu, comme les fonctions générique gérant les opérations CRUD.  
Nous avons également fait, sur quelques routes, de la validation de donné avec express-validator.  
Ces validations ne sont pas présentes sur toutes les routes, car le but était avant tout de se rajouter une lib à découvrir sans y passer trop de temps non plus.  


# TP4
## Information concernant le client

Sur l'adresse ~/static est présent le client admin qui permet de configurer une partie avec les fonctionnalités suivantes :
 - Création de la ZRR :
    - En cliquant sur le bouton "créer la zone" situé en dessous de la carte, on peut en cliquant sur deux points, construire la ZRR.
    - On peut ensuite cliquer sur send pour envoyer l'information au serveur.
    - Pour la modifier il suffit de refaire les étapes précédente et cela sera mis à jour sur le serveur.
 - Ajout des coffres :
    - Dans la section paramêtre, via le picker, on séléctionne le contenu du coffre.
    - En appuyant sur le bouton feu, on peut désormais placer les coffres sur la carte en cliquant sur cette dernière.
- Initialisation de la TTL :
  -   Toujours dans la section paramêtre on peut initialiser le TTL par défaut des joueurs en saisissant la valeur adéquate dans le champ associé puis en cliquant sur le bouton "Set". 
- Inscription du joueur dans la ZRR :
   - Dans la section aventurier, en saisissant un nom de joueur (inscris au préalable), nous pouvons l'inscrire dans la ZRR.
   - Cela récupèrera ses informations : avatar, TTL et trésors récupérés.
   - Il est à noter qu'en cas d'inscription d'un joueur inscris, ses données seront réinitialisées.

Une config prettier a été mise (minimaliste).  
Pour l'exécuter : ``npm run prettier``
#### [Lien vers le client d'admin (VM)](https://192.168.75.13/game/static/)

## Information concernant webpack

> npm run test

> npm run build:dev

> npm run build:prod

NODE_ENV ne fonctionne que sur Linux donc pour lancer webpack en local sur Windows il faut rentrer la commande : npm run build sans préciser d'environement.

Les tests de Jasmine se lance via la commande npm run test, ils fonctionnent en Local et ne peuvent pas être tourné sur docker car il nécéssiterais de lancer le serveur. Il ne sont pas présent en production.

# TP7
## Information concernant la géolocalisation
Le script simple de géolocalisation est présent sur la vm en tant que fichier statique à l'adresse suivante :
#### [Lien vers le script simple de géolocalisation](https://192.168.75.13/game/static/geoloc.html)

## Liens vers les différentes ressource :

#### [Collection postman](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/Users%20API.postman_collection.json)
#### [Scnéario postman](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/Users%20API.postman_collection%20-%20TEST.json)
#### [Fichier d'export de l'API swagger](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/users-api.yaml)
#### [Documentation swagger (un peu buggée comme dit plus haut) disponible sur la VM](https://192.168.75.13:8443/mif13/swagger-ui/index.html#/)



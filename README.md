### Un accès à tous les liens du projet est fourni en dernière section si besoin.
[Cliquer ici pour y accéder](##Regroupement des liens vers les différentes parties du projet)


# M1IF13 - TP 1 & 2

- DANTIER Florian p1710759
- SAURY Jean p1805563

## Information concernant le serveur Spring
#### [Lien vers le serveur Spring](https://192.168.75.13:8443/mif13)


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

Sur l'adresse ~/game/static/index.html est présent le client admin qui permet de configurer une partie avec les fonctionnalités suivantes :
 - Création de la ZRR :
    - En cliquant sur le bouton "créer la zone" situé en dessous de la carte, on peut en cliquant sur deux points, construire la ZRR.
    - On peut ensuite cliquer sur send pour envoyer l'information au serveur.
    - Pour la modifier il suffit de refaire les étapes précédente et cela sera mis à jour sur le serveur.
    - La création de la ZRR provoque le retrait des joueurs de la partie, réinitialise leurs coffres et ceux de la map, la partie doit également être redémarré (dans la section suivante). 
 - Ajout des coffres :
    - Dans la section paramêtre, via le picker, on séléctionne le contenu du coffre.
    - En appuyant sur le bouton feu, on peut désormais placer les coffres sur la carte en cliquant sur cette dernière.
    - Il est a noter que cliquer une deuxième fois sur le bouton feu provoque la réinitialisation des coffres sur la map et ceux récupérés par les joueurs.
- Initialisation de la TTL :
  -   Toujours dans la section paramêtre on peut initialiser le TTL par défaut de tout les joueurs (y compris ceux qui n'ont pas été ajouté) en saisissant la valeur adéquate dans le champ associé puis en cliquant sur le bouton "Set". 
- Inscription du joueur dans la ZRR :
   - Dans la section aventurier, en saisissant un nom de joueur (inscris au préalable), nous pouvons l'inscrire dans la ZRR.
   - Cela récupèrera ses informations : avatar, TTL et trésors récupérés.
   - Il est à noter qu'en cas d'inscription d'un joueur inscris, ses données seront réinitialisées (ses coffres et sa position enregistré entre autre).

Une config prettier a été mise (minimaliste).  
Pour l'exécuter : ``npm run prettier``
#### [Lien vers le client d'admin (VM)](https://192.168.75.13/game/static/)

## Information concernant webpack

> npm run test

> npm run build:dev

> npm run build:prod

NODE_ENV ne fonctionne que sur Linux donc pour lancer webpack en local sur Windows il faut rentrer la commande : npm run build sans préciser d'environement.

Les tests de Jasmine se lance via la commande npm run test, ils fonctionnent en Local et ne peuvent pas être tourné sur docker car il nécéssiterais de lancer le serveur. Il ne sont pas présent en production.

# TP5-6-7
## Information concernant le client Vue
#### [Lien vers le client Vue.js](https://192.168.75.13/client/#/)


Procédure à suivre pour s'enregistrer et se connecter (compte inexistant) :  
1. Renseignez les 4 champs login, password, image URL et ttl.
2. Cliquez sur le bouton (gris) créer un compte.
3. Une fois cela effectué, les champs renseignés sont toujours remplis, vous pouvez donc cliquer sur le bouton "Se connecter"
4. Une redirection est effectuée vers la page de jeu.

Procédure à suivre pour se connecter (compte existant) :
1. Renseignez uniquement les champs login et password.
2. Cliquer sur le bouton (bleu) "Se connecter"
3. Une redirection est effectuée vers la page du jeu.

Ensuite, voir la procédure indiquée dans la section [TP4](#TP4) pour paramétrer et démarrer une partie.

Enfin vous devrez accepter les autorisations
de notification (optionnel) et de géolocalisation (après avoir été ajouté sur une partie).
Tout est prêt pour aller récupérer les mystérieux coffres ! 


Attention ! Certains coffres sont piégés ...
- Coffre Lune = +60 TTL
- Coffre Dissimulation = Invincibilité ? (+99999 TTL)
- Coffre Beta-X = 💀 (mort)
- Coffre pierre magique = Catch'em all ! (l'objectif est d'en avoir le plus possible)

## Information concernant la géolocalisation
Le script simple de géolocalisation est présent sur la vm en tant que fichier statique à l'adresse suivante :
#### [Lien vers le script simple de géolocalisation](https://192.168.75.13/game/static/geoloc.html)
## Information concernant la PWA
Pour télécharger la PWA sur votre téléphone ou sur votre ordinateur il est conseillé :
- D'etre sur le navigateur Chrome ou Firefox Nightly (ce dernier testé uniquement sur android et nécéssite d'aller modifier des paramêtres dans about:config)
- D'avoir ajouté le certificat de l'autorité de certification (Pour android il faut avoir un téléphone en mode développeur et ajouter le certificat dans les paramêtres du téléphone)
- De disposer des dernières versions à jour des navigateurs
- D'avoir son téléphone en mode non-silencieux (et pas en "ne pas déranger")

#### [Lien vers le client d'admin (VM)](https://192.168.75.13/client/)

## Liens vers les différentes ressource :

#### [Collection postman](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/Users%20API.postman_collection.json)
#### [Scnéario postman](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/Users%20API.postman_collection%20-%20TEST.json)
#### [Fichier d'export de l'API swagger](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/users-api.yaml)
#### [Documentation swagger (un peu buggée comme dit plus haut) disponible sur la VM](https://192.168.75.13:8443/mif13/swagger-ui/index.html#/)

## Regroupement des liens vers les différentes parties du projet

#### [Page admin](https://192.168.75.13/game/static/)
#### [Page client](https://192.168.75.13/client/#/)
#### [Serveur d'authentification](https://192.168.75.13:8443/mif13)
#### [Lien de l'api (racine)" : https://192.168.75.13/game/](https://192.168.75.13/game/)
#### [Lien de l'api "Resource" : https://192.168.75.13/game/api](https://192.168.75.13/game/api)
#### [Lien de l'api "Admin" : https://192.168.75.13/game/admin](https://192.168.75.13/game/admin)
# M1IF13 - TP 1 & 2

# DANTIER Florian p1710759
# SAURY Jean p1805563

## Information concernant postman
Une collection postman au format json a été mise en plus du fichier yaml swagger.
En effet la collection postman générée par ce fichier yaml comporte quelques erreurs
qui ont été corrigées dans le fichier json postman.
###Il est donc important d'importer de fichier-ci pour avoir la bonne api dans postman.

## Information concernant l'api swager
Malgès plusieurs heures de recherche, nous n'avons trouvé aucun moyen, pour les requête 
comportant une seule "String" en paramêtre, de générer corectement la documentation
swagger, ainsi, si on teste depuis swagger ces routes qui sont : la route "PUT", pour 
modifier le mot de passe et la route "POST" logout, pour se déconnecter, cela ne fonctionnera pas.

Cela fonctionne en revanche très bien depuis postman.

## Test unitaire et scénario postman

Beaucoup de tests ont été effectués grâce à MockMVC de spring boot.
Ces tests couvrent la partie qui consommes du json et sont éxécutés par la pipeline.

Egalement, un scnéario postman est fournit à la racine du dépôt et ce scénario couvre
la consommation en url encoded pour l'ensemble des méthodes (ou form-data pour la méthode PUT).

## Liens vers les différentes ressource :

####[Collection postman](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/Users%20API.postman_collection.json)
####[Scnéario postman](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/Users%20API.postman_collection%20-%20TEST.json)
####[Fichier d'export de l'API swagger](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/users-api.yaml)
####[Documentation swagger (un peu buggée comme dit plus haut) disponible sur la VM](https://192.168.75.13:8443/mif13/swagger-ui/index.html#/)



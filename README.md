# M1IF13 - TPs

## Information concernant postman
Une collection postman au format json a été mise en plus du fichier yaml swagger.
En effet la collection postman généré par ce fichier yaml comporte quelques erreurs
qui ont été corrigées dans le fichier json postman.
###Il est donc important d'importer de fichier-ci pour avoir la bonne api dans postman.

## Information concernant l'api swager
Malgès plusieurs heures de recherche, nous n'avons trouvé aucun moyen, pour les requête 
comportant une seule "String" en paramétre, de généré corectement la documentation
swagger, ainsi si l'on teste depuis swagger ces routes qui sont la route "PUT" pour 
modifier le mot de passe et la route "POST" logout, donc pour se déconnecter, cela ne fonctionnera pas.

Cela fonctionne en revanche très bien depuis postman.

## Test unitaire et scénario postman

Beaucoup de test one été effectué grace à MockMVC de spring boot.
Ces tests couvrent la partie qui consommes du json et sont éxécuté par la pipeline.

Egalement, un scnéario postman est fournit à la racine du dépôt et ce scnéario couvent
la consmmation en url encoded ou form-data pour la la méthode PUT.

## Liens vers les différentes ressource :

####[Collection postman](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/Users%20API.postman_collection.json)
####[Scnéario postman](URL à la place de ce message)
####[Fichier d'export de l'API swagger](https://forge.univ-lyon1.fr/p1710759/m1if13-tps/-/blob/main/users-api.yaml)
####[Documentation swagger (un peu bugée comme dit plus haut) disponible sur la VM](https://192.168.75.13:8443/mif13/swagger-ui/index.html#/)



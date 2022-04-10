TODO :
- [X] Page de login: Stocker le token avec l'api webstorage
- [ ] Page d'accueil de l'application (qui sera aussi la main page ?)
    -  [X] récupération des informations liées au joueur connecté : trésor récupérer, position, ttl etc etc
    - [X] Afficher l'avatar du joueur sur la carte en fonction de sa position
    - [X] Afficher la zzr sur la carte (après l'avoir récupérer via l'api : il faudra au préalable en avoir créer une)
    - [X] Stocker toutes les informations (constante ?) via l'api webstorage
    - [X] "Ping" le serv toutes les 5 sec pour renvoyer la pos du joueurs (le but est d'anticiper quand le joueur se déplacera)
    - [ ] Mettre a jour les coffres sur la map en cas d'ajout / disparition
- [ ] Sinon voir partie 4
  - [X] Routage "simple"  


# Composants leaflet : https://perso.liris.cnrs.fr/lionel.medini/enseignement/M1IF13/VueJS/

 Une fois tout cela fait, il faudra mettre en place le routeur : pour l'instant on aura qu'une page, avec tous les composants les uns en dessous des autres
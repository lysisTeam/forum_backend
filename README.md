# forum_backend
Le backend du projet ( nodejs, socket.io )

# Description

La partie back sera faite en nodejs.

On utilisera socket.io pour recevoir les méssages en temps réel. En principe lorsqu'un utilisateur envoie un méssage, ce méssage est stocké dans la base de données mais cela ne met pas à jour directement l'interface utilisateur du destinataire, pour cela on a besoin de socket.io pour transporter ce méssage vers le destinataire et ainsi mettre à jour son iterface en temps réel ( lorsqu'un méssage est envoyé ).
Ce principe marche avec toutes les entitées possibles, il suffit qu'on ait besoin de mettre à jour la page d'un utilisateur en fonction de l'action d'un autre.

Un principe aussi important à retenir est la création d'un serveur local pour notre api( notre backend).
Comme vous le savez pour faire tourner une appli il faut un serveur qui reçoit les requêtes et repond en fonction du code qu'il contient.
On a wampserver pour php comme exmple. Mais node ne fournit pas de server prédéfini on doit donc le créer nous même et le faire tourner sur notyre machine. C'est très simple ne vous en faîtes pas. Pour cela Nous allons utiliser Express.js qui s'intègre à nodejs pour palier à ses faiblesses ( Express a d'autre fonctionnalité, il sera omniprésent dans notre projet ).
J'écrirai le code principal pour que vous voyiez comment cela fonctionne.

# initialisation du projet

Pour initialiser un projet node : 

    npm init -y 

. Cette commande crée un fichier package.json qui comportera les configurations et la liste des dependances de notre application.

Ensuite il est éssentiel de créer le fichier le plus important : server.js ou index.js ou peutimportelenomceladependdevous.js . ce fichier sera le point de départ de notre application c'est ce fichier qui sera lu en premier et qui fournira tous les services de notre application.

## server.js

D'abord nous devons installer les dépendances de notre apllication ( express, cors, nodemon, dotenv, mongoose ) 
bien sûr il en aura d'autre à installer tout au long du projet.

Express : framework backend Node.js minimaliste, rapide et de type Sinatra qui offre des fonctionnalités et des outils robustes pour développer des applications backend évolutives. Il vous offre le système de routage et des fonctionnalités simplifiées pour étendre le framework en développant des composants et des parties plus puissants 
en fonction des cas d’utilisation de votre application.

cors : CORS, ou Cross-Origin Resource Sharing, est une politique de sécurité mise en place par les navigateurs web pour empêcher les requêtes de provenir de domaines différents (origines différentes) par défaut. 
il nous servira à choisir d'où coivent provenir les requêtes ( de notre frontend ).

Nodemon : outil populaire dans le monde du développement Node.js. Il est utilisé pour automatiser le processus de 
redémarrage d'une application Node.js lorsque des fichiers source sont modifiés.

dotenv : Il servira à ajouter un fichier d'environnement pour cacher des variables sensibles et globales ( comme les mots de passes etc... ).

mongoose : bibliothèque JavaScript qui permet de simplifier l'interaction avec une base de données MongoDB dans le cadre du développement d'applications Node.js. 

Pour installer ces dépendances : 

    npm install express cors nodemon dotenv mongoose

# IMPORTANT : Comment récupérer le projet ?

  1.Assurez vous de télécharger sur votre ordinateur les éléments suivants : 

    node, npm, mongdb comunity, mongodb compass

  2. Créez un dossier ( Ex : myspace ). Ouvrez le avec votre éditeur de code ( visual studio code ). Ouvrez le terminal dans vscode et  
     clonez le repository dans un dossier sur votre ordi :

    git clone https://github.com/lysisTeam/forum_backend.git

  3. Assurez vous d'être bien dans le dossier forum_backend :

    cd forum_backend

  4. Télécharger toutes les dépendances

    npm install 

 5. créez un fichier .env dans le dossier forum_backend et mettez y ces variables :

        PORT = 3001 
        MONGO_URL = mongodb://127.0.0.1:27017

 6. Ouvrez mongodb compass puis lancez l'application :

        npm run server

# forum_backend
Le backend du projet ( nodejs, socket.io )

# Description

La partie back sera faite en nodejs.
On utilisera socket.io pour recevoir les méssages en temps réel. En principe lorsqu'un utilisateur envoie un méssage, ce méssage est stocké dans la base de données mais cela ne met pas à jour directement l'interface utilisateur du destinataire, pour cela on a besoin de socket.io pour transporter ce méssage vers le destinataire et ainsi mettre à jour son iterface en temps réel ( lorsqu'un méssage est envoyé ).
Ce principe marche avec toutes les entitées possibles, il suffit qu'on ait besoin de mettre à jour la page d'un utilisateur en fonction de l'action d'un autre.


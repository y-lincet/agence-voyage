# ✈️ Travel Agency. - Voyages sur mesure

Site vitrine interactif pour une agence de voyages sur mesure permettant d'explorer des destinations, filtrer des séjours, découvrir des formules de circuits et envoyer une demande de devis.

## ✨ Fonctionnalités

- **Navigation dynamique** : en-tête fixe qui se compacte au défilement, mise en surbrillance automatique de la section active (*scroll spy*) et menu burger plein écran sur mobile.
- **Recherche rapide** : sélection d'une destination, d'une date de départ et du nombre de voyageurs depuis le hero, avec transfert des informations vers le formulaire de contact.
- **Catalogue filtrable** : génération dynamique des 8 destinations depuis `js/main.js`, filtrage par thématique (*Plage, Culture, Ville, Aventure*) et compteur de résultats.
- **Modale de circuits** : affichage des formules (*Famille* et *Évasion*) dans une fenêtre `<dialog>` native.
- **Formulaire de contact** : pré-remplissage automatique depuis les destinations ou les circuits, validation côté client (nom, email, consentement), champ anti-spam (*honeypot*) et message de confirmation personnalisé *(traitement 100 % front-end, sans envoi serveur)*.
- **Accessibilité** : lien d'évitement, attributs ARIA, chargement différé des images (`loading="lazy"`) et prise en compte de `prefers-reduced-motion`.

## 🗂️ Structure du projet

```
agence-voyage/
├── css/
│   └── style.css
├── images/
├── js/
│   └── main.js
├── index.html
└── README.md
```

## 🚀 Exécution en local

Aucune installation ou compilation n'est nécessaire :

1. Cloner ou télécharger le dépôt
2. Ouvrer `index.html` dans le navigateur web (ou lance un serveur local comme *Live Server* dans VS Code)

## 🛠️ Technologies utilisées

- **HTML5**
- **CSS3**
- **JavaScript natif (Vanilla JS)**
- **Google Fonts**

---
order: 80
icon: ":fire:"
---

Le module `Intervention` a comme but principal la rédaction des rapports d'intervention.

L'interface principale du module permet la visualisation de l'ensemble des interventions effectuées.

## Validation

Le principe des 4 yeux est appliqué ainsi, une fois une intervention saisie, une validation est nécessaire afin de pouvoir la facturer dans le module `Comptabilité`.
Le bouton permettant de valider un événement se trouve en fin de ligne.

## Rapport d'intervention

Il est possible de générer les rapports d'intervention au format pdf depuis la page `interventions` et de choisir le contenu de celui-ci.
Voici les différentes options disponibles :

- [ ] Informations générales
- [ ] Description de l'intervention
- [ ] Groupes alarmés
- [ ] Détails des présences des sapeurs
- [ ] Véhicules mobilisé
- [ ] Matériel utilisé
- [ ] Sapeurs non-présent
- [ ] Indication du traitement du rapport
- [ ] Missions de l'intervention
- [ ] Appels durant l'intervention
- [ ] Informations financières (montant) _Si imputé_

## Saisie des présences et phases d'intervention

Les présences des sapeurs aux intervention sont saisies au quart d'heure afin de simplifier le processur de payement.
La notion de phase a pour object de différencier les heures d'intervention des heures de rétablissement.

Finalement, lors de l'ajout d'une présence, il est également possible de préciser qu'une présence correspond à du piquet.

## Configuration

Voici l'ensemble des paramètres disponible dans la configuration

- Véhicules
- Matériel consommable et en prêt
- Missions
- Téléphones
- Traitement (statut)
- Type d'intervention
- Statistique fédéral (sans modification)

## Permissions

Voici les 4 permissions existantes :

- Lecture : Visualisation de l'ensemble des interventions sans possibilité de modification
- Modification : Permet la création/modification des interventions
- Validation : Permet de valider une intervention
- Configuration : Pour configurer les options du module intervention

---
order: 50
icon: ":dollar:"
---

GestSIS n'est pas un logiciel comptable. Cependant, il permet de générer des justificatifs comptable.
De plus, GestSIS permet de générer les fiches de salaire pour chaque sapeur ainsi qu'un fichier ISO20022 pour faciliter les versements banquaires.

Le système fonctionne en 2 étapes:
1. Génération d'écritures à partir d'interventions, exercice, ...
2. Groupement d'écritures dans un "décompte" pour paiement

## Générations d'écritures

GestSIS permet de générer des écritures à travers les 7 modules suivants:
1. Exercice et séances
2. Intervention
3. Indemnités et frais annuels
4. Cours
5. Fiche de travail
6. Autres
7. Amende

### Imputation des exercices

Une fois un exercice validé, il est possible de l'imputer, c'est à dire générer des écritures comptables.

Pour pouvoir imputer un exercice, il est nécessaire de configurer des type d'indemnisation dans `configuration` > `comptabilité` > `Imputation exercice & séance`.

TODO: Ajouter paragraphe imputation par fonction

### Imputation des interventions

Une fois une intervention validée, celle-ci peut être imputée.

Il existe deux types d'imputation différentes:
- Par tarif minimum
- Par taux horaire (week-end et nuit)

Le tarif minimum permet de définir un montant différent pour les premières heures d'intervention.
Par example, il est possible de définir le taux horaire suivant:
- 40.- pour les premières 2 heures puis 15.- par heure sans pro-rata

Ainsi si on sapeur est présent 5h, il touchera ainsi 40.- + 3 * 15.- = 85.-

Additionellement, il est possible 


L'idée de cette étape est de transformer les présences à un exercice ou une intervention, les travaux effectuées, et divers
La génération d'écriture est très simple, réversible et 

## Création de décomptes

:warning: En cours de rédaction :warning:

<!-- TODO: A rédiger -->

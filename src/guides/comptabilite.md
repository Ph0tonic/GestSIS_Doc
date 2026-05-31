---
order: 50
icon: ":dollar:"
---

GestSIS n'est pas un logiciel comptable. Cependant, il permet de générer des justificatifs comptables, des fiches de salaire pour chaque sapeur ainsi qu'un fichier ISO20022 pour faciliter les versements bancaires.

Le système fonctionne en 2 étapes :
1. Génération d'écritures à partir des activités (exercices, interventions, cours, travaux, frais annuels, etc.)
2. Groupement d'écritures dans un **décompte** pour effectuer les paiements

!!!
Une fois des écritures incluses dans un décompte, elles ne peuvent plus être modifiées.
!!!

## Exercice comptable

En haut de la page, un sélecteur permet de choisir l'exercice comptable (année fiscale) sur lequel travailler. L'exercice de l'année en cours est sélectionné par défaut.

## Génération d'écritures

GestSIS permet de générer des écritures à travers les modules suivants :

### Exercices et séances

Une fois un exercice validé, il peut être **imputé** pour générer les écritures correspondantes par sapeur selon leur fonction.

Pour pouvoir imputer, des types d'indemnisation doivent être configurés dans `Configuration` > `Comptabilité` > `Imputation exercice & séance`.

L'imputation est réversible tant que les écritures ne sont pas incluses dans un décompte.

### Interventions

Une fois une intervention validée, elle peut être **imputée** selon deux méthodes configurables :

- **Taux horaire** : taux normal, nuit ou week-end
- **Tarif minimum** : un montant fixe couvre les premières heures, puis un taux horaire s'applique ensuite

**Exemple :** 40.- pour les 2 premières heures puis 15.-/heure sans pro-rata — un sapeur présent 5h touche 40.- + 3 × 15.- = 85.-

### Cours

Les participations aux cours peuvent être imputées en une seule opération pour l'ensemble des cours de l'exercice, ou annulées si nécessaire.

### Fiches de travail

Les fiches de travail acceptées peuvent être imputées individuellement ou toutes en même temps via **Tout imputer**.

### Indemnités et frais annuels

Permet de générer les indemnités et frais récurrents (primes de fonction, frais forfaitaires, etc.) pour tous les sapeurs actifs. La génération peut être relancée pour un sapeur spécifique si sa situation a changé en cours d'année.

### Écritures diverses

Permet la saisie manuelle d'écritures ponctuelles non rattachées à un module spécifique, par exemple des frais de timbre ou des remboursements exceptionnels.

### Amendes

Génère automatiquement les écritures d'amende pour les absences non excusées, sur la base de la configuration des amendes. Le détail par sapeur et par exercice est consultable dans cet onglet.

## Création de décomptes

Un décompte regroupe un ensemble d'écritures pour effectuer un paiement. Il peut être créé globalement ou par sapeur.

Depuis l'onglet **Décomptes**, il est possible de :

- Générer un fichier de paiement **ISO20022** (XML) pour le virement bancaire
- Imprimer des récapitulatifs, des fiches par sapeur et des **certificats de salaire** (PDF)
- Exporter les écritures à facturer aux tiers (Excel)

## Vue par sapeur

L'onglet **Sapeurs** offre une vue synthétique de toutes les écritures pour chaque sapeur, tous modules confondus, avec la possibilité de créer un décompte individuel ou de générer un résumé PDF.

## Vue par compte

L'onglet **Comptes** permet de consulter l'ensemble des écritures rattachées à un compte comptable donné, avec filtres et génération de justificatifs PDF.

## Configuration

Les paramètres du module se trouvent dans `Configuration` > `Comptabilité` :

### Indemnités et frais annuels

La configuration définit des **types** de frais ou d'indemnité (ex: indemnité de fonction, frais forfaitaires), chacun associé à un compte comptable et une catégorie d'écriture.

Pour chaque type, un montant est ensuite configuré par **fonction**. Lors de la génération des écritures, chaque sapeur reçoit le montant correspondant à **sa fonction la plus élevée** uniquement.

Si le type est marqué **cumulable**, le sapeur reçoit le montant pour **chacune de ses fonctions actives** au cours de l'exercice, et non uniquement la plus élevée.

!!!
Si l'unité est **Mois**, le montant est **proratisé** selon la durée réelle d'activité du sapeur dans chaque fonction au cours de l'exercice.
!!!

**Exemple :** un sapeur ayant occupé une fonction pendant 8 mois sur l'exercice recevra 8 × montant mensuel.

## Permissions

- **Lecture** : Visualisation de tous les onglets sans modification possible
- **Modification** : Création, imputation, génération d'écritures et de décomptes
- **Configuration** : Accès aux paramètres du module comptabilité

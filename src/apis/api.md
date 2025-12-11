---
order: 2
icon: ":fire:"
---

# API GestSIS

Documentation utiliser les API d'authentification et de données de GestSIS.

---

## Table des matières

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Authentification](#authentification)
- [API de données (GestSIS_API)](#api-de-données-gestsis_api)
  - [Header Sis-Key](#header-sis-key)
  - [Exemple : Alarmes](#exemple-alarmes)
  - [Autres endpoints](#autres-endpoints-disponibles)
- [Utilisation des tokens](#utilisation-des-tokens)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Introduction

GestSIS utilise deux serveurs API distincts :

1. **GestSIS_Auth** (`https://auth.gestsis.ch/auth/api/v1`) : Gestion de l'authentification et des tokens
2. **GestSIS_API** (`https://apis.gestsis.ch/api/v2`) : Accès aux données métier (interventions, sapeurs, exercices, etc.)

L'architecture multi-tenant permet de gérer plusieurs SIS (Services d'Incendie et de Secours) avec une seule instance de l'API. Chaque requête vers GestSIS_API doit spécifier le SIS concerné via le header **`Sis-Key`**.

---

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /auth/api/v1/login
       ├─────────────────────────────────►┌──────────────────┐
       │ 2. Return accessToken + refresh  │  GestSIS_Auth    │
       │◄─────────────────────────────────┤                  │
       │                                  └──────────────────┘
       │
       │ 3. GET /api/v2/alarmes
       │    Headers:
       │      Authorization: Bearer {token}
       │      Sis-Key: test
       ├─────────────────────────────────►┌──────────────────┐
       │ 4. Return data                   │  GestSIS_API     │
       │◄─────────────────────────────────┤                  │
       │                                  └────────┬─────────┘
       │                                           │
       │                                  ┌────────▼─────────┐
       │                                  │  DB: test        │
       │                                  └──────────────────┘
```

---

## Authentification

Pour toutes les informations sur l'authentification (connexion, gestion des tokens, etc.), consultez la [documentation d'authentification](auth.md).

L'authentification GestSIS utilise des JSON Web Tokens (JWT) avec :
- **Access Token** : Durée de vie de 8 heures
- **Refresh Token** : Durée de vie de 30 jours

**Base URL** : `https://apis.gestsis.ch/auth/api/v1`

---

## API de données (GestSIS_API)

### Base URL

```
https://apis.gestsis.ch/api/v2
```

### Header Sis-Key

**Le header `Sis-Key` est obligatoire** pour toutes les requêtes vers GestSIS_API (sauf quelques endpoints publics comme `/sis-logo`). Il permet de spécifier quel SIS (Service d'Incendie et de Secours) est concerné par la requête.

#### Format

```
Sis-Key: hs
```

La valeur du header correspond à l'abréviation du SIS configurée dans le système. Exemples :
- `hs`
- `612`
- `lb`

#### Erreur si header manquant

```json
{
  "error": "Sis non sélectionné"
}
```

**Code HTTP** : 401 Unauthorized

---

### Exemple : Alarmes

Les alarmes sont récupérées depuis le serveur mail et permettent de créer automatiquement des interventions.

#### Endpoint

```http
GET /api/v2/alarmes
```

#### Headers requis

```
Authorization: Bearer {accessToken}
Sis-Key: test
```

#### Paramètres de requête (optionnels)

| Paramètre | Type    | Description                                             |
| --------- | ------- | ------------------------------------------------------- |
| force     | boolean | Si `true`, force la récupération depuis le serveur mail |
| old       | boolean | Si `true`, inclut les alarmes déjà validées             |

#### Permissions requises

- `intervention.lecture`

#### Réponse (200 OK)

```json
{
  "data": [
    {
      "id": "alarm_123",
      "date": "2025-12-11T14:30:00Z",
      "type": "Incendie",
      "adresse": "Rue de la Gare 15, Delémont",
      "description": "Feu de cheminée",
      "validated": false,
      "sapeurs_alertes": [
        {
          "id": 42,
          "nom": "Dupont",
          "prenom": "Jean",
          "fonction": "Caporal"
        }
      ]
    }
  ]
}
```

#### Exemple cURL

```bash
curl -X GET "https://apis.gestsis.ch/api/v2/alarmes?force=false&old=false" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Sis-Key: test"
```

#### Exemple JavaScript

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('https://apis.gestsis.ch/api/v2/alarmes?force=false&old=false', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Sis-Key': 'test'
  }
});

const data = await response.json();

if (response.ok) {
  console.log('Alarmes récupérées:', data.data);
} else {
  console.error('Erreur:', data.error);
}
```

#### Exemple complet avec gestion des erreurs

```javascript
async function getAlarmes(sisKey, force = false, old = false) {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(
      `https://apis.gestsis.ch/api/v2/alarmes?force=${force}&old=${old}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Sis-Key': sisKey
        }
      }
    );

    if (response.status === 401) {
      // Token expiré, tenter de le rafraîchir
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Réessayer la requête
        return getAlarmes(sisKey, force, old);
      } else {
        // Rediriger vers login
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
    }

    const data = await response.json();
    
    if (response.ok) {
      return data.data;
    } else {
      throw new Error(data.error || 'Erreur inconnue');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des alarmes:', error);
    throw error;
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('https://apis.gestsis.ch/auth/api/v1/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken })
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return true;
  }
  
  return false;
}
```

---

### Autres Endpoints Disponibles

Voici un aperçu des principaux endpoints disponibles dans GestSIS_API. Tous nécessitent les headers `Authorization` et `Sis-Key`.

#### Sapeurs

```http
GET  /api/v2/sapeurs              # Liste des sapeurs
GET  /api/v2/sapeurs/{id}         # Détails d'un sapeur
POST /api/v2/sapeurs              # Créer un sapeur
PUT  /api/v2/sapeurs/{id}         # Modifier un sapeur
```

**Permissions** : `sapeur.lecture`, `sapeur.modification`

#### Interventions

```http
GET    /api/v2/interventions           # Liste des interventions
GET    /api/v2/interventions/{id}      # Détails d'une intervention
POST   /api/v2/interventions           # Créer une intervention
PUT    /api/v2/interventions/{id}      # Modifier une intervention
DELETE /api/v2/interventions/{id}      # Supprimer une intervention
POST   /api/v2/interventions/{id}/valider  # Valider une intervention
```

**Permissions** : `intervention.lecture`, `intervention.modification`, `intervention.validation`

#### Exercices

```http
GET    /api/v2/exercices              # Liste des exercices
GET    /api/v2/exercices/{id}         # Détails d'un exercice
POST   /api/v2/exercices              # Créer un exercice
PUT    /api/v2/exercices/{id}         # Modifier un exercice
DELETE /api/v2/exercices/{id}         # Supprimer un exercice
```

**Permissions** : `exercice.lecture`, `exercice.modification`

#### Véhicules et Matériel

```http
GET    /api/v2/vehicules              # Liste des véhicules
GET    /api/v2/materiels              # Liste du matériel
POST   /api/v2/vehicules              # Créer un véhicule
PUT    /api/v2/vehicules/{id}         # Modifier un véhicule
```

**Permissions** : `intervention.lecture`, `intervention.config`

#### Mes Informations (Sapeur connecté)

```http
GET /api/v2/mes-infos                    # Mes informations personnelles
GET /api/v2/mes-fonctions                # Mes fonctions
GET /api/v2/mes-groupes                  # Mes groupes
GET /api/v2/mon-materiel                 # Mon matériel attribué
GET /api/v2/mes-exercices/{exerciceComptableId}      # Mes exercices
GET /api/v2/mes-interventions/{exerciceComptableId}  # Mes interventions
GET /api/v2/mes-decomptes/{exerciceComptableId}      # Mes décomptes
```

**Middleware** : `jwtTokenSapeur` (pas de permission spécifique, juste être authentifié)

#### Configuration SIS

```http
GET  /api/v2/sis-param               # Paramètres du SIS
POST /api/v2/sis-param               # Modifier les paramètres
GET  /api/v2/sis-contacts            # Contacts du SIS
POST /api/v2/sis-contacts            # Ajouter un contact
GET  /api/v2/sis-logo/{sisKey}       # Logo du SIS (public)
```

**Permissions** : `sis.config` (sauf logo qui est public)

#### Statistiques

```http
GET /api/v2/statistiques/{id}/presence-intervention  # Présences aux interventions
GET /api/v2/stat-intervention                        # Statistiques d'intervention
GET /api/v2/stat-federal                             # Statistiques fédérales
```

**Permissions** : `intervention.lecture`, `comptabilite.lecture`

---

## Utilisation des Tokens

### Structure de l'Access Token

L'access token est un JWT signé avec RSA-256 contenant :

```json
{
  "iss": "GestSIS_Auth",
  "aud": "GestSIS_API",
  "iat": 1702290000,
  "nbf": 1702289990,
  "exp": 1702318800,
  "data": {
    "id": 1,
    "admin": false,
    "validated": true,
    "pseudo": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "permissions": {
      "test": [
        "intervention.lecture",
        "intervention.modification",
        "sapeur.lecture"
      ],
      "hs": [
        "intervention.lecture"
      ]
    },
    "mobiles": [
      "test",
      "hs"
    ],
    "sapeurs": {
      "test": 42,
      "hs": 108
    }
  }
}
```

**Important** : Les permissions, mobiles et sapeurs sont organisés par SIS (clé `api_key` du SIS). Chaque utilisateur peut avoir des permissions différentes pour chaque SIS auquel il a accès.

- **permissions** : Objet où chaque clé est un `api_key` de SIS, contenant un tableau des permissions pour ce SIS
- **mobiles** : Tableau simple contenant les `api_key` des SIS pour lesquels l'utilisateur peut accéder en mode mobile
- **sapeurs** : Objet où chaque clé est un `api_key` de SIS, contenant l'ID du sapeur associé à l'utilisateur dans ce SIS
- **admin** : Si `true`, l'utilisateur a tous les droits sur tous les SIS (permission "admin")

### Headers requis pour les requêtes

Toutes les requêtes vers GestSIS_API nécessitent :

```http
Authorization: Bearer {accessToken}
Sis-Key: {sisKey}
Content-Type: application/json
```

### Exemple de requête complète

```javascript
async function apiRequest(endpoint, options = {}) {
  const accessToken = localStorage.getItem('accessToken');
  const sisKey = localStorage.getItem('sisKey') || 'tes';
  
  const defaultHeaders = {
    'Authorization': `Bearer ${accessToken}`,
    'Sis-Key': sisKey,
    'Content-Type': 'application/json'
  };

  const response = await fetch(`https://apis.gestsis.ch/api/v2${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  // Gestion automatique du refresh token
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Réessayer la requête
      return apiRequest(endpoint, options);
    } else {
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
  }

  return response.json();
}

// Utilisation
const alarmes = await apiRequest('/alarmes?force=false');
const sapeurs = await apiRequest('/sapeurs');
const intervention = await apiRequest('/interventions/42');
```

---

## Bonnes Pratiques

### Sécurité

- **HTTPS uniquement** : Ne jamais utiliser HTTP en production
- **Ne pas exposer les tokens** : Ne jamais logger ou afficher les tokens
- **Stockage sécurisé** : Utiliser `httpOnly cookies` ou un stockage sécurisé
- **Rotation des tokens** : Le refresh token est à usage unique pour éviter le vol

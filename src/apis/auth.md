---
order: 1
icon: ":lock:"
---

# Authentification

Cette page décrit comment utiliser l'API d'authentification de GestSIS pour créer et gérer les tokens d'accès et de rafraîchissement.

## Vue d'ensemble

L'API d'authentification GestSIS utilise un système de tokens JWT (JSON Web Tokens) pour sécuriser les accès. Deux types de tokens sont utilisés :

- **Access Token** : Token de courte durée (8 heures) utilisé pour authentifier les requêtes API
- **Refresh Token** : Token de longue durée (30 jours) utilisé pour renouveler l'access token

## Base URL

L'API d'authentification est accessible via :

```
http://auth.gestsis.ch/api/v1
```

En production, l'URL sera différente selon votre configuration.

---

## 1. Connexion (Login)

### Endpoint

```
POST /api/v1/login
```

### Description

Permet à un utilisateur de se connecter et d'obtenir un access token et un refresh token.

### Corps de la requête

```json
{
  "email": "utilisateur@example.com",
  "password": "motdepasse"
}
```

### Réponse en cas de succès (200 OK)

```json
{
  "message": "Successful login",
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refreshToken": "a1b2c3d4e5f6g7h8",
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "utilisateur@example.com",
    "email_verified_at": "2025-01-01T10:00:00.000000Z",
    "created_at": "2025-01-01T10:00:00.000000Z",
    "updated_at": "2025-01-01T10:00:00.000000Z"
  }
}
```

### Réponse en cas d'erreur (401 Unauthorized)

```json
{
  "error": "invalid credentials"
}
```

Ou en cas de validation échouée :

```json
{
  "error": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

### Exemple avec cURL

```bash
curl -X POST http://auth.gestsis.ch/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "utilisateur@example.com",
    "password": "motdepasse"
  }'
```

### Exemple avec JavaScript (fetch)

```javascript
const response = await fetch('http://auth.gestsis.ch/api/v1/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'utilisateur@example.com',
    password: 'motdepasse'
  })
});

const data = await response.json();

if (response.ok) {
  console.log('Access Token:', data.accessToken);
  console.log('Refresh Token:', data.refreshToken);
  
  // Stocker les tokens (par exemple dans localStorage)
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
} else {
  console.error('Erreur de connexion:', data.error);
}
```

---

## 2. Rafraîchir le Token (Refresh Token)

### Endpoint

```
POST /api/v1/refresh-token
```

### Description

Permet de renouveler l'access token en utilisant le refresh token. Le refresh token est à usage unique : après utilisation, il est détruit et un nouveau refresh token est généré.

### Corps de la requête

```json
{
  "token": "a1b2c3d4e5f6g7h8"
}
```

### Réponse en cas de succès (200 OK)

```json
{
  "message": "Successful login",
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refreshToken": "x9y8z7w6v5u4t3s2",
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "utilisateur@example.com",
    "email_verified_at": "2025-01-01T10:00:00.000000Z",
    "created_at": "2025-01-01T10:00:00.000000Z",
    "updated_at": "2025-01-01T10:00:00.000000Z"
  }
}
```

### Réponse en cas d'erreur (401 Unauthorized)

```json
{
  "error": "Refresh token expired"
}
```

Ou en cas de validation échouée :

```json
{
  "error": {
    "token": ["The token field is required."]
  }
}
```

### Exemple avec cURL

```bash
curl -X POST http://auth.gestsis.ch/api/v1/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "a1b2c3d4e5f6g7h8"
  }'
```

### Exemple avec JavaScript (fetch)

```javascript
const refreshToken = localStorage.getItem('refreshToken');

const response = await fetch('http://auth.gestsis.ch/api/v1/refresh-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: refreshToken
  })
});

const data = await response.json();

if (response.ok) {
  // Mettre à jour les tokens stockés
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  
  console.log('Tokens renouvelés avec succès');
} else {
  console.error('Erreur de rafraîchissement:', data.error);
  // Si le refresh token a expiré, rediriger vers la page de connexion
  if (data.error === 'Refresh token expired') {
    window.location.href = '/login';
  }
}
```

---

## Utilisation des Tokens

### Structure de l'Access Token

L'access token est un JWT (JSON Web Token) signé avec RSA-256 qui contient les informations suivantes :

#### Structure complète

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

#### Description des champs

**Headers JWT standard :**
- **iss** (Issuer) : `GestSIS_Auth` - Émetteur du token
- **aud** (Audience) : `GestSIS_API` - Destinataire du token
- **iat** (Issued At) : Timestamp UNIX de la création du token
- **nbf** (Not Before) : Timestamp UNIX à partir duquel le token est valide (10 secondes avant iat)
- **exp** (Expiration) : Timestamp UNIX d'expiration (8 heures après iat)

**Données utilisateur (data) :**
- **id** : Identifiant unique de l'utilisateur dans GestSIS_Auth
- **admin** : Booléen indiquant si l'utilisateur est administrateur (a tous les droits sur tous les SIS)
- **validated** : Booléen indiquant si l'email de l'utilisateur a été vérifié
- **pseudo** : Nom d'affichage de l'utilisateur
- **email** : Adresse email de l'utilisateur

**Données multi-SIS :**
- **permissions** : Objet où chaque clé est l'`api_key` d'un SIS, contenant un tableau des permissions pour ce SIS
  - Exemple : `{"test": ["intervention.lecture", "sapeur.modification"]}`
  - Si l'utilisateur est admin, toutes les clés SIS contiennent `["admin"]`
- **mobiles** : Tableau simple contenant les `api_key` des SIS pour lesquels l'utilisateur peut recevoir des alertes mobiles
  - Exemple : `["test", "hs"]`
- **sapeurs** : Objet où chaque clé est l'`api_key` d'un SIS, contenant l'ID du sapeur associé à l'utilisateur dans ce SIS
  - Exemple : `{"test": 42, "hs": 108}`

#### Architecture multi-tenant

**Important** : Les permissions, mobiles et sapeurs sont organisés par SIS. Cela permet à un utilisateur :
- D'avoir des permissions différentes selon le SIS
- D'être sapeur dans plusieurs SIS avec des IDs différents
- De recevoir des alertes mobiles uniquement pour certains SIS

Exemple : Un utilisateur peut être chef d'intervention dans le SDIS Jura mais simple sapeur dans le SDIS Neuchâtel.

### Utiliser l'Access Token dans les requêtes API

Pour authentifier une requête API, incluez l'access token dans le header `Authorization` :

```
Authorization: Bearer {accessToken}
```

### Exemple complet d'utilisation

```javascript
// 1. Connexion
const loginResponse = await fetch('http://auth.gestsis.ch/api/v1/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'utilisateur@example.com',
    password: 'motdepasse'
  })
});

const loginData = await loginResponse.json();
localStorage.setItem('accessToken', loginData.accessToken);
localStorage.setItem('refreshToken', loginData.refreshToken);

// 2. Utiliser l'access token pour une requête protégée
const apiResponse = await fetch('http://apis.gestsis.ch/api/v1/protected-resource', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

// 3. Si le token a expiré (erreur 401), le rafraîchir
if (apiResponse.status === 401) {
  const refreshResponse = await fetch('http://auth.gestsis.ch/api/v1/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });
  
  const refreshData = await refreshResponse.json();
  localStorage.setItem('accessToken', refreshData.accessToken);
  localStorage.setItem('refreshToken', refreshData.refreshToken);
  
  // Réessayer la requête avec le nouveau token
  const retryResponse = await fetch('http://apis.gestsis.ch/api/v1/protected-resource', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
}
```

---

## Bonnes Pratiques

### Sécurité

1. **Ne jamais exposer les tokens** : Ne jamais afficher les tokens dans les logs ou les messages d'erreur
2. **Stockage sécurisé** : Utiliser des mécanismes sécurisés pour stocker les tokens (httpOnly cookies pour le web)
3. **HTTPS uniquement** : Toujours utiliser HTTPS en production pour éviter l'interception des tokens
4. **Refresh token à usage unique** : Le système utilise des refresh tokens à usage unique pour prévenir le vol de tokens

### Gestion des Tokens

1. **Renouvellement automatique** : Implémenter un mécanisme de renouvellement automatique avant l'expiration
2. **Gestion des erreurs** : Rediriger vers la page de connexion si le refresh token a expiré
3. **Déconnexion** : Supprimer les tokens stockés lors de la déconnexion

```javascript
// Fonction utilitaire pour gérer le renouvellement automatique
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  // Si le token a expiré, le rafraîchir et réessayer
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshResponse = await fetch('http://auth.gestsis.ch/api/v1/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    });
    
    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Réessayer la requête originale
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${data.accessToken}`
        }
      });
    } else {
      // Refresh token expiré, rediriger vers login
      window.location.href = '/login';
      throw new Error('Session expirée');
    }
  }
  
  return response;
}
```

### Durée de vie des Tokens

- **Access Token** : 8 heures
- **Refresh Token** : 30 jours
- **Reset Token** : 1 heure
- **Confirmation Token** : 30 jours

---

## Autres Endpoints d'Authentification

### Inscription

```
POST /api/v1/register
```

Permet de créer un nouveau compte utilisateur.

### Confirmation d'Email

```
POST /api/v1/confirmer-email
```

Permet de confirmer l'adresse email d'un nouvel utilisateur.

### Mot de Passe Oublié

```
POST /api/v1/forgotten-password
```

Demande un lien de réinitialisation de mot de passe.

### Réinitialiser le Mot de Passe

```
POST /api/v1/reset-password
```

Réinitialise le mot de passe avec un token de réinitialisation.

### Changer le Mot de Passe

```
POST /api/v1/change-password
```

Permet à un utilisateur authentifié de changer son mot de passe.

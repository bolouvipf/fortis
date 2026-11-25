# FORTIS

Site officiel de FORTIS — société de services au Bénin : bâtiment et travaux
publics, comptabilité, formation et commerce. Le site inclut la demande en ligne
de quittances de formation, validées par l'administration puis envoyées par email.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind-free design system (CSS variables, Fraunces + Inter)
- Drizzle ORM + `@libsql/client` (SQLite local / Turso en production)
- `pdf-lib` + `qrcode` pour les quittances PDF
- Resend pour l'envoi d'emails
- `bcryptjs` + `jose` pour l'authentification administrateur
- Vitest pour les tests

## Installation locale

```bash
npm install
cp .env.example .env.local
# renseignez AUTH_SECRET et ADMIN_PASSWORD (voir ci-dessous)
npm run setup        # migrations + seed du compte admin
npm run dev
```

Le site est disponible sur http://localhost:3000.
L'espace administration sur http://localhost:3000/admin/login.

### Générer un secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Collez le résultat dans `AUTH_SECRET` (32 caractères minimum).

### Compte administrateur

Le compte est créé par `npm run db:seed` à partir de `ADMIN_EMAIL`,
`ADMIN_NAME` et `ADMIN_PASSWORD`. Si `ADMIN_PASSWORD` est vide, un mot de passe
fort est généré et affiché une seule fois dans la console.

Les identifiants locaux sont conservés dans `CREDENTIALS.local.txt`
(gitignored).

## Workflow des quittances

1. Le client remplit le formulaire sur `/quittance`.
2. La demande est enregistrée en base avec le statut `pending` et une
   référence de suivi. Un accusé de réception est envoyé par email.
3. L'administrateur se connecte à `/admin`, vérifie le paiement et décide :
   - **Valider** : un numéro unique `FORTIS-YYYY-NNNN` est attribué, le PDF est
     généré avec le cachet et envoyé par email au client.
   - **Rejeter** : la demande est marquée rejetée et le client reçoit le motif.
4. Le client suit l'avancement sur `/quittance/confirmation/[token]` et
   télécharge la quittance sur `/q/[token]` une fois validée.
5. Toute quittance validée peut être vérifiée publiquement sur `/verifier`.

Chaque décision est journalisée dans la table `audit_logs`.

## Variables d'environnement

| Variable | Obligatoire | Description |
| --- | --- | --- |
| `APP_URL` | Oui (prod) | URL publique du site, utilisée dans les emails et les QR codes. |
| `AUTH_SECRET` | Oui | Secret de signature des sessions (32 caractères minimum). |
| `ADMIN_NAME` | Non | Nom affiché de l'administrateur. |
| `ADMIN_EMAIL` | Oui (seed) | Email du premier administrateur. |
| `ADMIN_PASSWORD` | Non | Mot de passe initial. Généré si absent. |
| `RESEND_API_KEY` | Non (dev) | Clé Resend. Sans clé, les emails sont écrits dans `.emails/`. |
| `MAIL_FROM` | Non | Expéditeur des emails. |
| `ADMIN_NOTIFICATION_EMAIL` | Non | Adresse supplémentaire notifiée à chaque nouvelle demande. |
| `TURSO_DATABASE_URL` | Oui (prod) | URL de la base Turso (ou `file:./data/fortis.db` en local). |
| `TURSO_AUTH_TOKEN` | Oui (prod) | Jeton d'authentification Turso. |

## Déploiement (Vercel + Turso + Resend)

1. Créez une base Turso : `turso db create fortis` puis
   `turso db show fortis --url` et `turso db tokens create fortis`.
2. Renseignez `TURSO_DATABASE_URL` et `TURSO_AUTH_TOKEN` dans Vercel.
3. Configurez Resend et validez un domaine expéditeur, puis renseignez
   `RESEND_API_KEY` et `MAIL_FROM`.
4. Définissez `APP_URL` sur l'URL de production.
5. Déployez : Vercel exécute `next build`. Les migrations sont appliquées
   manuellement : `npm run db:migrate` avec les variables de production.
6. Créez le compte admin : `npm run db:seed` avec `ADMIN_EMAIL` et
   `ADMIN_PASSWORD`.

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run typecheck` — vérification TypeScript
- `npm test` — tests unitaires
- `npm run db:generate` — génère une migration Drizzle
- `npm run db:migrate` — applique les migrations
- `npm run db:seed` — crée/met à jour le compte administrateur
- `npm run setup` — migrations + seed

## Sécurité

- Les mots de passe sont hachés avec bcrypt (coût 12).
- Les sessions sont des JWT signés (HS256) stockés dans un cookie httpOnly,
  `SameSite=Lax`, sécurisé en production, durée 12 heures.
- La connexion est limitée à 6 tentatives par 15 minutes par IP.
- Aucun middleware : la protection des routes admin se fait dans le layout et
  les actions serveur (`requireAdmin`).
- Les quittances ne sont délivrées qu'après validation humaine.
- Les données personnelles collectées sont limitées à celles nécessaires au
  traitement (voir `/confidentialite`).

## Licence

Projet privé — tous droits réservés à FORTIS.

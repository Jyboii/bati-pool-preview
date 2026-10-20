# Bâti Pool — déploiement Hostinger

Site Next.js avec formulaire de devis, avis clients et tableau de bord privé `/admin`. L'infrastructure de production utilise uniquement des services Hostinger : application Node.js, base MariaDB/MySQL et boîte Hostinger Email pour les alertes SMTP. Les trois photos remplaçables sont conservées dans la base, ce qui évite de perdre les fichiers lors d'un redéploiement.

## Hébergement requis

Choisir une offre **Business Web Hosting** ou **Cloud** avec les applications Node.js, ou un VPS Hostinger. Le simple hébergement de fichiers statiques ne suffit pas aux formulaires et à `/admin`. Déployer le projet en tant que **Next.js (serveur)** avec Node.js 22 ou 24. Le projet inclut `npm run build` et `npm start`.

## Mise en service dans hPanel

1. Créer une base dans **Websites → Dashboard → Databases → Management**. Noter son nom, son utilisateur, son mot de passe et son hôte (souvent `localhost`).
2. Ouvrir **phpMyAdmin** sur cette base et importer [`hostinger-init.sql`](hostinger-init.sql) **une seule fois, dans une base vide**. Cela crée les tables des devis, avis, photos et limites de requêtes.
3. Activer une boîte **Hostinger Email**, par exemple `devis@votre-domaine.fr`. Son mot de passe SMTP est distinct du mot de passe de la base.
4. Dans hPanel, choisir **Add Website → Deploy Web App**, importer le dépôt GitHub ou un fichier ZIP et sélectionner **Next.js**. Utiliser Node.js 22 ou 24 ; les commandes sont `npm run build` et `npm start` si Hostinger les demande.
5. Ajouter les variables listées dans [`.env.example`](.env.example) aux variables d'environnement de l'application. `DB_*` relient MariaDB, `SMTP_USER` et `SMTP_PASSWORD` relient la boîte Hostinger Email, et `QUOTE_ALERT_EMAIL` est le destinataire des notifications. `SITE_PUBLIC_URL` doit être l'URL HTTPS finale, sans slash final.
6. Définir `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (SHA-256 hexadécimal d'un mot de passe long et unique) et `ADMIN_SESSION_SECRET` (valeur aléatoire d'au moins 32 caractères). Ne pas enregistrer ces secrets dans Git.
7. Déployer puis vérifier : un devis d'essai dans `/admin`, sa notification par e-mail, la validation d'un avis et le remplacement puis la remise à zéro d'une photo.

Pour calculer `ADMIN_PASSWORD_HASH` sans mettre le mot de passe dans l'historique du terminal, lancer la commande suivante, saisir le mot de passe puis appuyer sur Entrée :

```bash
node -e "const c=require('node:crypto'); process.stdin.once('data', x => console.log(c.createHash('sha256').update(x.toString().trimEnd()).digest('hex')))"
```

Pour générer `ADMIN_SESSION_SECRET` :

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Hostinger Email utilise ici `smtp.hostinger.com` en TLS sur le port 465. Une demande de devis est enregistrée en base avant l'envoi de la notification. Si la boîte n'est pas configurée ou si le SMTP échoue, le devis reste visible dans `/admin` ; consulter les journaux de l'application pour diagnostiquer l'e-mail.

L'application limite les photos à **1 Mo** après réduction automatique dans le navigateur. Les données de l'ancien hébergement D1/R2 ou du brouillon Vercel/Neon ne sont pas importées automatiquement. Exporter les données nécessaires avant de fermer l'ancien site. `drizzle-mysql/` contient le schéma de développement correspondant au SQL à importer.

## Développement local

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Tant que les identifiants `DB_*` ne sont pas renseignés, les pages publiques montrent les photos par défaut sans avis ; les formulaires et `/admin` exigent la base. `.env.local` reste hors Git.

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Pour modifier le schéma plus tard, utiliser `npm run db:generate` et examiner le SQL produit dans `drizzle-mysql/`. Ne pas réimporter `hostinger-init.sql` dans une base déjà utilisée.

## Aperçu GitHub Pages

Le dépôt publie aussi un aperçu statique sur GitHub Pages. Après une modification visuelle, lancer `npm run build:pages`, puis committer et pousser les fichiers générés à la racine du dépôt. Cet aperçu affiche les pages et les photos actuelles ; les formulaires y indiquent qu'aucune demande ni aucun avis n'est envoyé. La route `/admin` de l'aperçu est une démonstration visuelle avec des données fictives et des commandes désactivées. La véritable administration et les fonctions avec base de données nécessitent le déploiement serveur Hostinger.

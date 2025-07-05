<a name="readme-top"></a>

# HelloRooty - Plateforme interactive pour apprendre les langages de programmation

---

## 🚀 Présentation

**HelloRooty** est une plateforme interactive pour apprendre les langages de programmation (Python, JavaScript, etc.) de façon ludique et progressive. Ce projet est un fork d'un clone open-source, entièrement réorienté pour l'apprentissage du code.

---

## 📁 Structure du projet

```bash
duolingo-clone/   # (Nom d'origine du dossier, à renommer si besoin)
  |- actions/
  |- app/
  |- components/
  |- config/
  |- db/
  |- lib/
  |- public/
  |- scripts/
  |- store/
  |- ...
```

---

## 🛠️ Démarrage rapide

1. **Pré-requis** : Installe Node.js et Git.
2. **Clone le dépôt** :
   ```bash
   git clone [URL_DU_REPO]
   cd duolingo-clone
   ```
3. **Configuration** :
   - Crée un fichier `.env` à la racine (voir `.env.example`).
   - Renseigne les clés Clerk, la base de données PostgreSQL, et Stripe si besoin.
4. **Installation des dépendances** :
   ```bash
   npm install --legacy-peer-deps
   ```
5. **Initialisation de la base de données** :
   ```bash
   npm run db:push && npm run db:prod
   ```
6. **Lancer le projet** :
   ```bash
   npm run dev
   ```
7. **Accède à l'application** :
   Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## 💡 Fonctionnalités principales

- Progression par unités et leçons adaptées à chaque langage de programmation
- Défis interactifs : QCM, code à compléter, correction d'erreurs, etc.
- Système de points, badges et classement
- Interface moderne et responsive
- Administration des cours, leçons et challenges

---

## 🖥️ Technologies utilisées

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** (Neon)
- **Clerk** (authentification)
- **Stripe** (paiements)
- **Drizzle ORM**

---

## ✨ Exemples de captures d'écran

L'application propose une interface moderne avec :
- Des leçons interactives
- Des défis de code
- Une boutique avec des récompenses
- Un système de progression

---

## 🤝 Contribuer

Toute contribution est la bienvenue !
- Fork le projet
- Crée une branche (`git checkout -b feature/ma-fonctionnalite`)
- Commit tes modifications (`git commit -m 'Ajout d\'une fonctionnalité'`)
- Push la branche (`git push origin feature/ma-fonctionnalite`)
- Ouvre une Pull Request

---

## 📚 Ressources & Remerciements

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk](https://clerk.com/)
- [Neon Database](https://neon.tech/)
- [Stripe](https://stripe.com/)

---

<p align="right">(<a href="#readme-top">retour en haut</a>)</p>

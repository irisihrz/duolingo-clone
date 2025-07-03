import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding Python course only");

    // Supprimer uniquement les données Python
    const pythonCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Python")
    });
    if (!pythonCourse) {
      console.log("Python course not found");
      return;
    }
    const pythonUnits = await db.query.units.findMany({
      where: (units, { eq }) => eq(units.courseId, pythonCourse.id)
    });
    const pythonUnitIds = pythonUnits.map(u => u.id);
    const pythonLessons = await db.query.lessons.findMany({
      where: (lessons, { inArray }) => inArray(lessons.unitId, pythonUnitIds)
    });
    const pythonLessonIds = pythonLessons.map(l => l.id);
    const pythonChallenges = await db.query.challenges.findMany({
      where: (challenges, { inArray }) => inArray(challenges.lessonId, pythonLessonIds)
    });
    const pythonChallengeIds = pythonChallenges.map(c => c.id);

    // Supprimer les données Python existantes
    if (pythonChallengeIds.length > 0) {
      await db.delete(schema.challengeOptions).where(
        inArray(schema.challengeOptions.challengeId, pythonChallengeIds)
      );
      await db.delete(schema.challenges).where(
        inArray(schema.challenges.id, pythonChallengeIds)
      );
    }
    if (pythonLessonIds.length > 0) {
      await db.delete(schema.lessons).where(
        inArray(schema.lessons.id, pythonLessonIds)
      );
    }
    if (pythonUnitIds.length > 0) {
      await db.delete(schema.units).where(
        inArray(schema.units.id, pythonUnitIds)
      );
    }

    // Créer des unités très complètes pour Python
    const units = await db.insert(schema.units).values([
      { courseId: pythonCourse.id, title: "Débutant", description: "Découvre les bases de Python", order: 1 },
      { courseId: pythonCourse.id, title: "Intermédiaire", description: "Progresse avec des concepts intermédiaires", order: 2 },
      { courseId: pythonCourse.id, title: "Avancé", description: "Maîtrise les concepts avancés", order: 3 },
      { courseId: pythonCourse.id, title: "Expert", description: "Deviens un expert Python", order: 4 },
      { courseId: pythonCourse.id, title: "Maître", description: "Maîtrise complète de Python", order: 5 },
    ]).returning();

    // === DÉBUTANT ===
    const debutant = units.find((u) => u.title === "Débutant");
    if (debutant) {
      const lessons = await db.insert(schema.lessons).values([
        { unitId: debutant.id, title: "Variables et affichage", order: 1 },
        { unitId: debutant.id, title: "Types de données", order: 2 },
        { unitId: debutant.id, title: "Opérations mathématiques", order: 3 },
        { unitId: debutant.id, title: "Première fonction", order: 4 },
        { unitId: debutant.id, title: "Commentaires", order: 5 },
      ]).returning();
      // Leçon 1 - Variables et affichage
      let challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment créer une variable en Python ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment afficher du texte ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "À quoi sert print() ?", order: 3 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment afficher plusieurs valeurs ?", order: 4 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Quel est le bon format pour une chaîne ?", order: 5 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "x = 5" },
        { challengeId: challenges[0].id, correct: false, text: "let x = 5" },
        { challengeId: challenges[0].id, correct: false, text: "int x = 5" },
        { challengeId: challenges[0].id, correct: false, text: "var x = 5" },
        { challengeId: challenges[1].id, correct: true, text: "print('Hello')" },
        { challengeId: challenges[1].id, correct: false, text: "echo 'Hello'" },
        { challengeId: challenges[1].id, correct: false, text: "console.log('Hello')" },
        { challengeId: challenges[1].id, correct: false, text: "System.out.println('Hello')" },
        { challengeId: challenges[2].id, correct: true, text: "Afficher du texte à l'écran" },
        { challengeId: challenges[2].id, correct: false, text: "Créer une variable" },
        { challengeId: challenges[2].id, correct: false, text: "Définir une fonction" },
        { challengeId: challenges[2].id, correct: false, text: "Importer un module" },
        { challengeId: challenges[3].id, correct: true, text: "print('a', 'b', 'c')" },
        { challengeId: challenges[3].id, correct: false, text: "print('a' + 'b' + 'c')" },
        { challengeId: challenges[3].id, correct: false, text: "print('a', 'b', 'c')" },
        { challengeId: challenges[3].id, correct: false, text: "print('a' & 'b' & 'c')" },
        { challengeId: challenges[4].id, correct: true, text: "'Hello' ou \"Hello\"" },
        { challengeId: challenges[4].id, correct: false, text: "Hello" },
        { challengeId: challenges[4].id, correct: false, text: "`Hello`" },
        { challengeId: challenges[4].id, correct: false, text: "Hello" },
      ]);
      // Leçon 2 - Types de données
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type de 42 ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type de 3.14 ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type de 'Hello' ?", order: 3 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type de True ?", order: 4 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment vérifier le type d'une variable ?", order: 5 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "int" },
        { challengeId: challenges[0].id, correct: false, text: "float" },
        { challengeId: challenges[0].id, correct: false, text: "str" },
        { challengeId: challenges[0].id, correct: false, text: "bool" },
        { challengeId: challenges[1].id, correct: true, text: "float" },
        { challengeId: challenges[1].id, correct: false, text: "int" },
        { challengeId: challenges[1].id, correct: false, text: "double" },
        { challengeId: challenges[1].id, correct: false, text: "decimal" },
        { challengeId: challenges[2].id, correct: true, text: "str" },
        { challengeId: challenges[2].id, correct: false, text: "string" },
        { challengeId: challenges[2].id, correct: false, text: "char" },
        { challengeId: challenges[2].id, correct: false, text: "text" },
        { challengeId: challenges[3].id, correct: true, text: "bool" },
        { challengeId: challenges[3].id, correct: false, text: "boolean" },
        { challengeId: challenges[3].id, correct: false, text: "true" },
        { challengeId: challenges[3].id, correct: false, text: "bit" },
        { challengeId: challenges[4].id, correct: true, text: "type(x)" },
        { challengeId: challenges[4].id, correct: false, text: "typeof(x)" },
        { challengeId: challenges[4].id, correct: false, text: "x.type()" },
        { challengeId: challenges[4].id, correct: false, text: "getType(x)" },
      ]);
      // Leçon 3 - Opérations mathématiques
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment additionner deux nombres ?", order: 1 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment multiplier deux nombres ?", order: 2 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment faire une division ?", order: 3 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment faire une division entière ?", order: 4 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment calculer le reste d'une division ?", order: 5 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "a + b" },
        { challengeId: challenges[0].id, correct: false, text: "a . b" },
        { challengeId: challenges[0].id, correct: false, text: "a & b" },
        { challengeId: challenges[0].id, correct: false, text: "a plus b" },
        { challengeId: challenges[1].id, correct: true, text: "a * b" },
        { challengeId: challenges[1].id, correct: false, text: "a x b" },
        { challengeId: challenges[1].id, correct: false, text: "a . b" },
        { challengeId: challenges[1].id, correct: false, text: "a multiply b" },
        { challengeId: challenges[2].id, correct: true, text: "a / b" },
        { challengeId: challenges[2].id, correct: false, text: "a \\ b" },
        { challengeId: challenges[2].id, correct: false, text: "a ÷ b" },
        { challengeId: challenges[2].id, correct: false, text: "a div b" },
        { challengeId: challenges[3].id, correct: true, text: "a // b" },
        { challengeId: challenges[3].id, correct: false, text: "a / b" },
        { challengeId: challenges[3].id, correct: false, text: "a % b" },
        { challengeId: challenges[3].id, correct: false, text: "a mod b" },
        { challengeId: challenges[4].id, correct: true, text: "a % b" },
        { challengeId: challenges[4].id, correct: false, text: "a // b" },
        { challengeId: challenges[4].id, correct: false, text: "a / b" },
        { challengeId: challenges[4].id, correct: false, text: "a mod b" },
      ]);
      // Leçon 4 - Première fonction
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment définir une fonction ?", order: 1 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment appeler une fonction ?", order: 2 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Que fait return ?", order: 3 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment passer un argument ?", order: 4 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment donner une valeur par défaut ?", order: 5 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "def ma_fonction():" },
        { challengeId: challenges[0].id, correct: false, text: "function ma_fonction() {}" },
        { challengeId: challenges[0].id, correct: false, text: "public void ma_fonction()" },
        { challengeId: challenges[0].id, correct: false, text: "func ma_fonction()" },
        { challengeId: challenges[1].id, correct: true, text: "ma_fonction()" },
        { challengeId: challenges[1].id, correct: false, text: "call ma_fonction" },
        { challengeId: challenges[1].id, correct: false, text: "ma_fonction[]" },
        { challengeId: challenges[1].id, correct: false, text: "ma_fonction.call()" },
        { challengeId: challenges[2].id, correct: true, text: "Renvoie une valeur" },
        { challengeId: challenges[2].id, correct: false, text: "Affiche du texte" },
        { challengeId: challenges[2].id, correct: false, text: "Crée une variable" },
        { challengeId: challenges[2].id, correct: false, text: "Définit une fonction" },
        { challengeId: challenges[3].id, correct: true, text: "def f(x): return x" },
        { challengeId: challenges[3].id, correct: false, text: "def f(): return x" },
        { challengeId: challenges[3].id, correct: false, text: "f(x) = x" },
        { challengeId: challenges[3].id, correct: false, text: "function f(x) { return x }" },
        { challengeId: challenges[4].id, correct: true, text: "def f(x=1): return x" },
        { challengeId: challenges[4].id, correct: false, text: "def f(x): return x" },
        { challengeId: challenges[4].id, correct: false, text: "def f(x:1): return x" },
        { challengeId: challenges[4].id, correct: false, text: "def f(x==1): return x" },
      ]);
      // Leçon 5 - Commentaires
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment écrire un commentaire ?", order: 1 },
        { lessonId: lessons[4].id, type: "SELECT", question: "À quoi servent les commentaires ?", order: 2 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment écrire un commentaire sur plusieurs lignes ?", order: 3 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Les commentaires sont-ils exécutés ?", order: 4 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Quel symbole commence un commentaire ?", order: 5 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "# Ceci est un commentaire" },
        { challengeId: challenges[0].id, correct: false, text: "// Ceci est un commentaire" },
        { challengeId: challenges[0].id, correct: false, text: "<!-- Ceci est un commentaire -->" },
        { challengeId: challenges[0].id, correct: false, text: "/* Ceci est un commentaire */" },
        { challengeId: challenges[1].id, correct: true, text: "Expliquer le code" },
        { challengeId: challenges[1].id, correct: false, text: "Exécuter du code" },
        { challengeId: challenges[1].id, correct: false, text: "Créer une variable" },
        { challengeId: challenges[1].id, correct: false, text: "Afficher du texte" },
        { challengeId: challenges[2].id, correct: true, text: "Utiliser plusieurs # ou des chaînes multilignes" },
        { challengeId: challenges[2].id, correct: false, text: "Utiliser // sur chaque ligne" },
        { challengeId: challenges[2].id, correct: false, text: "Utiliser /* ... */" },
        { challengeId: challenges[2].id, correct: false, text: "Impossible en Python" },
        { challengeId: challenges[3].id, correct: true, text: "Non" },
        { challengeId: challenges[3].id, correct: false, text: "Oui" },
        { challengeId: challenges[3].id, correct: false, text: "Parfois" },
        { challengeId: challenges[3].id, correct: false, text: "Seulement si on les exécute" },
        { challengeId: challenges[4].id, correct: true, text: "#" },
        { challengeId: challenges[4].id, correct: false, text: "//" },
        { challengeId: challenges[4].id, correct: false, text: "/*" },
        { challengeId: challenges[4].id, correct: false, text: "<!--" },
      ]);
    }

    // === INTERMÉDIAIRE ===
    const inter = units.find((u) => u.title === "Intermédiaire");
    if (inter) {
      const lessons = await db.insert(schema.lessons).values([
        { unitId: inter.id, title: "Boucles for", order: 1 },
        { unitId: inter.id, title: "Boucles while", order: 2 },
        { unitId: inter.id, title: "Conditions if/elif/else", order: 3 },
        { unitId: inter.id, title: "Listes", order: 4 },
        { unitId: inter.id, title: "Dictionnaires", order: 5 },
      ]).returning();

      // Leçon 1 - Boucles for
      let challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment faire une boucle for de 0 à 4 ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment itérer sur une liste ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment faire une boucle avec enumerate ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "for i in range(5):" },
        { challengeId: challenges[0].id, correct: false, text: "for i in 5:" },
        { challengeId: challenges[0].id, correct: false, text: "for i = 0; i < 5; i++:" },
        { challengeId: challenges[1].id, correct: true, text: "for item in ma_liste:" },
        { challengeId: challenges[1].id, correct: false, text: "for item in ma_liste():" },
        { challengeId: challenges[1].id, correct: false, text: "foreach item in ma_liste:" },
        { challengeId: challenges[2].id, correct: true, text: "for i, item in enumerate(liste):" },
        { challengeId: challenges[2].id, correct: false, text: "for i, item in list(enumerate):" },
        { challengeId: challenges[2].id, correct: false, text: "for enumerate(i, item):" },
      ]);

      // Leçon 2 - Boucles while
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment faire une boucle while ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment sortir d'une boucle ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment passer à l'itération suivante ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "while condition:" },
        { challengeId: challenges[0].id, correct: false, text: "while(condition)" },
        { challengeId: challenges[0].id, correct: false, text: "while condition {" },
        { challengeId: challenges[1].id, correct: true, text: "break" },
        { challengeId: challenges[1].id, correct: false, text: "exit" },
        { challengeId: challenges[1].id, correct: false, text: "stop" },
        { challengeId: challenges[2].id, correct: true, text: "continue" },
        { challengeId: challenges[2].id, correct: false, text: "skip" },
        { challengeId: challenges[2].id, correct: false, text: "next" },
      ]);

      // Leçon 3 - Conditions
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment écrire une condition if ?", order: 1 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Que fait elif ?", order: 2 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment écrire un else ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "if x > 5:" },
        { challengeId: challenges[0].id, correct: false, text: "if(x > 5)" },
        { challengeId: challenges[0].id, correct: false, text: "if x > 5 {" },
        { challengeId: challenges[1].id, correct: true, text: "Permet de tester une autre condition" },
        { challengeId: challenges[1].id, correct: false, text: "Crée une boucle" },
        { challengeId: challenges[1].id, correct: false, text: "Définit une fonction" },
        { challengeId: challenges[2].id, correct: true, text: "else:" },
        { challengeId: challenges[2].id, correct: false, text: "else {}" },
        { challengeId: challenges[2].id, correct: false, text: "otherwise" },
      ]);

      // Leçon 4 - Listes
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment créer une liste ?", order: 1 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment accéder au premier élément ?", order: 2 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment ajouter un élément ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "[1, 2, 3]" },
        { challengeId: challenges[0].id, correct: false, text: "list(1,2,3)" },
        { challengeId: challenges[0].id, correct: false, text: "{1,2,3}" },
        { challengeId: challenges[1].id, correct: true, text: "ma_liste[0]" },
        { challengeId: challenges[1].id, correct: false, text: "ma_liste(0)" },
        { challengeId: challenges[1].id, correct: false, text: "ma_liste{0}" },
        { challengeId: challenges[2].id, correct: true, text: "ma_liste.append(4)" },
        { challengeId: challenges[2].id, correct: false, text: "ma_liste.add(4)" },
        { challengeId: challenges[2].id, correct: false, text: "ma_liste.push(4)" },
      ]);

      // Leçon 5 - Dictionnaires
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment créer un dictionnaire ?", order: 1 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment accéder à une valeur ?", order: 2 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment ajouter une clé-valeur ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "{'clé': 'valeur'}" },
        { challengeId: challenges[0].id, correct: false, text: "dict('clé', 'valeur')" },
        { challengeId: challenges[0].id, correct: false, text: "['clé': 'valeur']" },
        { challengeId: challenges[1].id, correct: true, text: "mon_dict['clé']" },
        { challengeId: challenges[1].id, correct: false, text: "mon_dict('clé')" },
        { challengeId: challenges[1].id, correct: false, text: "mon_dict.clé" },
        { challengeId: challenges[2].id, correct: true, text: "mon_dict['nouvelle_clé'] = 'valeur'" },
        { challengeId: challenges[2].id, correct: false, text: "mon_dict.add('nouvelle_clé', 'valeur')" },
        { challengeId: challenges[2].id, correct: false, text: "mon_dict['nouvelle_clé'] = 'valeur'" },
      ]);
    }

    // === AVANCÉ ===
    const avance = units.find((u) => u.title === "Avancé");
    if (avance) {
      const lessons = await db.insert(schema.lessons).values([
        { unitId: avance.id, title: "Fonctions avancées", order: 1 },
        { unitId: avance.id, title: "Classes et objets", order: 2 },
        { unitId: avance.id, title: "Gestion d'erreurs", order: 3 },
        { unitId: avance.id, title: "Modules", order: 4 },
        { unitId: avance.id, title: "Fichiers", order: 5 },
      ]).returning();

      // Leçon 1 - Fonctions avancées
      let challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment définir une fonction avec *args ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment définir une fonction avec **kwargs ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Qu'est-ce qu'une fonction lambda ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "def f(*args):" },
        { challengeId: challenges[0].id, correct: false, text: "def f(args):" },
        { challengeId: challenges[0].id, correct: false, text: "def f(...args):" },
        { challengeId: challenges[1].id, correct: true, text: "def f(**kwargs):" },
        { challengeId: challenges[1].id, correct: false, text: "def f(kwargs):" },
        { challengeId: challenges[1].id, correct: false, text: "def f(...kwargs):" },
        { challengeId: challenges[2].id, correct: true, text: "Une fonction anonyme" },
        { challengeId: challenges[2].id, correct: false, text: "Une classe" },
        { challengeId: challenges[2].id, correct: false, text: "Un module" },
      ]);

      // Leçon 2 - Classes et objets
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment définir une classe ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment créer un objet ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment définir un constructeur ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "class MaClasse:" },
        { challengeId: challenges[0].id, correct: false, text: "class MaClasse()" },
        { challengeId: challenges[0].id, correct: false, text: "class MaClasse {}" },
        { challengeId: challenges[1].id, correct: true, text: "objet = MaClasse()" },
        { challengeId: challenges[1].id, correct: false, text: "objet = new MaClasse()" },
        { challengeId: challenges[1].id, correct: false, text: "objet = MaClasse.new()" },
        { challengeId: challenges[2].id, correct: true, text: "def __init__(self):" },
        { challengeId: challenges[2].id, correct: false, text: "def constructor(self):" },
        { challengeId: challenges[2].id, correct: false, text: "def __new__(self):" },
      ]);

      // Leçon 3 - Gestion d'erreurs
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment gérer une exception ?", order: 1 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment capturer une exception spécifique ?", order: 2 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment lever une exception ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "try: ... except:" },
        { challengeId: challenges[0].id, correct: false, text: "try: ... catch:" },
        { challengeId: challenges[0].id, correct: false, text: "try: ... error:" },
        { challengeId: challenges[1].id, correct: true, text: "except ValueError:" },
        { challengeId: challenges[1].id, correct: false, text: "catch ValueError:" },
        { challengeId: challenges[1].id, correct: false, text: "error ValueError:" },
        { challengeId: challenges[2].id, correct: true, text: "raise Exception('message')" },
        { challengeId: challenges[2].id, correct: false, text: "throw Exception('message')" },
        { challengeId: challenges[2].id, correct: false, text: "error Exception('message')" },
      ]);

      // Leçon 4 - Modules
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment importer un module ?", order: 1 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment importer une fonction spécifique ?", order: 2 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment donner un alias à un module ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "import math" },
        { challengeId: challenges[0].id, correct: false, text: "include math" },
        { challengeId: challenges[0].id, correct: false, text: "require math" },
        { challengeId: challenges[1].id, correct: true, text: "from math import sqrt" },
        { challengeId: challenges[1].id, correct: false, text: "import sqrt from math" },
        { challengeId: challenges[1].id, correct: false, text: "include sqrt from math" },
        { challengeId: challenges[2].id, correct: true, text: "import math as m" },
        { challengeId: challenges[2].id, correct: false, text: "import math alias m" },
        { challengeId: challenges[2].id, correct: false, text: "import math -> m" },
      ]);

      // Leçon 5 - Fichiers
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment ouvrir un fichier en lecture ?", order: 1 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment lire tout le contenu ?", order: 2 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment écrire dans un fichier ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "open('fichier.txt', 'r')" },
        { challengeId: challenges[0].id, correct: false, text: "open('fichier.txt', 'read')" },
        { challengeId: challenges[0].id, correct: false, text: "read('fichier.txt')" },
        { challengeId: challenges[1].id, correct: true, text: "fichier.read()" },
        { challengeId: challenges[1].id, correct: false, text: "fichier.readAll()" },
        { challengeId: challenges[1].id, correct: false, text: "fichier.content()" },
        { challengeId: challenges[2].id, correct: true, text: "fichier.write('texte')" },
        { challengeId: challenges[2].id, correct: false, text: "fichier.append('texte')" },
        { challengeId: challenges[2].id, correct: false, text: "fichier.put('texte')" },
      ]);
    }

    // === EXPERT ===
    const expert = units.find((u) => u.title === "Expert");
    if (expert) {
      const lessons = await db.insert(schema.lessons).values([
        { unitId: expert.id, title: "Décorateurs", order: 1 },
        { unitId: expert.id, title: "Générateurs", order: 2 },
        { unitId: expert.id, title: "Contexte managers", order: 3 },
        { unitId: expert.id, title: "Métaclasses", order: 4 },
        { unitId: expert.id, title: "Optimisation", order: 5 },
      ]).returning();

      // Leçon 1 - Décorateurs
      let challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment définir un décorateur ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Que fait @property ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment utiliser un décorateur ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "def mon_decorateur(fonction):" },
        { challengeId: challenges[0].id, correct: false, text: "def decorateur(fonction):" },
        { challengeId: challenges[0].id, correct: false, text: "def wrapper(fonction):" },
        { challengeId: challenges[1].id, correct: true, text: "Transforme une méthode en propriété" },
        { challengeId: challenges[1].id, correct: false, text: "Crée une classe" },
        { challengeId: challenges[1].id, correct: false, text: "Définit une fonction" },
        { challengeId: challenges[2].id, correct: true, text: "@mon_decorateur" },
        { challengeId: challenges[2].id, correct: false, text: "#mon_decorateur" },
        { challengeId: challenges[2].id, correct: false, text: "$mon_decorateur" },
      ]);

      // Leçon 2 - Générateurs
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment créer un générateur ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Que fait yield ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment itérer sur un générateur ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "def mon_generateur():" },
        { challengeId: challenges[0].id, correct: false, text: "def generator():" },
        { challengeId: challenges[0].id, correct: false, text: "def yield():" },
        { challengeId: challenges[1].id, correct: true, text: "Retourne une valeur et pause" },
        { challengeId: challenges[1].id, correct: false, text: "Termine la fonction" },
        { challengeId: challenges[1].id, correct: false, text: "Crée une boucle" },
        { challengeId: challenges[2].id, correct: true, text: "for item in mon_generateur():" },
        { challengeId: challenges[2].id, correct: false, text: "for item in generator():" },
        { challengeId: challenges[2].id, correct: false, text: "for item in yield():" },
      ]);

      // Leçon 3 - Contexte managers
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment utiliser with ?", order: 1 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Que fait with open() ?", order: 2 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment créer un contexte manager ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "with open('fichier.txt') as f:" },
        { challengeId: challenges[0].id, correct: false, text: "with open('fichier.txt') f:" },
        { challengeId: challenges[0].id, correct: false, text: "with open('fichier.txt'):" },
        { challengeId: challenges[1].id, correct: true, text: "Ferme automatiquement le fichier" },
        { challengeId: challenges[1].id, correct: false, text: "Ouvre le fichier" },
        { challengeId: challenges[1].id, correct: false, text: "Lit le fichier" },
        { challengeId: challenges[2].id, correct: true, text: "class MonContexteManager:" },
        { challengeId: challenges[2].id, correct: false, text: "def mon_contexte_manager():" },
        { challengeId: challenges[2].id, correct: false, text: "with mon_contexte_manager():" },
      ]);

      // Leçon 4 - Métaclasses
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[3].id, type: "SELECT", question: "Qu'est-ce qu'une métaclasse ?", order: 1 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment définir une métaclasse ?", order: 2 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Quand utiliser une métaclasse ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "Une classe qui crée des classes" },
        { challengeId: challenges[0].id, correct: false, text: "Une classe normale" },
        { challengeId: challenges[0].id, correct: false, text: "Une fonction" },
        { challengeId: challenges[1].id, correct: true, text: "class MaMetaclasse(type):" },
        { challengeId: challenges[1].id, correct: false, text: "class Metaclasse:" },
        { challengeId: challenges[1].id, correct: false, text: "def metaclasse():" },
        { challengeId: challenges[2].id, correct: true, text: "Pour modifier la création de classes" },
        { challengeId: challenges[2].id, correct: false, text: "Pour créer des variables" },
        { challengeId: challenges[2].id, correct: false, text: "Pour définir des fonctions" },
      ]);

      // Leçon 5 - Optimisation
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment mesurer le temps d'exécution ?", order: 1 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Qu'est-ce que cProfile ?", order: 2 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment optimiser une boucle ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "import time; time.time()" },
        { challengeId: challenges[0].id, correct: false, text: "import time; time.clock()" },
        { challengeId: challenges[0].id, correct: false, text: "import time; time.now()" },
        { challengeId: challenges[1].id, correct: true, text: "Un profiler de performance" },
        { challengeId: challenges[1].id, correct: false, text: "Un module de temps" },
        { challengeId: challenges[1].id, correct: false, text: "Un générateur" },
        { challengeId: challenges[2].id, correct: true, text: "Utiliser des list comprehensions" },
        { challengeId: challenges[2].id, correct: false, text: "Utiliser des boucles for" },
        { challengeId: challenges[2].id, correct: false, text: "Utiliser des fonctions" },
      ]);
    }

    // === MAÎTRE ===
    const maitre = units.find((u) => u.title === "Maître");
    if (maitre) {
      const lessons = await db.insert(schema.lessons).values([
        { unitId: maitre.id, title: "Programmation asynchrone", order: 1 },
        { unitId: maitre.id, title: "Design patterns", order: 2 },
        { unitId: maitre.id, title: "Tests unitaires", order: 3 },
        { unitId: maitre.id, title: "Packaging", order: 4 },
        { unitId: maitre.id, title: "Déploiement", order: 5 },
      ]).returning();

      // Leçon 1 - Programmation asynchrone
      let challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment définir une fonction async ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment attendre une coroutine ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment exécuter plusieurs coroutines ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "async def ma_fonction():" },
        { challengeId: challenges[0].id, correct: false, text: "def async ma_fonction():" },
        { challengeId: challenges[0].id, correct: false, text: "async function ma_fonction():" },
        { challengeId: challenges[1].id, correct: true, text: "await ma_coroutine()" },
        { challengeId: challenges[1].id, correct: false, text: "wait ma_coroutine()" },
        { challengeId: challenges[1].id, correct: false, text: "async ma_coroutine()" },
        { challengeId: challenges[2].id, correct: true, text: "asyncio.gather()" },
        { challengeId: challenges[2].id, correct: false, text: "asyncio.run()" },
        { challengeId: challenges[2].id, correct: false, text: "asyncio.wait()" },
      ]);

      // Leçon 2 - Design patterns
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Qu'est-ce qu'un singleton ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Qu'est-ce qu'un factory ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Qu'est-ce qu'un observer ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "Une classe avec une seule instance" },
        { challengeId: challenges[0].id, correct: false, text: "Une classe normale" },
        { challengeId: challenges[0].id, correct: false, text: "Une fonction" },
        { challengeId: challenges[1].id, correct: true, text: "Une classe qui crée des objets" },
        { challengeId: challenges[1].id, correct: false, text: "Une classe qui détruit des objets" },
        { challengeId: challenges[1].id, correct: false, text: "Une classe qui modifie des objets" },
        { challengeId: challenges[2].id, correct: true, text: "Un pattern de notification" },
        { challengeId: challenges[2].id, correct: false, text: "Un pattern de création" },
        { challengeId: challenges[2].id, correct: false, text: "Un pattern de destruction" },
      ]);

      // Leçon 3 - Tests unitaires
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment écrire un test ?", order: 1 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment exécuter les tests ?", order: 2 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment tester une exception ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "def test_ma_fonction():" },
        { challengeId: challenges[0].id, correct: false, text: "def test():" },
        { challengeId: challenges[0].id, correct: false, text: "def check_ma_fonction():" },
        { challengeId: challenges[1].id, correct: true, text: "python -m pytest" },
        { challengeId: challenges[1].id, correct: false, text: "python test.py" },
        { challengeId: challenges[1].id, correct: false, text: "pytest test.py" },
        { challengeId: challenges[2].id, correct: true, text: "with pytest.raises(ValueError):" },
        { challengeId: challenges[2].id, correct: false, text: "with pytest.error(ValueError):" },
        { challengeId: challenges[2].id, correct: false, text: "with pytest.exception(ValueError):" },
      ]);

      // Leçon 4 - Packaging
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment créer un package ?", order: 1 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Qu'est-ce que setup.py ?", order: 2 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment publier un package ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "Créer un dossier avec __init__.py" },
        { challengeId: challenges[0].id, correct: false, text: "Créer un fichier .py" },
        { challengeId: challenges[0].id, correct: false, text: "Créer un dossier vide" },
        { challengeId: challenges[1].id, correct: true, text: "Un fichier de configuration" },
        { challengeId: challenges[1].id, correct: false, text: "Un fichier de test" },
        { challengeId: challenges[1].id, correct: false, text: "Un fichier de documentation" },
        { challengeId: challenges[2].id, correct: true, text: "python setup.py sdist upload" },
        { challengeId: challenges[2].id, correct: false, text: "python setup.py publish" },
        { challengeId: challenges[2].id, correct: false, text: "python publish.py" },
      ]);

      // Leçon 5 - Déploiement
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[4].id, type: "SELECT", question: "Qu'est-ce que Docker ?", order: 1 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment créer un Dockerfile ?", order: 2 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment déployer sur Heroku ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "Un système de conteneurs" },
        { challengeId: challenges[0].id, correct: false, text: "Un langage de programmation" },
        { challengeId: challenges[0].id, correct: false, text: "Un framework web" },
        { challengeId: challenges[1].id, correct: true, text: "FROM python:3.9" },
        { challengeId: challenges[1].id, correct: false, text: "FROM python" },
        { challengeId: challenges[1].id, correct: false, text: "FROM 3.9" },
        { challengeId: challenges[2].id, correct: true, text: "git push heroku main" },
        { challengeId: challenges[2].id, correct: false, text: "heroku deploy" },
        { challengeId: challenges[2].id, correct: false, text: "git deploy heroku" },
      ]);
    }

    console.log("Python course seeded!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed Python course");
  }
};

void main(); 
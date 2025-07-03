import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding C++ course only");

    // Supprimer uniquement les données C++
    const cppCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "C++")
    });
    if (!cppCourse) {
      console.log("C++ course not found");
      return;
    }
    const cppUnits = await db.query.units.findMany({
      where: (units, { eq }) => eq(units.courseId, cppCourse.id)
    });
    const cppUnitIds = cppUnits.map(u => u.id);
    const cppLessons = await db.query.lessons.findMany({
      where: (lessons, { inArray }) => inArray(lessons.unitId, cppUnitIds)
    });
    const cppLessonIds = cppLessons.map(l => l.id);
    const cppChallenges = await db.query.challenges.findMany({
      where: (challenges, { inArray }) => inArray(challenges.lessonId, cppLessonIds)
    });
    const cppChallengeIds = cppChallenges.map(c => c.id);

    // Supprimer les données C++ existantes
    if (cppChallengeIds.length > 0) {
      await db.delete(schema.challengeOptions).where(
        inArray(schema.challengeOptions.challengeId, cppChallengeIds)
      );
      await db.delete(schema.challenges).where(
        inArray(schema.challenges.id, cppChallengeIds)
      );
    }
    if (cppLessonIds.length > 0) {
      await db.delete(schema.lessons).where(
        inArray(schema.lessons.id, cppLessonIds)
      );
    }
    if (cppUnitIds.length > 0) {
      await db.delete(schema.units).where(
        inArray(schema.units.id, cppUnitIds)
      );
    }

    // Créer des unités très complètes pour C++
    const units = await db.insert(schema.units).values([
      { courseId: cppCourse.id, title: "Débutant", description: "Découvre les bases de C++", order: 1 },
      { courseId: cppCourse.id, title: "Intermédiaire", description: "Progresse avec des concepts intermédiaires", order: 2 },
      { courseId: cppCourse.id, title: "Avancé", description: "Maîtrise les concepts avancés", order: 3 },
      { courseId: cppCourse.id, title: "Expert", description: "Deviens un expert C++", order: 4 },
      { courseId: cppCourse.id, title: "Maître", description: "Maîtrise complète de C++", order: 5 },
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
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment déclarer une variable en C++ ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment afficher du texte ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "À quoi sert cout ?", order: 3 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment afficher sans retour à la ligne ?", order: 4 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Quel header faut-il inclure ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "int x = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "x = 5" },
        { challengeId: challenges[0].id, correct: false, text: "let x = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "var x = 5;" },
        { challengeId: challenges[1].id, correct: true, text: "cout << \"Hello\";" },
        { challengeId: challenges[1].id, correct: false, text: "print('Hello')" },
        { challengeId: challenges[1].id, correct: false, text: "console.log('Hello');" },
        { challengeId: challenges[1].id, correct: false, text: "System.out.println('Hello');" },
        { challengeId: challenges[2].id, correct: true, text: "Afficher du texte à l'écran" },
        { challengeId: challenges[2].id, correct: false, text: "Créer une variable" },
        { challengeId: challenges[2].id, correct: false, text: "Définir une fonction" },
        { challengeId: challenges[2].id, correct: false, text: "Importer un module" },
        { challengeId: challenges[3].id, correct: true, text: "cout << \"Hello\" << endl;" },
        { challengeId: challenges[3].id, correct: false, text: "cout << \"Hello\";" },
        { challengeId: challenges[3].id, correct: false, text: "cout << \"Hello\" << \"\\n\";" },
        { challengeId: challenges[3].id, correct: false, text: "cout << \"Hello\" << newline;" },
        { challengeId: challenges[4].id, correct: true, text: "#include <iostream>" },
        { challengeId: challenges[4].id, correct: false, text: "#include <stdio.h>" },
        { challengeId: challenges[4].id, correct: false, text: "#include <cout>" },
        { challengeId: challenges[4].id, correct: false, text: "#include <output>" },
      ]);

      // Leçon 2 - Types de données
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type pour un entier ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type pour un nombre décimal ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type pour du texte ?", order: 3 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type pour un caractère ?", order: 4 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment déclarer un booléen ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "int" },
        { challengeId: challenges[0].id, correct: false, text: "integer" },
        { challengeId: challenges[0].id, correct: false, text: "number" },
        { challengeId: challenges[0].id, correct: false, text: "Int" },
        { challengeId: challenges[1].id, correct: true, text: "double" },
        { challengeId: challenges[1].id, correct: false, text: "float" },
        { challengeId: challenges[1].id, correct: false, text: "decimal" },
        { challengeId: challenges[1].id, correct: false, text: "Double" },
        { challengeId: challenges[2].id, correct: true, text: "string" },
        { challengeId: challenges[2].id, correct: false, text: "String" },
        { challengeId: challenges[2].id, correct: false, text: "text" },
        { challengeId: challenges[2].id, correct: false, text: "str" },
        { challengeId: challenges[3].id, correct: true, text: "char" },
        { challengeId: challenges[3].id, correct: false, text: "character" },
        { challengeId: challenges[3].id, correct: false, text: "Char" },
        { challengeId: challenges[3].id, correct: false, text: "c" },
        { challengeId: challenges[4].id, correct: true, text: "bool flag = true;" },
        { challengeId: challenges[4].id, correct: false, text: "boolean flag = true;" },
        { challengeId: challenges[4].id, correct: false, text: "Bool flag = true;" },
        { challengeId: challenges[4].id, correct: false, text: "flag = true;" },
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
        { challengeId: challenges[3].id, correct: true, text: "a / b (avec des int)" },
        { challengeId: challenges[3].id, correct: false, text: "a // b" },
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
        { lessonId: lessons[3].id, type: "SELECT", question: "Qu'est-ce que void ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "int maFonction() {}" },
        { challengeId: challenges[0].id, correct: false, text: "def ma_fonction():" },
        { challengeId: challenges[0].id, correct: false, text: "function maFonction() {}" },
        { challengeId: challenges[0].id, correct: false, text: "func maFonction()" },
        { challengeId: challenges[1].id, correct: true, text: "maFonction();" },
        { challengeId: challenges[1].id, correct: false, text: "call maFonction" },
        { challengeId: challenges[1].id, correct: false, text: "maFonction[]" },
        { challengeId: challenges[1].id, correct: false, text: "maFonction.call()" },
        { challengeId: challenges[2].id, correct: true, text: "Renvoie une valeur" },
        { challengeId: challenges[2].id, correct: false, text: "Affiche du texte" },
        { challengeId: challenges[2].id, correct: false, text: "Crée une variable" },
        { challengeId: challenges[2].id, correct: false, text: "Définit une fonction" },
        { challengeId: challenges[3].id, correct: true, text: "int f(int x) { return x; }" },
        { challengeId: challenges[3].id, correct: false, text: "int f() { return x; }" },
        { challengeId: challenges[3].id, correct: false, text: "f(x) = x" },
        { challengeId: challenges[3].id, correct: false, text: "def f(x): return x" },
        { challengeId: challenges[4].id, correct: true, text: "Indique qu'une fonction ne retourne rien" },
        { challengeId: challenges[4].id, correct: false, text: "Indique qu'une fonction retourne un objet" },
        { challengeId: challenges[4].id, correct: false, text: "Indique qu'une fonction est vide" },
        { challengeId: challenges[4].id, correct: false, text: "Indique qu'une fonction est privée" },
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
        { challengeId: challenges[0].id, correct: true, text: "// Ceci est un commentaire" },
        { challengeId: challenges[0].id, correct: false, text: "# Ceci est un commentaire" },
        { challengeId: challenges[0].id, correct: false, text: "<!-- Ceci est un commentaire -->" },
        { challengeId: challenges[0].id, correct: false, text: "/* Ceci est un commentaire */" },
        { challengeId: challenges[1].id, correct: true, text: "Expliquer le code" },
        { challengeId: challenges[1].id, correct: false, text: "Exécuter du code" },
        { challengeId: challenges[1].id, correct: false, text: "Créer une variable" },
        { challengeId: challenges[1].id, correct: false, text: "Afficher du texte" },
        { challengeId: challenges[2].id, correct: true, text: "/* Commentaire sur plusieurs lignes */" },
        { challengeId: challenges[2].id, correct: false, text: "Utiliser plusieurs //" },
        { challengeId: challenges[2].id, correct: false, text: "Utiliser <!-- ... -->" },
        { challengeId: challenges[2].id, correct: false, text: "Impossible en C++" },
        { challengeId: challenges[3].id, correct: true, text: "Non" },
        { challengeId: challenges[3].id, correct: false, text: "Oui" },
        { challengeId: challenges[3].id, correct: false, text: "Parfois" },
        { challengeId: challenges[3].id, correct: false, text: "Seulement si on les exécute" },
        { challengeId: challenges[4].id, correct: true, text: "//" },
        { challengeId: challenges[4].id, correct: false, text: "#" },
        { challengeId: challenges[4].id, correct: false, text: "/*" },
        { challengeId: challenges[4].id, correct: false, text: "<!--" },
      ]);
    }

    console.log("C++ course seeded!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed C++ course");
  }
};

void main(); 
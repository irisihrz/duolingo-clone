import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding JavaScript course only");

    // Supprimer uniquement les données JavaScript
    const jsCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "JavaScript")
    });
    if (!jsCourse) {
      console.log("JavaScript course not found");
      return;
    }
    const jsUnits = await db.query.units.findMany({
      where: (units, { eq }) => eq(units.courseId, jsCourse.id)
    });
    const jsUnitIds = jsUnits.map(u => u.id);
    const jsLessons = await db.query.lessons.findMany({
      where: (lessons, { inArray }) => inArray(lessons.unitId, jsUnitIds)
    });
    const jsLessonIds = jsLessons.map(l => l.id);
    const jsChallenges = await db.query.challenges.findMany({
      where: (challenges, { inArray }) => inArray(challenges.lessonId, jsLessonIds)
    });
    const jsChallengeIds = jsChallenges.map(c => c.id);

    // Supprimer les données JavaScript existantes
    if (jsChallengeIds.length > 0) {
      await db.delete(schema.challengeOptions).where(
        inArray(schema.challengeOptions.challengeId, jsChallengeIds)
      );
      await db.delete(schema.challenges).where(
        inArray(schema.challenges.id, jsChallengeIds)
      );
    }
    if (jsLessonIds.length > 0) {
      await db.delete(schema.lessons).where(
        inArray(schema.lessons.id, jsLessonIds)
      );
    }
    if (jsUnitIds.length > 0) {
      await db.delete(schema.units).where(
        inArray(schema.units.id, jsUnitIds)
      );
    }

    // Créer des unités très complètes pour JavaScript
    const units = await db.insert(schema.units).values([
      { courseId: jsCourse.id, title: "Débutant", description: "Découvre les bases de JavaScript", order: 1 },
      { courseId: jsCourse.id, title: "Intermédiaire", description: "Progresse avec des concepts intermédiaires", order: 2 },
      { courseId: jsCourse.id, title: "Avancé", description: "Maîtrise les concepts avancés", order: 3 },
      { courseId: jsCourse.id, title: "Expert", description: "Deviens un expert JavaScript", order: 4 },
      { courseId: jsCourse.id, title: "Maître", description: "Maîtrise complète de JavaScript", order: 5 },
    ]).returning();

    // === DÉBUTANT ===
    const debutant = units.find((u) => u.title === "Débutant");
    if (debutant) {
      const lessons = await db.insert(schema.lessons).values([
        { unitId: debutant.id, title: "Variables et console", order: 1 },
        { unitId: debutant.id, title: "Types de données", order: 2 },
        { unitId: debutant.id, title: "Opérations et conversions", order: 3 },
        { unitId: debutant.id, title: "Première fonction", order: 4 },
        { unitId: debutant.id, title: "Commentaires", order: 5 },
      ]).returning();

      // Leçon 1 - Variables et console
      let challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment déclarer une variable en JavaScript ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment afficher du texte dans la console ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "À quoi sert console.log() ?", order: 3 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Quelle est la différence entre let et var ?", order: 4 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment déclarer une constante ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "let x = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "x = 5" },
        { challengeId: challenges[0].id, correct: false, text: "int x = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "var x = 5;" },
        { challengeId: challenges[1].id, correct: true, text: "console.log('Hello');" },
        { challengeId: challenges[1].id, correct: false, text: "print('Hello')" },
        { challengeId: challenges[1].id, correct: false, text: "echo 'Hello'" },
        { challengeId: challenges[1].id, correct: false, text: "System.out.println('Hello');" },
        { challengeId: challenges[2].id, correct: true, text: "Afficher du texte dans la console" },
        { challengeId: challenges[2].id, correct: false, text: "Créer une variable" },
        { challengeId: challenges[2].id, correct: false, text: "Définir une fonction" },
        { challengeId: challenges[2].id, correct: false, text: "Importer un module" },
        { challengeId: challenges[3].id, correct: true, text: "let a un scope de bloc, var un scope de fonction" },
        { challengeId: challenges[3].id, correct: false, text: "Aucune différence" },
        { challengeId: challenges[3].id, correct: false, text: "let est plus rapide" },
        { challengeId: challenges[3].id, correct: false, text: "var est plus moderne" },
        { challengeId: challenges[4].id, correct: true, text: "const x = 5;" },
        { challengeId: challenges[4].id, correct: false, text: "let x = 5;" },
        { challengeId: challenges[4].id, correct: false, text: "var x = 5;" },
        { challengeId: challenges[4].id, correct: false, text: "constant x = 5;" },
      ]);

      // Leçon 2 - Types de données
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type de 42 ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type de 'Hello' ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type de true ?", order: 3 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel est le type de null ?", order: 4 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment vérifier le type d'une variable ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "number" },
        { challengeId: challenges[0].id, correct: false, text: "int" },
        { challengeId: challenges[0].id, correct: false, text: "integer" },
        { challengeId: challenges[0].id, correct: false, text: "Number" },
        { challengeId: challenges[1].id, correct: true, text: "string" },
        { challengeId: challenges[1].id, correct: false, text: "String" },
        { challengeId: challenges[1].id, correct: false, text: "text" },
        { challengeId: challenges[1].id, correct: false, text: "char" },
        { challengeId: challenges[2].id, correct: true, text: "boolean" },
        { challengeId: challenges[2].id, correct: false, text: "bool" },
        { challengeId: challenges[2].id, correct: false, text: "Boolean" },
        { challengeId: challenges[2].id, correct: false, text: "true" },
        { challengeId: challenges[3].id, correct: true, text: "object" },
        { challengeId: challenges[3].id, correct: false, text: "null" },
        { challengeId: challenges[3].id, correct: false, text: "undefined" },
        { challengeId: challenges[3].id, correct: false, text: "Null" },
        { challengeId: challenges[4].id, correct: true, text: "typeof x" },
        { challengeId: challenges[4].id, correct: false, text: "type(x)" },
        { challengeId: challenges[4].id, correct: false, text: "x.type()" },
        { challengeId: challenges[4].id, correct: false, text: "getType(x)" },
      ]);

      // Leçon 3 - Opérations et conversions
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment additionner deux nombres ?", order: 1 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment concaténer deux chaînes ?", order: 2 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment convertir un nombre en chaîne ?", order: 3 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment convertir une chaîne en nombre ?", order: 4 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Que fait l'opérateur + avec '2' + 2 ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "a + b" },
        { challengeId: challenges[0].id, correct: false, text: "a . b" },
        { challengeId: challenges[0].id, correct: false, text: "a & b" },
        { challengeId: challenges[0].id, correct: false, text: "a plus b" },
        { challengeId: challenges[1].id, correct: true, text: "'a' + 'b'" },
        { challengeId: challenges[1].id, correct: false, text: "'a' . 'b'" },
        { challengeId: challenges[1].id, correct: false, text: "'a' & 'b'" },
        { challengeId: challenges[1].id, correct: false, text: "'a' concat 'b'" },
        { challengeId: challenges[2].id, correct: true, text: "String(42)" },
        { challengeId: challenges[2].id, correct: false, text: "str(42)" },
        { challengeId: challenges[2].id, correct: false, text: "toString(42)" },
        { challengeId: challenges[2].id, correct: false, text: "string(42)" },
        { challengeId: challenges[3].id, correct: true, text: "Number('42')" },
        { challengeId: challenges[3].id, correct: false, text: "int('42')" },
        { challengeId: challenges[3].id, correct: false, text: "parseInt('42')" },
        { challengeId: challenges[3].id, correct: false, text: "number('42')" },
        { challengeId: challenges[4].id, correct: true, text: "Concatène et donne '22'" },
        { challengeId: challenges[4].id, correct: false, text: "Additionne et donne 4" },
        { challengeId: challenges[4].id, correct: false, text: "Donne une erreur" },
        { challengeId: challenges[4].id, correct: false, text: "Donne 22" },
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
        { challengeId: challenges[0].id, correct: true, text: "function maFonction() {}" },
        { challengeId: challenges[0].id, correct: false, text: "def ma_fonction():" },
        { challengeId: challenges[0].id, correct: false, text: "public void maFonction()" },
        { challengeId: challenges[0].id, correct: false, text: "func maFonction()" },
        { challengeId: challenges[1].id, correct: true, text: "maFonction();" },
        { challengeId: challenges[1].id, correct: false, text: "call maFonction" },
        { challengeId: challenges[1].id, correct: false, text: "maFonction[]" },
        { challengeId: challenges[1].id, correct: false, text: "maFonction.call()" },
        { challengeId: challenges[2].id, correct: true, text: "Renvoie une valeur" },
        { challengeId: challenges[2].id, correct: false, text: "Affiche du texte" },
        { challengeId: challenges[2].id, correct: false, text: "Crée une variable" },
        { challengeId: challenges[2].id, correct: false, text: "Définit une fonction" },
        { challengeId: challenges[3].id, correct: true, text: "function f(x) { return x; }" },
        { challengeId: challenges[3].id, correct: false, text: "function f() { return x; }" },
        { challengeId: challenges[3].id, correct: false, text: "f(x) = x" },
        { challengeId: challenges[3].id, correct: false, text: "def f(x): return x" },
        { challengeId: challenges[4].id, correct: true, text: "function f(x = 1) { return x; }" },
        { challengeId: challenges[4].id, correct: false, text: "function f(x) { return x; }" },
        { challengeId: challenges[4].id, correct: false, text: "function f(x:1) { return x; }" },
        { challengeId: challenges[4].id, correct: false, text: "function f(x==1) { return x; }" },
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
        { challengeId: challenges[2].id, correct: false, text: "Impossible en JavaScript" },
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

    console.log("JavaScript course seeded!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed JavaScript course");
  }
};

void main(); 
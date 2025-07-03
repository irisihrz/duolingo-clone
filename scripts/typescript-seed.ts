import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding TypeScript course only");

    // Supprimer uniquement les données TypeScript
    const tsCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "TypeScript")
    });
    if (!tsCourse) {
      console.log("TypeScript course not found");
      return;
    }
    const tsUnits = await db.query.units.findMany({
      where: (units, { eq }) => eq(units.courseId, tsCourse.id)
    });
    const tsUnitIds = tsUnits.map(u => u.id);
    const tsLessons = await db.query.lessons.findMany({
      where: (lessons, { inArray }) => inArray(lessons.unitId, tsUnitIds)
    });
    const tsLessonIds = tsLessons.map(l => l.id);
    const tsChallenges = await db.query.challenges.findMany({
      where: (challenges, { inArray }) => inArray(challenges.lessonId, tsLessonIds)
    });
    const tsChallengeIds = tsChallenges.map(c => c.id);

    // Supprimer les données TypeScript existantes
    if (tsChallengeIds.length > 0) {
      await db.delete(schema.challengeOptions).where(
        inArray(schema.challengeOptions.challengeId, tsChallengeIds)
      );
      await db.delete(schema.challenges).where(
        inArray(schema.challenges.id, tsChallengeIds)
      );
    }
    if (tsLessonIds.length > 0) {
      await db.delete(schema.lessons).where(
        inArray(schema.lessons.id, tsLessonIds)
      );
    }
    if (tsUnitIds.length > 0) {
      await db.delete(schema.units).where(
        inArray(schema.units.id, tsUnitIds)
      );
    }

    // Créer des unités très complètes pour TypeScript
    const units = await db.insert(schema.units).values([
      { courseId: tsCourse.id, title: "Débutant", description: "Découvre les bases de TypeScript", order: 1 },
      { courseId: tsCourse.id, title: "Intermédiaire", description: "Progresse avec des concepts intermédiaires", order: 2 },
      { courseId: tsCourse.id, title: "Avancé", description: "Maîtrise les concepts avancés", order: 3 },
      { courseId: tsCourse.id, title: "Expert", description: "Deviens un expert TypeScript", order: 4 },
      { courseId: tsCourse.id, title: "Maître", description: "Maîtrise complète de TypeScript", order: 5 },
    ]).returning();

    // === DÉBUTANT ===
    const debutant = units.find((u) => u.title === "Débutant");
    if (debutant) {
      const lessons = await db.insert(schema.lessons).values([
        { unitId: debutant.id, title: "Types et variables", order: 1 },
        { unitId: debutant.id, title: "Interfaces", order: 2 },
        { unitId: debutant.id, title: "Fonctions typées", order: 3 },
        { unitId: debutant.id, title: "Types de base", order: 4 },
        { unitId: debutant.id, title: "Annotations de type", order: 5 },
      ]).returning();

      // Leçon 1 - Types et variables
      let challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment déclarer une variable typée ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Quel est le type de 'Hello' ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment typer un tableau ?", order: 3 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment typer un objet ?", order: 4 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Qu'est-ce que l'inférence de type ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "let x: number = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "let x = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "int x = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "var x = 5;" },
        { challengeId: challenges[1].id, correct: true, text: "string" },
        { challengeId: challenges[1].id, correct: false, text: "number" },
        { challengeId: challenges[1].id, correct: false, text: "boolean" },
        { challengeId: challenges[1].id, correct: false, text: "String" },
        { challengeId: challenges[2].id, correct: true, text: "let tab: number[] = [1,2,3];" },
        { challengeId: challenges[2].id, correct: false, text: "let tab = [1,2,3];" },
        { challengeId: challenges[2].id, correct: false, text: "array tab = [1,2,3];" },
        { challengeId: challenges[2].id, correct: false, text: "let tab: array = [1,2,3];" },
        { challengeId: challenges[3].id, correct: true, text: "let obj: {name: string, age: number};" },
        { challengeId: challenges[3].id, correct: false, text: "let obj = {name: string, age: number};" },
        { challengeId: challenges[3].id, correct: false, text: "object obj: {name: string, age: number};" },
        { challengeId: challenges[3].id, correct: false, text: "let obj: object = {name, age};" },
        { challengeId: challenges[4].id, correct: true, text: "TypeScript devine automatiquement le type" },
        { challengeId: challenges[4].id, correct: false, text: "TypeScript ignore les types" },
        { challengeId: challenges[4].id, correct: false, text: "TypeScript force les types" },
        { challengeId: challenges[4].id, correct: false, text: "TypeScript supprime les types" },
      ]);

      // Leçon 2 - Interfaces
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment définir une interface ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "À quoi sert une interface ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment utiliser une interface ?", order: 3 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment étendre une interface ?", order: 4 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quelle est la différence avec une classe ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "interface User { name: string; }" },
        { challengeId: challenges[0].id, correct: false, text: "class User { name: string; }" },
        { challengeId: challenges[0].id, correct: false, text: "type User = { name: string; }" },
        { challengeId: challenges[0].id, correct: false, text: "struct User { name: string; }" },
        { challengeId: challenges[1].id, correct: true, text: "Définir la structure d'un objet" },
        { challengeId: challenges[1].id, correct: false, text: "Créer une variable" },
        { challengeId: challenges[1].id, correct: false, text: "Définir une fonction" },
        { challengeId: challenges[1].id, correct: false, text: "Importer un module" },
        { challengeId: challenges[2].id, correct: true, text: "let user: User = { name: 'John' };" },
        { challengeId: challenges[2].id, correct: false, text: "let user = { name: 'John' };" },
        { challengeId: challenges[2].id, correct: false, text: "User user = { name: 'John' };" },
        { challengeId: challenges[2].id, correct: false, text: "let user: User = 'John';" },
        { challengeId: challenges[3].id, correct: true, text: "interface Admin extends User { role: string; }" },
        { challengeId: challenges[3].id, correct: false, text: "interface Admin = User + { role: string; }" },
        { challengeId: challenges[3].id, correct: false, text: "interface Admin { User, role: string; }" },
        { challengeId: challenges[3].id, correct: false, text: "interface Admin inherits User { role: string; }" },
        { challengeId: challenges[4].id, correct: true, text: "Une interface ne peut pas être instanciée" },
        { challengeId: challenges[4].id, correct: false, text: "Aucune différence" },
        { challengeId: challenges[4].id, correct: false, text: "Une interface est plus rapide" },
        { challengeId: challenges[4].id, correct: false, text: "Une interface a des méthodes" },
      ]);

      // Leçon 3 - Fonctions typées
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment typer une fonction ?", order: 1 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment typer les paramètres ?", order: 2 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment typer le retour ?", order: 3 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment typer une fonction fléchée ?", order: 4 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Qu'est-ce que void ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "function add(a: number, b: number): number {}" },
        { challengeId: challenges[0].id, correct: false, text: "function add(a, b) {}" },
        { challengeId: challenges[0].id, correct: false, text: "def add(a: number, b: number): number" },
        { challengeId: challenges[0].id, correct: false, text: "func add(a: number, b: number): number" },
        { challengeId: challenges[1].id, correct: true, text: "function greet(name: string) {}" },
        { challengeId: challenges[1].id, correct: false, text: "function greet(name) {}" },
        { challengeId: challenges[1].id, correct: false, text: "function greet(String name) {}" },
        { challengeId: challenges[1].id, correct: false, text: "function greet(name: str) {}" },
        { challengeId: challenges[2].id, correct: true, text: "function getAge(): number { return 25; }" },
        { challengeId: challenges[2].id, correct: false, text: "function getAge() { return 25; }" },
        { challengeId: challenges[2].id, correct: false, text: "function getAge(): int { return 25; }" },
        { challengeId: challenges[2].id, correct: false, text: "function getAge() -> number { return 25; }" },
        { challengeId: challenges[3].id, correct: true, text: "const add = (a: number, b: number): number => a + b;" },
        { challengeId: challenges[3].id, correct: false, text: "const add = (a, b) => a + b;" },
        { challengeId: challenges[3].id, correct: false, text: "function add = (a: number, b: number) => a + b;" },
        { challengeId: challenges[3].id, correct: false, text: "const add: (a: number, b: number) => number = a + b;" },
        { challengeId: challenges[4].id, correct: true, text: "Indique qu'une fonction ne retourne rien" },
        { challengeId: challenges[4].id, correct: false, text: "Indique qu'une fonction retourne un objet" },
        { challengeId: challenges[4].id, correct: false, text: "Indique qu'une fonction est vide" },
        { challengeId: challenges[4].id, correct: false, text: "Indique qu'une fonction est privée" },
      ]);

      // Leçon 4 - Types de base
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[3].id, type: "SELECT", question: "Quels sont les types primitifs ?", order: 1 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Qu'est-ce que any ?", order: 2 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Qu'est-ce que unknown ?", order: 3 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Qu'est-ce que never ?", order: 4 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment typer un tableau ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "string, number, boolean, null, undefined" },
        { challengeId: challenges[0].id, correct: false, text: "string, number, boolean" },
        { challengeId: challenges[0].id, correct: false, text: "String, Number, Boolean" },
        { challengeId: challenges[0].id, correct: false, text: "str, int, bool" },
        { challengeId: challenges[1].id, correct: true, text: "Un type qui accepte n'importe quoi" },
        { challengeId: challenges[1].id, correct: false, text: "Un type pour les nombres" },
        { challengeId: challenges[1].id, correct: false, text: "Un type pour les chaînes" },
        { challengeId: challenges[1].id, correct: false, text: "Un type pour les objets" },
        { challengeId: challenges[2].id, correct: true, text: "Un type plus sûr qu'any'" },
        { challengeId: challenges[2].id, correct: false, text: "Un type pour les nombres inconnus" },
        { challengeId: challenges[2].id, correct: false, text: "Un type pour les chaînes inconnues" },
        { challengeId: challenges[2].id, correct: false, text: "Un type pour les objets inconnus" },
        { challengeId: challenges[3].id, correct: true, text: "Un type qui ne peut jamais exister" },
        { challengeId: challenges[3].id, correct: false, text: "Un type pour les nombres négatifs" },
        { challengeId: challenges[3].id, correct: false, text: "Un type pour les valeurs nulles" },
        { challengeId: challenges[3].id, correct: false, text: "Un type pour les erreurs" },
        { challengeId: challenges[4].id, correct: true, text: "let arr: number[] ou Array<number>" },
        { challengeId: challenges[4].id, correct: false, text: "let arr: array<number>" },
        { challengeId: challenges[4].id, correct: false, text: "let arr: number array" },
        { challengeId: challenges[4].id, correct: false, text: "let arr: array number" },
      ]);

      // Leçon 5 - Annotations de type
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment typer une variable ?", order: 1 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment typer un paramètre de fonction ?", order: 2 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment typer le retour d'une fonction ?", order: 3 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment typer une propriété d'objet ?", order: 4 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Qu'est-ce que l'assertion de type ?", order: 5 },
      ]).returning();

      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "let x: number = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "let x = 5: number;" },
        { challengeId: challenges[0].id, correct: false, text: "let x: 5 = number;" },
        { challengeId: challenges[0].id, correct: false, text: "let x = number: 5;" },
        { challengeId: challenges[1].id, correct: true, text: "function f(x: string) {}" },
        { challengeId: challenges[1].id, correct: false, text: "function f(x: string) {}" },
        { challengeId: challenges[1].id, correct: false, text: "function f(x: string) {}" },
        { challengeId: challenges[1].id, correct: false, text: "function f(x: string) {}" },
        { challengeId: challenges[2].id, correct: true, text: "function f(): string { return 'hello'; }" },
        { challengeId: challenges[2].id, correct: false, text: "function f() -> string { return 'hello'; }" },
        { challengeId: challenges[2].id, correct: false, text: "function f() returns string { return 'hello'; }" },
        { challengeId: challenges[2].id, correct: false, text: "function f() => string { return 'hello'; }" },
        { challengeId: challenges[3].id, correct: true, text: "let obj: {name: string, age: number};" },
        { challengeId: challenges[3].id, correct: false, text: "let obj = {name: string, age: number};" },
        { challengeId: challenges[3].id, correct: false, text: "let obj: object {name: string, age: number};" },
        { challengeId: challenges[3].id, correct: false, text: "let obj: {name: string, age: number} object;" },
        { challengeId: challenges[4].id, correct: true, text: "Forcer un type avec 'as' ou '<>'" },
        { challengeId: challenges[4].id, correct: false, text: "Supprimer un type" },
        { challengeId: challenges[4].id, correct: false, text: "Ajouter un type automatiquement" },
        { challengeId: challenges[4].id, correct: false, text: "Vérifier un type à l'exécution" },
      ]);
    }

    console.log("TypeScript course seeded!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed TypeScript course");
  }
};

void main(); 
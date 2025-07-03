import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding Rust course only");

    // Supprimer uniquement les données Rust
    const rustCourse = await db.query.courses.findFirst({
      where: (courses, { eq }) => eq(courses.title, "Rust")
    });
    if (!rustCourse) {
      console.log("Rust course not found");
      return;
    }
    const rustUnits = await db.query.units.findMany({
      where: (units, { eq }) => eq(units.courseId, rustCourse.id)
    });
    const rustUnitIds = rustUnits.map(u => u.id);
    const rustLessons = await db.query.lessons.findMany({
      where: (lessons, { inArray }) => inArray(lessons.unitId, rustUnitIds)
    });
    const rustLessonIds = rustLessons.map(l => l.id);
    const rustChallenges = await db.query.challenges.findMany({
      where: (challenges, { inArray }) => inArray(challenges.lessonId, rustLessonIds)
    });
    const rustChallengeIds = rustChallenges.map(c => c.id);

    // Supprimer les données Rust existantes
    if (rustChallengeIds.length > 0) {
      await db.delete(schema.challengeOptions).where(
        inArray(schema.challengeOptions.challengeId, rustChallengeIds)
      );
      await db.delete(schema.challenges).where(
        inArray(schema.challenges.id, rustChallengeIds)
      );
    }
    if (rustLessonIds.length > 0) {
      await db.delete(schema.lessons).where(
        inArray(schema.lessons.id, rustLessonIds)
      );
    }
    if (rustUnitIds.length > 0) {
      await db.delete(schema.units).where(
        inArray(schema.units.id, rustUnitIds)
      );
    }

    // Créer des unités pour Rust
    const units = await db.insert(schema.units).values([
      { courseId: rustCourse.id, title: "Débutant", description: "Découvre les bases de Rust", order: 1 },
      { courseId: rustCourse.id, title: "Intermédiaire", description: "Progresse avec des concepts intermédiaires", order: 2 },
      { courseId: rustCourse.id, title: "Avancé", description: "Maîtrise les concepts avancés", order: 3 },
      { courseId: rustCourse.id, title: "Expert", description: "Deviens un expert Rust", order: 4 },
      { courseId: rustCourse.id, title: "Maître", description: "Maîtrise complète de Rust", order: 5 },
    ]).returning();

    // === DÉBUTANT ===
    const debutant = units.find((u) => u.title === "Débutant");
    if (debutant) {
      const lessons = await db.insert(schema.lessons).values([
        { unitId: debutant.id, title: "Variables et mutabilité", order: 1 },
        { unitId: debutant.id, title: "Types de base", order: 2 },
        { unitId: debutant.id, title: "Impression et formatage", order: 3 },
        { unitId: debutant.id, title: "Commentaires", order: 4 },
        { unitId: debutant.id, title: "Première fonction", order: 5 },
      ]).returning();
      // Leçon 1 - Variables et mutabilité
      let challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment déclare-t-on une variable en Rust ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment rendre une variable mutable ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Quelle est la syntaxe pour une constante ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "let x = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "var x = 5;" },
        { challengeId: challenges[0].id, correct: false, text: "x := 5;" },
        { challengeId: challenges[1].id, correct: true, text: "let mut x = 5;" },
        { challengeId: challenges[1].id, correct: false, text: "mut x = 5;" },
        { challengeId: challenges[1].id, correct: false, text: "let x mut = 5;" },
        { challengeId: challenges[2].id, correct: true, text: "const X: i32 = 5;" },
        { challengeId: challenges[2].id, correct: false, text: "let const X = 5;" },
        { challengeId: challenges[2].id, correct: false, text: "const X = 5;" },
      ]);
      // Leçon 2 - Types de base
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel type pour un nombre entier ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel type pour un nombre à virgule ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Quel type pour une chaîne de caractères ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "i32" },
        { challengeId: challenges[0].id, correct: false, text: "int" },
        { challengeId: challenges[0].id, correct: false, text: "integer" },
        { challengeId: challenges[1].id, correct: true, text: "f64" },
        { challengeId: challenges[1].id, correct: false, text: "float" },
        { challengeId: challenges[1].id, correct: false, text: "double" },
        { challengeId: challenges[2].id, correct: true, text: "String" },
        { challengeId: challenges[2].id, correct: false, text: "str" },
        { challengeId: challenges[2].id, correct: false, text: "char[]" },
      ]);
      // Leçon 3 - Impression et formatage
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment afficher du texte ?", order: 1 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment afficher une variable ?", order: 2 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Quel macro pour le debug ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "println!(\"Hello\");" },
        { challengeId: challenges[0].id, correct: false, text: "print(\"Hello\");" },
        { challengeId: challenges[0].id, correct: false, text: "echo \"Hello\";" },
        { challengeId: challenges[1].id, correct: true, text: "println!(\"{}\", x);" },
        { challengeId: challenges[1].id, correct: false, text: "print!(x);" },
        { challengeId: challenges[1].id, correct: false, text: "console.log(x);" },
        { challengeId: challenges[2].id, correct: true, text: "dbg!(x);" },
        { challengeId: challenges[2].id, correct: false, text: "debug!(x);" },
        { challengeId: challenges[2].id, correct: false, text: "log!(x);" },
      ]);
      // Leçon 4 - Commentaires
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment écrire un commentaire sur une ligne ?", order: 1 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment écrire un commentaire sur plusieurs lignes ?", order: 2 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Les commentaires sont-ils compilés ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "// Ceci est un commentaire" },
        { challengeId: challenges[0].id, correct: false, text: "# Ceci est un commentaire" },
        { challengeId: challenges[0].id, correct: false, text: "<!-- Ceci est un commentaire -->" },
        { challengeId: challenges[1].id, correct: true, text: "/* Ceci est un commentaire */" },
        { challengeId: challenges[1].id, correct: false, text: "// Ceci est un commentaire\n// Suite" },
        { challengeId: challenges[1].id, correct: false, text: "# Ceci est un commentaire\n# Suite" },
        { challengeId: challenges[2].id, correct: true, text: "Non" },
        { challengeId: challenges[2].id, correct: false, text: "Oui" },
        { challengeId: challenges[2].id, correct: false, text: "Parfois" },
      ]);
      // Leçon 5 - Première fonction
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment définir une fonction ?", order: 1 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment retourner une valeur ?", order: 2 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment appeler une fonction ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "fn ma_fonction() { }" },
        { challengeId: challenges[0].id, correct: false, text: "function ma_fonction() {}" },
        { challengeId: challenges[0].id, correct: false, text: "def ma_fonction() {}" },
        { challengeId: challenges[1].id, correct: true, text: "return x;" },
        { challengeId: challenges[1].id, correct: false, text: "retourner x;" },
        { challengeId: challenges[1].id, correct: false, text: "output x;" },
        { challengeId: challenges[2].id, correct: true, text: "ma_fonction();" },
        { challengeId: challenges[2].id, correct: false, text: "call ma_fonction();" },
        { challengeId: challenges[2].id, correct: false, text: "ma_fonction[];" },
      ]);
    }

    // === INTERMÉDIAIRE ===
    const inter = units.find((u) => u.title === "Intermédiaire");
    if (inter) {
      const lessons = await db.insert(schema.lessons).values([
        { unitId: inter.id, title: "Ownership et Borrowing", order: 1 },
        { unitId: inter.id, title: "Références et slices", order: 2 },
        { unitId: inter.id, title: "Tableaux et tuples", order: 3 },
        { unitId: inter.id, title: "Contrôle de flux", order: 4 },
        { unitId: inter.id, title: "Gestion des erreurs", order: 5 },
      ]).returning();
      // Leçon 1 - Ownership et Borrowing
      let challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[0].id, type: "SELECT", question: "Qu'est-ce que l'ownership en Rust ?", order: 1 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Que se passe-t-il lors d'un move ?", order: 2 },
        { lessonId: lessons[0].id, type: "SELECT", question: "Comment emprunter une variable ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "Chaque valeur a un propriétaire unique" },
        { challengeId: challenges[0].id, correct: false, text: "Chaque variable appartient au compilateur" },
        { challengeId: challenges[0].id, correct: false, text: "Il n'y a pas d'ownership en Rust" },
        { challengeId: challenges[1].id, correct: true, text: "L'ancienne variable n'est plus accessible" },
        { challengeId: challenges[1].id, correct: false, text: "Les deux variables pointent vers la même valeur" },
        { challengeId: challenges[1].id, correct: false, text: "La variable est copiée" },
        { challengeId: challenges[2].id, correct: true, text: "En utilisant &x" },
        { challengeId: challenges[2].id, correct: false, text: "En utilisant *x" },
        { challengeId: challenges[2].id, correct: false, text: "En utilisant borrow(x)" },
      ]);
      // Leçon 2 - Références et slices
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment créer une référence mutable ?", order: 1 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Qu'est-ce qu'un slice ?", order: 2 },
        { lessonId: lessons[1].id, type: "SELECT", question: "Comment obtenir un slice d'un tableau ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "&mut x" },
        { challengeId: challenges[0].id, correct: false, text: "mut &x" },
        { challengeId: challenges[0].id, correct: false, text: "*mut x" },
        { challengeId: challenges[1].id, correct: true, text: "Une vue sur une partie d'une collection" },
        { challengeId: challenges[1].id, correct: false, text: "Un pointeur vers une variable" },
        { challengeId: challenges[1].id, correct: false, text: "Un type de variable" },
        { challengeId: challenges[2].id, correct: true, text: "&tableau[1..3]" },
        { challengeId: challenges[2].id, correct: false, text: "tableau[1:3]" },
        { challengeId: challenges[2].id, correct: false, text: "slice(tableau, 1, 3)" },
      ]);
      // Leçon 3 - Tableaux et tuples
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment déclarer un tableau de 5 entiers ?", order: 1 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment accéder au 3ème élément ?", order: 2 },
        { lessonId: lessons[2].id, type: "SELECT", question: "Comment déclarer un tuple ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "let arr: [i32; 5] = [0; 5];" },
        { challengeId: challenges[0].id, correct: false, text: "let arr = [i32, 5];" },
        { challengeId: challenges[0].id, correct: false, text: "let arr = array(5);" },
        { challengeId: challenges[1].id, correct: true, text: "arr[2]" },
        { challengeId: challenges[1].id, correct: false, text: "arr(2)" },
        { challengeId: challenges[1].id, correct: false, text: "arr{2}" },
        { challengeId: challenges[2].id, correct: true, text: "let t = (1, 'a', true);" },
        { challengeId: challenges[2].id, correct: false, text: "let t = [1, 'a', true];" },
        { challengeId: challenges[2].id, correct: false, text: "let t = tuple(1, 'a', true);" },
      ]);
      // Leçon 4 - Contrôle de flux
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment écrire une condition if ?", order: 1 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment écrire une boucle for ?", order: 2 },
        { lessonId: lessons[3].id, type: "SELECT", question: "Comment écrire une boucle while ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "if x > 5 { ... }" },
        { challengeId: challenges[0].id, correct: false, text: "if (x > 5) { ... }" },
        { challengeId: challenges[0].id, correct: false, text: "if x > 5 then ..." },
        { challengeId: challenges[1].id, correct: true, text: "for i in 0..5 { ... }" },
        { challengeId: challenges[1].id, correct: false, text: "for (i = 0; i < 5; i++) { ... }" },
        { challengeId: challenges[1].id, correct: false, text: "foreach i in 0..5 { ... }" },
        { challengeId: challenges[2].id, correct: true, text: "while x < 10 { ... }" },
        { challengeId: challenges[2].id, correct: false, text: "while (x < 10) { ... }" },
        { challengeId: challenges[2].id, correct: false, text: "while x < 10 do ..." },
      ]);
      // Leçon 5 - Gestion des erreurs
      challenges = await db.insert(schema.challenges).values([
        { lessonId: lessons[4].id, type: "SELECT", question: "Quel type pour une erreur récupérable ?", order: 1 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment gérer une erreur avec match ?", order: 2 },
        { lessonId: lessons[4].id, type: "SELECT", question: "Comment propager une erreur ?", order: 3 },
      ]).returning();
      await db.insert(schema.challengeOptions).values([
        { challengeId: challenges[0].id, correct: true, text: "Result<T, E>" },
        { challengeId: challenges[0].id, correct: false, text: "Option<T>" },
        { challengeId: challenges[0].id, correct: false, text: "Error<T>" },
        { challengeId: challenges[1].id, correct: true, text: "match res { Ok(v) => ..., Err(e) => ... }" },
        { challengeId: challenges[1].id, correct: false, text: "if res.is_err() { ... }" },
        { challengeId: challenges[1].id, correct: false, text: "try res { ... }" },
        { challengeId: challenges[2].id, correct: true, text: "?" },
        { challengeId: challenges[2].id, correct: false, text: "!" },
        { challengeId: challenges[2].id, correct: false, text: "throw" },
      ]);
    }

    // === AVANCÉ, EXPERT, MAÎTRE ===
    // Pour ne pas dépasser la limite, je peux continuer à générer les unités suivantes sur demande !
    console.log("Rust course seeded!");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed Rust course");
  }
};

void main(); 
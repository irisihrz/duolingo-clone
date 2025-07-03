import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    // Insert programming language courses
    const courses = await db
      .insert(schema.courses)
      .values([
        { title: "Python", imageSrc: "/python.svg" },
        { title: "JavaScript", imageSrc: "/javascript.svg" },
        { title: "TypeScript", imageSrc: "/typescript.svg" },
        { title: "Java", imageSrc: "/java.svg" },
        { title: "C++", imageSrc: "/cpp.svg" },
      ])
      .returning();

    // For each course, insert units
    for (const course of courses) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Learn the basics of ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2",
            description: `Learn intermediate ${course.title}`,
            order: 2,
          },
        ])
        .returning();

      // For each unit, insert lessons
      for (const unit of units) {
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "Variables", order: 1 },
            { unitId: unit.id, title: "Functions", order: 2 },
            { unitId: unit.id, title: "Loops", order: 3 },
            { unitId: unit.id, title: "Conditions", order: 4 },
            { unitId: unit.id, title: "Data Structures", order: 5 },
          ])
          .returning();

        // For each lesson, insert challenges specific to the language
        for (const lesson of lessons) {
          let challenges;
          
          if (course.title === "Python") {
            challenges = await db
              .insert(schema.challenges)
              .values([
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'How do you declare a variable in Python?',
                  order: 1,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'What is the correct way to create a function in Python?',
                  order: 2,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'How do you create a loop in Python?',
                  order: 3,
                },
                {
                  lessonId: lesson.id,
                  type: "ASSIST",
                  question: 'Write a simple variable declaration in Python',
                  order: 4,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'What is a list in Python?',
                  order: 5,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'How do you use if statements in Python?',
                  order: 6,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'What does "print()" do in Python?',
                  order: 7,
                },
                {
                  lessonId: lesson.id,
                  type: "ASSIST",
                  question: 'Write a simple function in Python',
                  order: 8,
                },
              ])
              .returning();
          } else if (course.title === "JavaScript") {
            challenges = await db
              .insert(schema.challenges)
              .values([
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'How do you declare a variable in JavaScript?',
                  order: 1,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'What is the correct way to create a function in JavaScript?',
                  order: 2,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'How do you create a loop in JavaScript?',
                  order: 3,
                },
                {
                  lessonId: lesson.id,
                  type: "ASSIST",
                  question: 'Write a simple variable declaration in JavaScript',
                  order: 4,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'What is an array in JavaScript?',
                  order: 5,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'How do you use if statements in JavaScript?',
                  order: 6,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: 'What does "console.log()" do in JavaScript?',
                  order: 7,
                },
                {
                  lessonId: lesson.id,
                  type: "ASSIST",
                  question: 'Write a simple function in JavaScript',
                  order: 8,
                },
              ])
              .returning();
          } else {
            // Default challenges for other languages
            challenges = await db
              .insert(schema.challenges)
              .values([
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: `How do you declare a variable in ${course.title}?`,
                  order: 1,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: `What is the correct way to create a function in ${course.title}?`,
                  order: 2,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: `How do you create a loop in ${course.title}?`,
                  order: 3,
                },
                {
                  lessonId: lesson.id,
                  type: "ASSIST",
                  question: `Write a simple variable declaration in ${course.title}`,
                  order: 4,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: `What is an array in ${course.title}?`,
                  order: 5,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: `How do you use if statements in ${course.title}?`,
                  order: 6,
                },
                {
                  lessonId: lesson.id,
                  type: "SELECT",
                  question: `What does "print" do in ${course.title}?`,
                  order: 7,
                },
                {
                  lessonId: lesson.id,
                  type: "ASSIST",
                  question: `Write a simple function in ${course.title}`,
                  order: 8,
                },
              ])
              .returning();
          }

          // For each challenge, insert challenge options specific to the language
          for (const challenge of challenges) {
            if (course.title === "Python") {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "x = 5",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "let x = 5",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "int x = 5",
                  },
                ]);
              } else if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "def my_function():",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "function myFunction() {}",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "public void myFunction() {}",
                  },
                ]);
              } else if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "for i in range(10):",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "for(let i = 0; i < 10; i++) {}",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "for(int i = 0; i < 10; i++) {}",
                  },
                ]);
              } else if (challenge.order === 4) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "name = 'John'",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "let name = 'John'",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "String name = 'John'",
                  },
                ]);
              } else if (challenge.order === 5) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "A collection of items in square brackets",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "A type of function",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "A variable declaration",
                  },
                ]);
              } else if (challenge.order === 6) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "if x > 5:",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "if(x > 5) {}",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "if x > 5 {",
                  },
                ]);
              } else if (challenge.order === 7) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "Displays text on the screen",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "Creates a variable",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "Defines a function",
                  },
                ]);
              } else if (challenge.order === 8) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "def greet(): print('Hello')",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "function greet() { console.log('Hello'); }",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "public void greet() { System.out.println('Hello'); }",
                  },
                ]);
              }
            } else if (course.title === "JavaScript") {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "let x = 5;",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "x = 5",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "int x = 5;",
                  },
                ]);
              } else if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "function myFunction() {}",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "def my_function():",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "public void myFunction() {}",
                  },
                ]);
              } else if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "for(let i = 0; i < 10; i++) {}",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "for i in range(10):",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "for(int i = 0; i < 10; i++) {}",
                  },
                ]);
              } else if (challenge.order === 4) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "let name = 'John';",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "name = 'John'",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "String name = 'John';",
                  },
                ]);
              } else if (challenge.order === 5) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "A collection of elements in square brackets",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "A type of function",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "A variable declaration",
                  },
                ]);
              } else if (challenge.order === 6) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "if(x > 5) {}",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "if x > 5:",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "if x > 5 {",
                  },
                ]);
              } else if (challenge.order === 7) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "Displays text in the console",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "Creates a variable",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "Defines a function",
                  },
                ]);
              } else if (challenge.order === 8) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "function greet() { console.log('Hello'); }",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "def greet(): print('Hello')",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "public void greet() { System.out.println('Hello'); }",
                  },
                ]);
              }
            } else {
              // Default options for other languages
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: `int x = 5;`,
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "x = 5",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "let x = 5;",
                  },
                ]);
              } else if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: `public void myFunction() {}`,
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "def my_function():",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "function myFunction() {}",
                  },
                ]);
              } else if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: `for(int i = 0; i < 10; i++) {}`,
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "for i in range(10):",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "for(let i = 0; i < 10; i++) {}",
                  },
                ]);
              } else if (challenge.order === 4) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: `String name = "John";`,
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "name = 'John'",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "let name = 'John';",
                  },
                ]);
              } else if (challenge.order === 5) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "A collection of elements",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "A type of function",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "A variable declaration",
                  },
                ]);
              } else if (challenge.order === 6) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: `if(x > 5) {}`,
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "if x > 5:",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "if x > 5 {",
                  },
                ]);
              } else if (challenge.order === 7) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: "Displays text on the screen",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "Creates a variable",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "Defines a function",
                  },
                ]);
              } else if (challenge.order === 8) {
                await db.insert(schema.challengeOptions).values([
                  {
                    challengeId: challenge.id,
                    correct: true,
                    text: `public void greet() { System.out.println("Hello"); }`,
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "def greet(): print('Hello')",
                  },
                  {
                    challengeId: challenge.id,
                    correct: false,
                    text: "function greet() { console.log('Hello'); }",
                  },
                ]);
              }
            }
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();

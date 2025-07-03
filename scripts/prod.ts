import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding all courses");

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
        { title: "Rust", imageSrc: "/rust.svg" },
      ])
      .returning();

    console.log("All courses created successfully!");

    // Exécuter les scripts de seed individuels APRÈS la création des cours
    console.log("Running individual seed scripts...");
    await import("./python-seed");
    await import("./javascript-seed");
    await import("./java-seed");
    await import("./typescript-seed");
    await import("./cpp-seed");
    await import("./rust-seed");

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

main(); 
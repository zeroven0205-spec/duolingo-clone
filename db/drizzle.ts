import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";
import * as schemaWordProgress from "./schema-word-progress";
import * as schemaTenant from "./schema-tenant";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, {
  schema: { ...schema, ...schemaWordProgress, ...schemaTenant },
});

export default db;

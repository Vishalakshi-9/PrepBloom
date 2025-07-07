/** @type { import("drizzle-kit").Config} */
export default {
schema: "./utils/schema.js",
dialect: 'postgresql',
dbCredentials: {
url: 'postgresql://neondb_owner:npg_HYcmRzMVd4r0@ep-dark-field-a8t3xwya.eastus2.azure.neon.tech/PrepBloom?sslmode=require',
}
};
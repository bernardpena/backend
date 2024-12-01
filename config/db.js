const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "aromas_de_cafe",
  password: "Admin",
  port: 5432,
});

const { Client } = require("pg");

// Asegúrate de que DATABASE_PRIVATE_URL esté configurada en el entorno de Railway
const client = new Client({
  connectionString:
    process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_PUBLIC_URL,
});

client
  .connect()
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

module.exports = pool;

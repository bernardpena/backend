const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const salesRoutes = require("./routes/salesRoutes");
const db = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api", cartRoutes);
app.use("/api/sales", salesRoutes);

// error 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    process.exit(1);
  }
  console.log("Conexión a la base de datos establecida correctamente.");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
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

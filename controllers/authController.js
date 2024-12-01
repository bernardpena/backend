require("dotenv").config();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  console.log("Registro recibido:", req.body);
  try {
    const {
      nombre,
      email,
      password,
      calle,
      ciudad,
      comuna,
      rol = "usuario",
    } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "El email ya está en uso" });
    }

    // Hasear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, calle, ciudad, comuna, rol) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [nombre, email, hashedPassword, calle, ciudad, comuna, rol]
    );

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("TEST_VAR:", process.env.TEST_VAR);
    console.log("Datos de entrada:", req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, proporciona un email y una contraseña." });
    }

    const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    console.log("Consultando usuario con email:", email);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: {
        id: user.rows[0].id,
        nombre: user.rows[0].nombre,
        email: user.rows[0].email,
        rol: user.rows[0].rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// agregar administrador
exports.addAdministrator = async (req, res) => {
  console.log("Datos de nuevo administrador recibidos:", req.body);
  try {
    const {
      nombre,
      email,
      password,
      calle,
      ciudad,
      comuna,
      rol = "admin",
    } = req.body;

    if (!password || password.length === 0) {
      return res.status(400).json({ message: "La contraseña es requerida" });
    }

    const existingUser = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "El email ya está en uso" });
    }

    // Hasear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, calle, ciudad, comuna, rol) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [nombre, email, hashedPassword, calle, ciudad, comuna, rol]
    );

    return res
      .status(201)
      .json({ message: "Administrador agregado exitosamente" });
  } catch (error) {
    console.error("Error al agregar administrador:", error);
    return res
      .status(500)
      .json({ message: "Error al agregar el administrador" });
  }
};
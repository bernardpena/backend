const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Ruta registrar un usuario
router.post(
  "/register",
  (req, res, next) => {
    console.log("Solicitud de registro recibida Register");
    next();
  },
  authController.register
);

// Ruta sesión
router.post("/login", authController.login);

// Ruta administrador
router.post("/add-admin", authController.addAdministrator); 

module.exports = router;

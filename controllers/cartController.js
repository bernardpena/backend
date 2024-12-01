const pool = require("../config/db");

// Obtener productos
exports.getCartItems = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
            SELECT carrito.id, productos.nombre, carrito.cantidad, carrito.email, carrito.descripcion, carrito.imagen, carrito.nombre
            FROM carrito
            JOIN productos ON carrito.producto_id = productos.id
            WHERE carrito.usuario_id = $1
        `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al obtener los productos del carrito" });
  }
};

// Añadir producto
exports.addToCart = async (req, res) => {
  const { userId } = req.params;
  const { producto_id, cantidad } = req.body;

  try {
    const productCheck = await pool.query(
      "SELECT * FROM productos WHERE id = $1",
      [producto_id]
    );
    if (productCheck.rows.length === 0) {
      return res.status(400).json({ error: "El producto no existe" });
    }

    const existingItem = await pool.query(
      "SELECT * FROM carrito WHERE usuario_id = $1 AND producto_id = $2",
      [userId, producto_id]
    );
    if (existingItem.rows.length > 0) {
      await pool.query(
        "UPDATE carrito SET cantidad = cantidad + $1 WHERE usuario_id = $2 AND producto_id = $3",
        [cantidad, userId, producto_id]
      );
    } else {
      await pool.query(
        "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES ($1, $2, $3)",
        [userId, producto_id, cantidad]
      );
    }
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al añadir producto al carrito" });
  }
};

// Guardar el carrito
exports.saveCart = async (req, res) => {
  const { usuario_id, invitado, items } = req.body;

  console.log("Datos recibidos:", { usuario_id, invitado, items });

  try {
    if (!items || items.length === 0) {
        return res.status(400).json({ error: "No se encontraron items para guardar." });
    }

    for (const item of items) {
        const precio = typeof item.valor === 'string' ? parseFloat(item.valor) : item.valor;

        if (isNaN(precio) || precio < 0) {
            console.error("Precio inválido para el producto:", item);
            return res.status(400).json({ error: `El precio '${item.precio}' es inválido para el producto.` });
        }

        const valor = precio * item.cantidad;

        if (isNaN(valor) || valor < 0) {
            console.error("Valor inválido detectado para el producto:", item);
            return res.status(400).json({ error: "El valor de uno o más productos es inválido." });
        }
        item.valor = valor; 
    }

      // invitados
      if (invitado) {
          const { nombre_completo, email, telefono, calle, numero, ciudad } = invitado;
          if (!nombre_completo || !email || !telefono || !calle || !numero || !ciudad) {
              return res.status(400).json({ error: "Todos los campos del invitado son requeridos." });
          }

          const inviteeResult = await pool.query(
              "INSERT INTO invitados (nombre_completo, email, telefono, calle, numero, ciudad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
              [nombre_completo, email, telefono, calle, numero, ciudad]
          );
          const invitadoId = inviteeResult.rows[0].id;
          for (const item of items) {
              await pool.query(
                  "INSERT INTO compras (invitado_id, producto_id, cantidad, valor) VALUES ($1, $2, $3, $4)",
                  [invitadoId, item.producto_id, item.cantidad, item.valor]
              );
          }
      } else if (usuario_id) {
          for (const item of items) {
              await pool.query(
                  "INSERT INTO compras (usuario_id, producto_id, cantidad, email, descripcion, imagen, nombre, valor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                  [
                      usuario_id,
                      item.producto_id,
                      item.cantidad,
                      item.email,
                      item.descripcion,
                      item.imagen,
                      item.nombre,
                      item.valor 
                  ]
              );
          }
      } else {
          return res.status(400).json({ error: "Debes proporcionar usuario_id o datos de invitado." });
      }
      res.status(201).json({ message: "Compra guardada exitosamente" });
  } catch (err) {
      console.error("Error al guardar la compra:", err);
      res.status(500).json({ error: "Error al guardar la compra" });
  }
};

// Eliminar producto
exports.removeFromCart = async (req, res) => {
  const { userId, producto_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM carrito WHERE usuario_id = $1 AND producto_id = $2",
      [userId, producto_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
};
CREATE DATABASE aromas_de_cafe;

\c aromas_de_cafe;

-- Tabla de usuarios
CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(60) NOT NULL,
    calle character varying(100),
    ciudad character varying(50),
    comuna character varying(50),
    rol character varying(15),
    nombre character varying(50)
);

SELECT * FROM usuarios;

-- Tabla de productos (cafés)
CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    imagen character varying(50)
);

SELECT * FROM productos;

-- Tabla de carrito
CREATE TABLE carrito (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    email VARCHAR NOT NULL,
    descripcion TEXT,
    imagen VARCHAR,
    nombre VARCHAR
);

SELECT * FROM carrito;


INSERT INTO public.productos (id, nombre, descripcion, precio, imagen) VALUES
(1, 'Café Arabica', 'Un café suave y aromático con notas de frutas.', 3.99, 'cafe1.jpg'),
(2, 'Café Robusta', 'Café fuerte y con cuerpo, ideal para los amantes del café intenso.', 4.49, 'cafe2.jpg'),
(3, 'Café de Especialidad', 'Café de origen único, seleccionado por su calidad excepcional.', 5.99, 'cafe3.jpg'),
(4, 'Café Descafeinado', 'Café sin cafeína, perfecto para disfrutar en cualquier momento del día.', 3.49, 'cafe4.jpg'),
(5, 'Café Mocha', 'Una mezcla deliciosa de café y chocolate, ideal para los golosos.', 4.99, 'cafe5.jpg'),
(6, 'Café Latte', 'Café suave con leche espumosa, un clásico en cualquier cafetería.', 4.29, 'cafe6.jpg');


--actualizando tabla productos
SELECT * FROM productos;


INSERT INTO public.usuarios (id, email, password, calle, ciudad, comuna, rol, nombre) VALUES
(10, 'petete@gmail.com', '$2a$10$ZEGPFKCSxCClabYJohx0yO1VcoINmysvwifFJlc2JIfBymxoxcoYO', 'calama', 'calama', 'calama', 'usuario', 'Petete'),
(11, 'mozita@gmail.com', '$2a$10$PjW.X498kvUhBE7XcVAW.u7GD9f/QfXpoQXIB1cAez7HdYeH.i/pa', 'calama', 'calama', 'calama', 'usuario', 'Mozita'),
(12, 'leo@gmail.com', '$2a$10$7KQSBc5JAMYaGkTU1g32neyd4EdCq/ho/Mjz9rEvXvK8l7QsAqcWa', 'calama', 'calama', 'Calama', 'usuario', 'Leo'),
(13, 'pedro@gmail.com', '$2a$10$LbpiKP2ZHgzO7Yv/n3DTeeVT.hfQ3uQO0EUKvOJvyi8H4XpyTNtLi', 'calama', 'Calama', 'Clama', 'usuario', 'Pedro'),
(14, 'wilson@gmail.com', '$2a$10$vevoFSxLm.ubHnGR2fvN6uIgLGbGLPpP74u7ZwlPChgt12mLtnYwq', 'Calama', 'Calama', 'Calama', 'usuario', 'Wilson'),
(15, 'roberto@gmail.com', '$2a$10$E/v7zueTyM/D0g33kJgQne2PMGDmbJIR/aheVoAzgSp1iGQ9D5YH.', 'Calama', 'Clamaa', 'Clama', 'usuario', 'Roberto'),
(16, 'bernardo@aromasdecafe.cl', '$2a$10$zn6nNtSjKHGQLjQFCXaFq.cGNi7OJnFDLNGzNrO88aMN1z8I3NLOa', 'Diego de Almagro', NULL, 'Calama', 'admin', 'Bernardo'),
(17, 'anakaren@aromasdecafe.cl', '$2a$10$RX2UjIhOuYY7sInTMdetbuw.EN3fsdX74JrXMxQgf5KKAkZRrjhRu', 'Central Sur', NULL, 'Mexico', 'admin', 'Anakaren Lozano'),
(18, 'lucas@aromasdecafe.cl', '$2a$10$3zzp8ov5OHdVB56Sn/84T.6S1SzeSL3Wb4SKr0S9cbAC22apkSlce', 'Estacion Central', NULL, 'Estacion Central', 'admin', 'Lucas Cid');


--tabla invitados
CREATE TABLE public.invitados (
    id SERIAL PRIMARY KEY,
    nombre_completo character varying(100) NOT NULL,
    email character varying(50) NOT NULL,
    telefono character varying(20),
    calle character varying(100),
    numero character varying(10),
    ciudad character varying(50),
    producto character varying(100) NOT NULL,
    cantidad integer NOT NULL,
    valor decimal(10, 2) NOT NULL
);

--eliminar el campo productos, cantidad , valor de la tabla invitados
ALTER TABLE invitados
DROP COLUMN producto;

ALTER TABLE invitados
DROP COLUMN cantidad;

ALTER TABLE invitados
DROP COLUMN valor;

--primare key a id_productos
ALTER TABLE productos
ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--modificacion table usuarios
ALTER TABLE usuarios
ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


CREATE TABLE compras (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),  -- Aquí debe existir la restricción
    invitado_id INTEGER REFERENCES invitados(id),
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    email VARCHAR(50),  -- Para invitados
    descripcion TEXT,
    imagen VARCHAR(255),
    nombre VARCHAR(100),
    valor DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO compras (usuario_id, invitado_id, producto_id, cantidad, email, descripcion, imagen, nombre, valor, created_at) VALUES
(13, NULL, 6, 1, NULL, 'Café suave con leche espumosa, un clásico en cualquier cafetería.', 'cafe6.jpg', 'Café Latte', 4.29, '2024-11-23 10:53:20'),
(13, NULL, 6, 1, NULL, 'Café suave con leche espumosa, un clásico en cualquier cafetería.', 'cafe6.jpg', 'Café Latte', 4.29, '2024-11-23 11:03:46'),
(13, NULL, 1, 1, NULL, 'Un café suave y aromático con notas de frutas.', 'cafe1.jpg', 'Café Arabica', 3.99, '2024-11-23 12:07:07'),
(13, NULL, 1, 1, NULL, 'Un café suave y aromático con notas de frutas.', 'cafe1.jpg', 'Café Arabica', 3.99, '2024-11-23 12:13:14'),
(13, NULL, 2, 1, NULL, 'Café fuerte y con cuerpo, ideal para los amantes del café intenso.', 'cafe2.jpg', 'Café Robusta', 4.49, '2024-11-23 12:15:58'),
(13, NULL, 3, 1, NULL, 'Café de origen único, seleccionado por su calidad excepcional.', 'cafe3.jpg', 'Café de Especialidad', 5.99, '2024-11-23 12:23:12'),
(13, NULL, 3, 1, NULL, 'Café de origen único, seleccionado por su calidad excepcional.', 'cafe3.jpg', 'Café de Especialidad', 5.99, '2024-11-23 12:27:37'),
(13, NULL, 1, 1, NULL, 'Un café suave y aromático con notas de frutas.', 'cafe1.jpg', 'Café Arabica', 3.99, '2024-11-23 12:29:41'),
(13, NULL, 4, 1, NULL, 'Café sin cafeína, perfecto para disfrutar en cualquier momento del día.', 'cafe4.jpg', 'Café Descafeinado', 3.49, '2024-11-23 12:38:23');
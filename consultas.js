//Anakaren

const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount)
    throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }
    }

app.post("/login", async (req, res) => {
     try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
     } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

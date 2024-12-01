const express = require('express'); 
const db = require('../config/db'); 
const router = express.Router(); 


router.get('/', (req, res) => {
    const query = 'SELECT * FROM compras'; 
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las compras' }); 
        }
        res.json(result.rows); 
    });
});


module.exports = router; 
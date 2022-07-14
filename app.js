const cors = require('cors');
const Pool = require('pg').Pool;
const express = require('express');
const FacebookLogin = require('react-facebook-login');

const PORT = process.env.PORT || 5000;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'temp',
    password: 'Dutak@123',
    port: 5432
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("OK");
})

app.post('/register', async (req, res) => {

    const data = JSON.parse(req.body.data);
    try{
        const result = await pool.query(`INSERT INTO "public"."user" (name, email, password) VALUES ($1, $2, $3) returning id;`, 
                                        [data.name, data.email, data.password]);
    
        if(result.rowCount > 0) res.sendStatus(200);
        else res.sendStatus(400);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }

});

app.post('/login', async (req, res) => {
    const data = JSON.parse(req.body.data);

    try{
        const result = await pool.query('SELECT "id" FROM "public"."user" WHERE "email" = $1 AND "password" = $2', 
                                        [data.email, data.password]);
        if(result.rowCount > 0) res.sendStatus(200);
        else res.sendStatus(404);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }

});

app.listen(PORT, () => {
    pool.query('SELECT * FROM "public"."user"', (error, result) => {
        if(error){
            console.log("Error Occured", error);
        }
        console.log("Connected to DB");
    });
    console.log(`Successfully started on port ${PORT}`);
})

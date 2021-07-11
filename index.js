const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { Pool } = require('pg');


const client = await pool.connect();
const result = await client.query(`
  CREATE TABLE test_table(id serial PRIMARY KEY, name VArCHAR(50));

  INSERT INTO test_table(name)
    VALUES('test name');
`);
client.release();




app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`!!Listening to port: ${port}`);
});


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

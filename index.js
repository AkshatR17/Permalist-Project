import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "Rksakg@20",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {

  try {
    const items = await db.query('SELECT * FROM items ORDER BY id ASC');

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items.rows,
    });
  } catch (error) {
    console.log(error);
    res.send('We are sorry for inconvenience, our team is looking into it.');
  }

});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  try {
    await db.query(`INSERT INTO items(title) VALUES('${item}')`);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send('We are sorry for inconvenience, our team is looking into it.');
  }

});

app.post("/edit", async (req, res) => {

  try {
    await db.query(`UPDATE items SET title = '${req.body.updatedItemTitle}' WHERE id = ${parseInt(req.body.updatedItemId)}`);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.send('We are sorry for inconvenience, our team is looking into it.');
  }


});

app.post("/delete", async (req, res) => {

  try {
    await db.query(`DELETE FROM items WHERE id = ${parseInt(req.body.deleteItemId)}`);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.send('We are sorry for inconvenience, our team is looking into it.');
  }


});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

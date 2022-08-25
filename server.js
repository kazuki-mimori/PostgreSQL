const { query } = require("express");
const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

///ユーザー情報を全て取得
app.get("/users", (req, res) => {
  pool.query("select * from users", (err, results) => {
    if (err) throw err;
    return res.status(200).json(results.rows);
  });
});

//特定のユーザーを取得する
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  pool.query("select * from users WHERE id = $1", [id], (err, results) => {
    if (err) throw err;
    return res.status(200).json(results.rows);
  });
});

///ユーザーを追加する
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  //ユーザーの存在を確認する
  pool.query(
    "select s from users s WHERE s.email = $1",
    [email],
    (err, results) => {
      if (results.rows.length) {
        return res.send("すでに登録されています");
      }
      pool.query(
        "insert into users(name, email, age) values($1, $2, $3)",
        [name, email, age],
        (err, results) => {
          if (err) throw err;
          return res.status(201).send("ユーザーを追加しました");
        }
      );
    }
  );
});

//ユーザーを削除する
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  pool.query("select * from users WHERE id = $1", [id], (err, results) => {
    if (err) throw err;
    const isUserExised = results.rows.length;
    if (!isUserExised) {
      return res.send("ユーザーが存在しません");
    }
    pool.query("delete from users WHERE id = $1", [id], (err, results) => {
      if (err) throw err;
      return res.status(200).send("削除に成功しました");
    });
  });
});

//ユーザーを更新する
app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  pool.query("select * from users WHERE id = $1", [id], (err, results) => {
    if (err) throw err;
    const isUserExised = results.rows.length;
    if (!isUserExised) {
      return res.send("ユーザーが存在しません");
    }
    pool.query(
      "update users set name = $1 WHERE id = $2 ",
      [name, id],
      (err, results) => {
        if (err) throw err;
        return res.status(200).send("更新に成功しました");
      }
    );
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port" + PORT);
});

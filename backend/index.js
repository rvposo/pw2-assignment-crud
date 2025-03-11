// filepath: c:\Code\pw2-assignment-crud\backend\index.js
const express = require("express"); 
const sqlite3 = require("sqlite3").verbose(); 
const cors = require("cors"); 
const bodyParser = require("body-parser"); 
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("meusite.db", err => {
    if (err) console.error("Erro ao conectar ao SQLite:", err);
    else console.log("✅ Banco de dados SQLite conectado!");
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)");

    console.log("usuarios TABLE created!");
});

app.post("/api/salvar", (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ mensagem: "Nome é obrigatório!" });
    const sql = "INSERT INTO usuarios (nome) VALUES (?)";
    db.run(sql, [nome], function (err) {
        if (err) {
            console.error("Erro ao inserir:", err);
            return res.status(500).json({ mensagem: "Erro ao salvar no banco." });
        }
        res.json({ mensagem: "Nome salvo com sucesso!", id: this.lastID });
    });
});

app.get("/api/usuarios", (req, res) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            return res.status(500).json({ mensagem: "Erro ao buscar usuários." });
        }
        res.json(rows);
    });
});

// filepath: c:\Code\pw2-assignment-crud\backend\index.js
app.delete("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM usuarios WHERE id = ?";
  db.run(sql, [id], function (err) {
      if (err) {
          console.error("Erro ao deletar usuário:", err);
          return res.status(500).json({ mensagem: "Erro ao deletar usuário." });
      }
      res.json({ mensagem: "Usuário deletado com sucesso!" });
  });
});

// filepath: c:\Code\pw2-assignment-crud\backend\index.js
app.put("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const sql = "UPDATE usuarios SET nome = ? WHERE id = ?";
  db.run(sql, [nome, id], function (err) {
      if (err) {
          console.error("Erro ao atualizar usuário:", err);
          return res.status(500).json({ mensagem: "Erro ao atualizar usuário." });
      }
      res.json({ mensagem: "Usuário atualizado com sucesso!" });
  });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
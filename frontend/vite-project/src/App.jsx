// filepath: c:\Code\pw2-assignment-crud\frontend\vite-project\src\App.jsx
import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [nome, setNome] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNome, setEditNome] = useState('');

  useEffect(() => {
    fetch('/api/usuarios')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/salvar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setUsers([...users, { id: data.id, nome }]);
        setNome('');
      })
      .catch(error => console.error('Erro ao salvar usuário:', error));
  };

  const handleDelete = (id) => {
    fetch(`/api/usuarios/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => console.error('Erro ao deletar usuário:', error));
  };

  const handleEdit = (id, nome) => {
    setEditId(id);
    setEditNome(nome);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`/api/usuarios/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: editNome }),
    })
      .then(response => response.json())
      .then(() => {
        setUsers(users.map(user => (user.id === editId ? { ...user, nome: editNome } : user)));
        setEditId(null);
        setEditNome('');
      })
      .catch(error => console.error('Erro ao atualizar usuário:', error));
  };

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome"
        />
        <button type="submit">Salvar</button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.id === editId ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                />
                <button type="submit">Atualizar</button>
                <button type="button" onClick={() => setEditId(null)}>Cancelar</button>
              </form>
            ) : (
              <>
                {user.nome}
                <button onClick={() => handleEdit(user.id, user.nome)}>Editar</button>
                <button onClick={() => handleDelete(user.id)}>Deletar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
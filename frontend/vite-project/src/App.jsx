
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css'; 

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
    <div className="container bg-dark text-white">
      <h1 className="my-4">Lista de Usuários</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="form-control bg-dark text-white"
            placeholder="Digite o nome"
          />
          <button type="submit" className="btn btn-primary">Salvar</button>
        </div>
      </form>
      <ul className="list-group">
        {users.map(user => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
            {user.id === editId ? (
              <form onSubmit={handleUpdate} className="d-flex w-100">
                <input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="form-control me-2 bg-dark text-white"
                />
                <button type="submit" className="btn btn-success me-2">Atualizar</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditId(null)}>Cancelar</button>
              </form>
            ) : (
              <>
                <span>{user.nome}</span>
                <div>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(user.id, user.nome)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Deletar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
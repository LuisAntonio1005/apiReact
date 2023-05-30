import React, { useState, useEffect } from 'react';
import { Trash, Pencil } from 'react-bootstrap-icons';
import axios from 'axios';


const API_URL =
  'https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=ac31eaadb0a083231bf49d2c6d55ec1a&hash=9f396a73b4aac136e185dda7017d227d';

  const CharacterList = ({ characters, onSelectCharacter, onDeleteCharacter, onEditCharacter }) => {
    return (
      <div className="character-list">
        <h2>Personajes Marvel</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((character) => (
              <tr key={character.id}>
                <td onClick={() => onSelectCharacter(character)}>{character.name}</td>
                <td>
                  <button className="btn btn-outline-danger" onClick={() => onDeleteCharacter(character.id)}>
                    <Trash />
                  </button>
                  <button className="btn btn-outline-primary" onClick={() => onEditCharacter(character)}>
                    <Pencil />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

const CharacterDetail = ({ character, onEditCharacter, onCancelEdit }) => {
  const [name, setName] = useState(character.name);

  const handleEdit = () => {
    onEditCharacter(character.id, name);
  };

  return (
    <div className="character-detail">
      <h2>Edición de personaje</h2>
      <p>Nombre: {character.name}</p>
      <input
        type="text"
        className="form-control"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button className="btn btn-primary" onClick={handleEdit}>Guardar</button>
      <button className="btn btn-secondary" onClick={onCancelEdit}>Cancelar</button>
    </div>
  );
};

const CharacterForm = ({ onSaveCharacter }) => {
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newCharacter = {
      id: Date.now(),
      name,
    };
    onSaveCharacter(newCharacter);
    setName('');
  };

  return (
    <div className="character-form">
      <h2>Crear personaje</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
};

const CharacterManager = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [editingCharacter, setEditingCharacter] = useState(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data.data.results;
      setCharacters(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveCharacter = (newCharacter) => {
    setCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
  };

  const handleDeleteCharacter = (id) => {
    setCharacters((prevCharacters) =>
      prevCharacters.filter((character) => character.id !== id)
    );
    setSelectedCharacter(null);
    setEditingCharacter(null);
  };

  const handleEditCharacter = (character) => {
    setSelectedCharacter(null);
    setEditingCharacter(character);
  };

  const handleSaveEditedCharacter = (id, newName) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) =>
        character.id === id ? { ...character, name: newName } : character
      )
    );
    setSelectedCharacter(null);
    setEditingCharacter(null);
  };

  const handleCancelEdit = () => {
    setEditingCharacter(null);
  };

  return (
    <div className="container character-manager">
      <CharacterList
        characters={characters}
        onSelectCharacter={setSelectedCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        onEditCharacter={handleEditCharacter}
      />
      {selectedCharacter && !editingCharacter && (
        <CharacterDetail
          character={selectedCharacter}
          onEditCharacter={handleSaveEditedCharacter}
          onCancelEdit={handleCancelEdit}
        />
      )}
      {editingCharacter && !selectedCharacter && (
        <CharacterDetail
          character={editingCharacter}
          onEditCharacter={handleSaveEditedCharacter}
          onCancelEdit={handleCancelEdit}
        />
      )}
      {!selectedCharacter && !editingCharacter && (
        <CharacterForm onSaveCharacter={handleSaveCharacter} />
      )}
    </div>
  );
};

export default CharacterManager;

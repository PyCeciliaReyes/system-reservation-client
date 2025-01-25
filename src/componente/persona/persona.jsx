import React, { useState, useEffect } from 'react';
import {API_URL, getHeaders} from '../../utils/api';

export const Persona = () => {
  const [personas, setPersonas] = useState([]); // Lista de personas
  const [formData, setFormData] = useState({
    id: null,
    nombrecompleto: '',
    nrodocumento: '',
    correo: '',
    telefono: '',
  }); // Datos del formulario
  const [isEditing, setIsEditing] = useState(false); // Controla si estamos editando
  const [loading, setLoading] = useState(false); // Estado de cargando

  // Obtener todas las personas al cargar el componente
  useEffect(() => {
    setLoading(true); // Activar estado cargando
    fetch(`${API_URL}/api/persona`, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then((responseData) => {
        //console.log('Datos obtenidos:', responseData);
        if (responseData.status === 'success' && Array.isArray(responseData.data)) {
          setPersonas(responseData.data); // Asigna el array de personas
        } else {
          setPersonas([]); // Manejo de respuesta inesperada
        }
      })
      .catch((error) => console.error('Error al cargar personas:', error))
      .finally(() => setLoading(false)); // Desactivar estado cargando
  }, []);
  

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Crear o editar persona
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing
      ? `${API_URL}/api/persona/${formData.id}`
      : `${API_URL}/api/persona`;
  
    fetch(endpoint, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(formData),
    })
      .then((response) => {
        // Verificar si el estado HTTP indica un error (400 o similar)
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || 'Error en la solicitud.');
          });
        }
        return response.json(); // Procesar respuesta exitosa
      })
      .then((responseData) => {
        if (responseData.status === 'success') {
          const nuevaPersona = responseData.data;
  
          if (isEditing) {
            // Actualizar la persona editada en la lista
            setPersonas((prevPersonas) =>
              prevPersonas.map((persona) =>
                persona.id === nuevaPersona.id ? nuevaPersona : persona
              )
            );
            alert(responseData.message || 'Persona actualizada exitosamente');
          } else {
            // Agregar la nueva persona a la lista
            setPersonas((prevPersonas) => [...prevPersonas, nuevaPersona]);
            alert(responseData.message || 'Persona creada exitosamente');
          }
  
          // Reiniciar el formulario y estado de edición
          setFormData({
            id: null,
            nombrecompleto: '',
            nrodocumento: '',
            correo: '',
            telefono: '',
          });
          setIsEditing(false);
        }
      })
      .catch((error) => {
        // Mostrar el mensaje del backend o un mensaje genérico
        console.error('Error al guardar persona:', error);
        alert(error.message || 'Ocurrió un error inesperado. Inténtalo nuevamente.');
      });
  };  

  // Eliminar persona
  const handleDelete = (id) => {
  if (window.confirm(`¿Estas seguro de que deseas eliminar la persona con ID: ${id}?`)) {
    fetch(`${API_URL}/api/persona/${id}`, { method: 'DELETE', headers: getHeaders() })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        //console.log('Respuesta del servidor:', responseData);

        if (responseData.status === 'success') {
          // Filtrar la persona eliminada de la lista
          setPersonas((prevPersonas) =>
            prevPersonas.filter((persona) => persona.id !== id)
          );
          alert(responseData.message || 'Persona eliminada exitosamente');
        } else {
          alert('Ocurrio un error: ' + (responseData.message || 'No se pudo eliminar la persona.'));
        }
      })
      .catch((error) => {
        console.error('Error al eliminar persona:', error);
        alert('Ocurrió un error inesperado. Inténtalo nuevamente.');
      });
  }
};


  // Cargar datos para editar
  const handleEdit = (persona) => {
    setFormData(persona);
    setIsEditing(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Modulo de Personas</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded bg-white shadow"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Editar Persona' : 'Crear Persona'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombrecompleto"
            placeholder="Nombre Completo"
            value={formData.nombrecompleto}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="nrodocumento"
            placeholder="Número de Documento"
            value={formData.nrodocumento}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          {isEditing ? 'Actualizar' : 'Crear'}
        </button>
      </form>

      {/* Indicador de Cargando */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando datos...</p>
      ) : (
        /* Tabla */
        <table className="w-full border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Documento</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Telefono</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.id} className="hover:bg-gray-100">
                <td className="border p-2 text-center">{persona.id}</td>
                <td className="border p-2">{persona.nombrecompleto}</td>
                <td className="border p-2">{persona.nrodocumento}</td>
                <td className="border p-2">{persona.correo}</td>
                <td className="border p-2">{persona.telefono}</td>
                <td className="border p-2 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(persona)}
                    className="bg-blue-600 text-white py-1 px-2 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(persona.id)}
                    className="bg-red-600 text-white py-1 px-2 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
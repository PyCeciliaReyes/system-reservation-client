import React, { useState, useEffect } from 'react';
import {API_URL, getHeaders} from '../../utils/api';

export const Habitacion = () => {
  const [habitaciones, setHabitaciones] = useState([]); // Lista de habitaciones
  const [formData, setFormData] = useState({
    id: null,
    habitacionpiso: '',
    habitacionnro: '',
    cantcamas: '',
    tienetelevision: false,
    tienefrigobar: false,
  }); // Datos del formulario
  const [isEditing, setIsEditing] = useState(false); // Controla si estamos editando
  const [loading, setLoading] = useState(false); // Estado de cargando

  // Obtener todas las habitaciones al cargar el componente
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/habitacion`,{
      method: 'GET',
      headers: getHeaders(),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status === 'success' && Array.isArray(responseData.data)) {
          setHabitaciones(responseData.data);
        } else {
          setHabitaciones([]);
        }
      })
      .catch((error) => console.error('Error al cargar habitaciones:', error))
      .finally(() => setLoading(false));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Crear o editar habitacion
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing
      ? `${API_URL}/api/habitacion/${formData.id}`
      : `${API_URL}/api/habitacion`;

    fetch(endpoint, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status === 'success') {
          const nuevaHabitacion = responseData.data;

          if (isEditing) {
            // Actualizar habitación editada en la lista
            setHabitaciones((prev) =>
              prev.map((habitacion) =>
                habitacion.id === nuevaHabitacion.id ? nuevaHabitacion : habitacion
              )
            );
            alert(responseData.message || 'Habitacion actualizada exitosamente');
          } else {
            // Agregar nueva habitación a la lista
            setHabitaciones((prev) => [...prev, nuevaHabitacion]);
            alert(responseData.message || 'Habitacion creada exitosamente');
          }

          // Reiniciar el formulario
          setFormData({
            id: null,
            habitacionpiso: '',
            habitacionnro: '',
            cantcamas: '',
            tienetelevision: false,
            tienefrigobar: false,
          });
          setIsEditing(false);
        } else {
          alert('Error: ' + (responseData.message || 'Operacion fallida'));
        }
      })
      .catch((error) => console.error('Error al guardar habitacion:', error));
  };

  // Eliminar habitacion
  const handleDelete = (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la habitacion con ID: ${id}?`)) {
      fetch(`${API_URL}/api/habitacion/${id}`, { method: 'DELETE', headers: getHeaders() })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status === 'success') {
            setHabitaciones((prev) =>
              prev.filter((habitacion) => habitacion.id !== id)
            );
            alert(responseData.message || 'Habitacion eliminada exitosamente');
          } else {
            alert('Error: ' + (responseData.message || 'No se pudo eliminar la habitacion.'));
          }
        })
        .catch((error) => console.error('Error al eliminar habitacion:', error));
    }
  };

  // Cargar datos para editar
  const handleEdit = (habitacion) => {
    setFormData(habitacion);
    setIsEditing(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Modulo de Habitaciones</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded bg-white shadow"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Editar Habitación' : 'Crear Habitación'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="habitacionpiso"
            placeholder="Piso"
            value={formData.habitacionpiso}
            onChange={handleChange}
            className="p-2 border rounded"
            required
            min="1"
            max="10"
          />
          <input
            type="number"
            name="habitacionnro"
            placeholder="Numero"
            value={formData.habitacionnro}
            onChange={handleChange}
            className="p-2 border rounded"
            required
            min="1"
            max="20"
          />
          <input
            type="number"
            name="cantcamas"
            placeholder="Cantidad de Camas"
            value={formData.cantcamas}
            onChange={handleChange}
            className="p-2 border rounded"
            required
            min="1"
            max="4"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="tienetelevision"
              checked={formData.tienetelevision}
              onChange={handleChange}
            />
            <label>Tiene Television</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="tienefrigobar"
              checked={formData.tienefrigobar}
              onChange={handleChange}
            />
            <label>Tiene Frigobar</label>
          </div>
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
              <th className="border p-2">Piso</th>
              <th className="border p-2">Numero</th>
              <th className="border p-2">Camas</th>
              <th className="border p-2">Televisión</th>
              <th className="border p-2">Frigobar</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((habitacion) => (
              <tr key={habitacion.id} className="hover:bg-gray-100">
                <td className="border p-2 text-center">{habitacion.id}</td>
                <td className="border p-2">{habitacion.habitacionpiso}</td>
                <td className="border p-2">{habitacion.habitacionnro}</td>
                <td className="border p-2">{habitacion.cantcamas}</td>
                <td className="border p-2">
                  {habitacion.tienetelevision ? 'Si' : 'No'}
                </td>
                <td className="border p-2">
                  {habitacion.tienefrigobar ? 'Si' : 'No'}
                </td>
                <td className="border p-2 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(habitacion)}
                    className="bg-blue-600 text-white py-1 px-2 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(habitacion.id)}
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
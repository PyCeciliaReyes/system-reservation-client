import React, { useState, useEffect } from 'react';
import {API_URL, getHeaders} from '../../utils/api';

export const Reserva = () => {
  const [reservas, setReservas] = useState([]); // Lista de reservas
  const [personas, setPersonas] = useState([]); // Lista de personas para selección
  const [habitaciones, setHabitaciones] = useState([]); // Lista de habitaciones para selección
  const [formData, setFormData] = useState({
    id: null,
    fechaentrada: '',
    fechasalida: '',
    habitacionid: '',
    personaid: '',
  }); // Datos del formulario
  const [isEditing, setIsEditing] = useState(false); // Controla si estamos editando
  const [loading, setLoading] = useState(false); // Estado de cargando


  // Obtener todas las reservas al cargar el componente
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/reserva`,{
        method: 'GET',
        headers: getHeaders(),
      }).then((res) => res.json()),
      fetch(`${API_URL}/api/persona`,{
        method: 'GET',
        headers: getHeaders(),
      }).then((res) => res.json()),
      fetch(`${API_URL}/api/habitacion`,{
        method: 'GET',
        headers: getHeaders(),
      }).then((res) => res.json()),
    ])
      .then(([reservasResponse, personasResponse, habitacionesResponse]) => {
        if (reservasResponse.status === 'success') {
          setReservas(reservasResponse.data || []);
        }
        if (personasResponse.status === 'success') {
          setPersonas(personasResponse.data || []);
        }
        if (habitacionesResponse.status === 'success') {
          setHabitaciones(habitacionesResponse.data || []);
        }
      })
      .catch((error) => console.error('Error al cargar datos:', error))
      .finally(() => setLoading(false));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Actualizar el estado del formulario
    setFormData({ ...formData, [name]: value });
  
    // Si el usuario selecciona ambas fechas, validar y calcular el monto
    if (name === 'fechaentrada' || name === 'fechasalida') {
      const { fechaentrada, fechasalida } = {
        ...formData,
        [name]: value, // Actualizar la fecha seleccionada
      };
  
      // Validar que ambas fechas estén completas
      if (fechaentrada && fechasalida) {
        // Validar que fechaentrada sea anterior a fechasalida
        if (new Date(fechaentrada) >= new Date(fechasalida)) {
          alert('La fecha de entrada debe ser anterior a la fecha de salida.');
          return;
        }
  
        // Construir la URL con parámetros
        const params = new URLSearchParams({
          fechaentrada,
          fechasalida,
        });
  
        // Llamar al endpoint con fechas como parámetros
        fetch(`${API_URL}/api/reserva/calcular-monto?${params.toString()}`, {
          method: 'GET',
          headers: getHeaders(),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error(errorData.message || 'Error al calcular el monto.');
              });
            }
            return response.json();
          })
          .then((responseData) => {
            if (responseData.status === 'success') {
              // Actualizar el monto calculado en el estado
              setFormData((prev) => ({
                ...prev,
                monto: responseData.data.monto,
              }));
            } else {
              throw new Error(responseData.message || 'Error al calcular el monto.');
            }
          })
          .catch((error) => {
            console.error('Error al calcular el monto:', error);
            alert(error.message || 'Ocurrió un error al calcular el monto.');
          });
      }
    }
  };    

  // Crear o editar reserva
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing
      ? `${API_URL}/api/reserva/${formData.id}`
      : `${API_URL}/api/reserva`;

    fetch(endpoint, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(formData),
    })
      .then((response) => {
        // Verificar si la respuesta HTTP no es exitosa (4xx, 5xx)
        if (!response.ok) {
          return response.json().then((errorData) => {
            // Lanzar un error con los mensajes del backend
            const errorMessages = errorData.errors
              ? errorData.errors.map((err) => err.msg).join('\n')
              : errorData.message || 'Error desconocido';
            throw new Error(errorMessages);
          });
        }
        return response.json(); // Procesar respuesta exitosa
      })
      .then((responseData) => {
        if (responseData.status === 'success') {
          const nuevaReserva = responseData.data;

          if (isEditing) {
            // Actualizar reserva editada en la lista
            setReservas((prev) =>
              prev.map((reserva) =>
                reserva.id === nuevaReserva.id ? nuevaReserva : reserva
              )
            );
            alert(responseData.message || 'Reserva actualizada exitosamente');
          } else {
            // Agregar nueva reserva a la lista
            setReservas((prev) => [...prev, nuevaReserva]);
            alert(responseData.message || 'Reserva creada exitosamente');
          }

          // Reiniciar el formulario
          setFormData({
            id: null,
            fechaentrada: '',
            fechasalida: '',
            habitacionid: '',
            personaid: '',
          });
          setIsEditing(false);
        }
      })
      .catch((error) => {
        // Mostrar los mensajes de error en una alerta
        console.error('Error al guardar reserva:', error);
        alert(error.message || 'Ocurrió un error inesperado. Inténtalo nuevamente.');
      });
  };

  // Eliminar reserva
  const handleDelete = (id) => {
    if (window.confirm(`¿Estas seguro de que deseas eliminar la reserva con ID: ${id}?`)) {
      fetch(`${API_URL}/api/reserva/${id}`, { method: 'DELETE', headers: getHeaders() })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status === 'success') {
            setReservas((prev) =>
              prev.filter((reserva) => reserva.id !== id)
            );
            alert(responseData.message || 'Reserva eliminada exitosamente');
          } else {
            alert('Error: ' + (responseData.message || 'No se pudo eliminar la reserva.'));
          }
        })
        .catch((error) => console.error('Error al eliminar reserva:', error));
    }
  };

  // Cargar datos para editar
  const handleEdit = (reserva) => {
    setFormData(reserva);
    setIsEditing(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Modulo de Reservas</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded bg-white shadow"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Editar Reserva' : 'Crear Reserva'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className='flex flex-col'>
            <label className=''>Fecha de Entrada:</label>
            <input
              type="date"
              name="fechaentrada"
              value={formData.fechaentrada}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>
          <div className='flex flex-col'>
            <label className=''>Fecha de Salida:</label>
            <input
              type="date"
              name="fechasalida"
              value={formData.fechasalida}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>
          <select
            name="personaid"
            value={formData.personaid}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Seleccione una Persona</option>
            {personas.map((persona) => (
              <option key={persona.id} value={persona.id}>
                {persona.nombrecompleto}
              </option>
            ))}
          </select>
          <select
            name="habitacionid"
            value={formData.habitacionid}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Seleccione una Habitacion</option>
            {habitaciones.map((habitacion) => (
              <option key={habitacion.id} value={habitacion.id}>
                Piso {habitacion.habitacionpiso}, Número {habitacion.habitacionnro}
              </option>
            ))}
          </select>
           {/* Campo Monto */}
          <input
            type="text"
            name="monto"
            value={formData.monto || ''}
            readOnly
            placeholder="Monto calculado"
            className="p-2 border rounded bg-gray-100"
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
              <th className="border p-2">Entrada</th>
              <th className="border p-2">Salida</th>
              <th className="border p-2">Habitacion</th>
              <th className="border p-2">Persona</th>
              <th className="border p-2">Monto</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id} className="hover:bg-gray-100">
                <td className="border p-2 text-center">{reserva.id}</td>
                <td className="border p-2">{reserva.fechaentrada}</td>
                <td className="border p-2">{reserva.fechasalida}</td>
                <td className="border p-2">{reserva.habitacionid}</td>
                <td className="border p-2">{reserva.persona.nombrecompleto}</td>
                <td className="border p-2">{reserva.montoreserva}</td>
                <td className="border p-2 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(reserva)}
                    className="bg-blue-600 text-white py-1 px-2 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(reserva.id)}
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
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Persona, Reserva, Habitacion } from './componente/index';

export const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Barra de Navegacion */}
        <nav className="w-1/5 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/persona"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Persona
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/habitacion"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Habitacion
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reserva"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Reserva
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Contenido */}
        <main className="w-4/5 bg-gray-100 p-6">
          <Routes>
            <Route path="/persona" element={<Persona />} />
            <Route path="/habitacion" element={<Habitacion />} />
            <Route path="/reserva" element={<Reserva />} />
            <Route path="/" element={<h1 className='text-2xl font-bold mb-4'>Bienvenido al sistema de reservas</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

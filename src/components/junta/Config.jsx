"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth.jsx";
import { updateUserRequest } from "@/actions/users";
import Swal from "sweetalert2";

function Config() {
  const { user, verifyAuth } = useAuth(); // Obtiene los datos del usuario logueado
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    correo: user?.correo || "",
    password: "",
    rol_id: user?.rol_id || "", // Incluye el rol_id del usuario
    img: user?.img || "", // Incluye la imagen del usuario
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        correo: user.correo || "",
        password: "",
        rol_id: user.rol_id || "",
        img: user.img || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const updatedData = { ...formData };
    if (!updatedData.password) delete updatedData.password; // No enviar contraseña si está vacía

    const [error] = await updateUserRequest({ id: user.carne, user: updatedData });
    setLoading(false);

    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudieron guardar los cambios." });
      return;
    }

    await verifyAuth(); // Actualiza los datos del usuario en el contexto
    void Swal.fire({ icon: "success", title: "Éxito", text: "Datos actualizados correctamente." });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveChanges();
    }
  };

  return (
    <div className="p-8 overflow-auto">
      <h2 className="text-[40px] font-light mb-8 text-accent text-center">Configuración de Perfil</h2>
      <div className="flex flex-col items-center space-y-6">
        {/* Imagen de perfil */}
        <div className="relative">
          <img
            src={formData.img || "/placeholder-profile.png"}
            alt="Imagen de perfil"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
          />
          <input
            type="text"
            value={formData.img}
            onChange={(e) => handleInputChange("img", e.target.value)}
            placeholder="URL de la imagen"
            className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Formulario */}
        <form
          className="w-full max-w-md space-y-6"
          onKeyDown={handleKeyDown} // Permite enviar con Enter
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => handleInputChange("correo", e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Dejar en blanco para no cambiar"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Config;
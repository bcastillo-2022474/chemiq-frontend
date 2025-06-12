import { useRef, useState } from "react";
import { useAuth } from "@/context/auth.jsx";
import { updateUserRequest } from "@/actions/users.js";
import { uploadImageRequest } from "@/actions/image-bucket.js";
import { User } from "lucide-react";

export function MyProfileForm(props) {
  const { user } = useAuth()

  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    nombre: user.nombre || "",
    correo: user.correo || "",
    img: user.img || "",
    password: "",
    confirmPassword: "",
  })


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden")
        return
      }
      if (formData.password.length < 8) {
        setErrorMessage("La contraseña debe tener al menos 8 caracteres")
        return
      }
    }

    const dataToSend = {
      nombre: formData.nombre,
      correo: formData.correo,
      img: formData.img,
    }

    if (formData.password) {
      dataToSend.password = formData.password
    }

    const [error] = await updateUserRequest({
      id: user.carne,
      user: {
        ...user,
        ...dataToSend,
      },
    })
    if (error) {
      setErrorMessage(error.message || "Error al actualizar el perfil")
    }

    props.setIsModalOpen(false)
  }

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log("Archivo seleccionado:", e.target.files[0].name)
      const [error, response] = await uploadImageRequest({ file: e.target.files[0] })
      if (error) {
        setErrorMessage(error.message || "Error al subir la imagen")
        return
      }
      setFormData({
        ...formData,
        img: response.publicUrl,
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrorMessage("")
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }


  return <form onSubmit={handleSubmit} className="space-y-5">
    <div className="flex flex-col md:flex-row gap-5">
      <div className="flex-1">
        <div className="mb-5">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: `${props.theme.colors.Accent || "#505050"}cc` }}
          >
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
            style={{
              backgroundColor: props.theme.colors.Background || "#fff8f0",
              borderColor: `${props.theme.colors.Primary || "#fc5000"}4d`,
              color: props.theme.colors.Accent || "#505050",
              focusBorderColor: props.theme.colors.Primary || "#fc5000",
              focusRingColor: props.theme.colors.Primary || "#fc5000",
            }}
            required
          />
        </div>

        <div className="mb-5">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: `${props.theme.colors.Accent || "#505050"}cc` }}
          >
            Correo
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
            style={{
              backgroundColor: props.theme.colors.Background || "#fff8f0",
              borderColor: `${props.theme.colors.Primary || "#fc5000"}4d`,
              color: props.theme.colors.Accent || "#505050",
              focusBorderColor: props.theme.colors.Primary || "#fc5000",
              focusRingColor: props.theme.colors.Primary || "#fc5000",
            }}
            required
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start">
        <div
          className="relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-2 mb-3 cursor-pointer group"
          style={{
            backgroundColor: `${props.theme.colors.Primary || "#fc5000"}33`,
            borderColor: `${props.theme.colors.Primary || "#fc5000"}4d`,
          }}
          onClick={handleImageClick}
        >
          {formData.img ? (
            <>
              <img
                src={formData.img || "/placeholder.svg"}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                style={{
                  backgroundColor: `${props.theme.colors.Tertiary || "#5f5f5f"}b3`,
                }}
              >
                <div
                  className="text-sm font-medium text-center px-2"
                  style={{ color: props.theme.colors.Primary || "#fc5000" }}
                >
                  Cambiar imagen
                </div>
              </div>
            </>
          ) : (
            <>
              <User
                className="w-12 h-12"
                style={{ color: props.theme.colors.Accent || "#505050" }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                style={{
                  backgroundColor: `${props.theme.colors.Tertiary || "#5f5f5f"}b3`,
                }}
              >
                <div
                  className="text-sm font-medium text-center px-2"
                  style={{ color: props.theme.colors.Primary || "#fc5000" }}
                >
                  Subir imagen
                </div>
              </div>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="w-full">
          <label
            className="block mb-2 text-sm font-medium text-center"
            style={{ color: `${props.theme.colors.Accent || "#505050"}cc` }}
          >
            URL de la imagen
          </label>
          <input
            type="url"
            name="img"
            value={formData.img}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
            style={{
              backgroundColor: props.theme.colors.Background || "#fff8f0",
              borderColor: `${props.theme.colors.Primary || "#fc5000"}4d`,
              color: props.theme.colors.Accent || "#505050",
              focusBorderColor: props.theme.colors.Primary || "#fc5000",
              focusRingColor: props.theme.colors.Primary || "#fc5000",
            }}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
    </div>

    <div
      className="border-t pt-5 mt-5"
      style={{ borderColor: `${props.theme.colors.Secondary || "#e4e4e4"}1a` }}
    >
      <h3
        className="text-lg font-medium mb-4"
        style={{ color: props.theme.colors.Primary || "#fc5000" }}
      >
        Cambiar Contraseña
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: `${props.theme.colors.Accent || "#505050"}cc` }}
          >
            Nueva contraseña (opcional)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
            style={{
              backgroundColor: props.theme.colors.Background || "#fff8f0",
              borderColor: `${props.theme.colors.Primary || "#fc5000"}4d`,
              color: props.theme.colors.Accent || "#505050",
              focusBorderColor: props.theme.colors.Primary || "#fc5000",
              focusRingColor: props.theme.colors.Primary || "#fc5000",
            }}
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: `${props.theme.colors.Accent || "#505050"}cc` }}
          >
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
            style={{
              backgroundColor: props.theme.colors.Background || "#fff8f0",
              borderColor: `${props.theme.colors.Primary || "#fc5000"}4d`,
              color: props.theme.colors.Accent || "#505050",
              focusBorderColor: props.theme.colors.Primary || "#fc5000",
              focusRingColor: props.theme.colors.Primary || "#fc5000",
            }}
            placeholder="Repite la contraseña"
          />
        </div>
      </div>
    </div>

    {errorMessage && (
      <div
        className="text-sm p-3 rounded-lg"
        style={{
          backgroundColor: `#FF000019`,
          borderColor: `#FF00004d`,
          color: "#FF0000",
        }}
      >
        {errorMessage}
      </div>
    )}

    <div
      className="flex justify-end gap-4 pt-4 border-t mt-5"
      style={{ borderColor: `${props.theme.colors.Secondary || "#e4e4e4"}1a` }}
    >
      <button
        type="button"
        onClick={props.onClose}
        className="px-5 py-2.5 rounded-lg transition-colors"
        style={{
          backgroundColor: `${props.theme.colors.Secondary || "#e4e4e4"}0d`,
          color: props.theme.colors.Accent || "#505050",
        }}
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-5 py-2.5 rounded-lg font-medium transition-colors"
        style={{
          backgroundColor: props.theme.colors.Primary || "#fc5000",
          color: props.theme.colors.Secondary || "#e4e4e4",
        }}
      >
        Guardar Cambios
      </button>
    </div>
  </form>;
}

import { useState } from "react"
import { Beaker, Users, Home, Settings, Menu } from "lucide-react"

const sideNavItems = [
    { icon: Home, label: "Inicio", href: "#" },
    { icon: Users, label: "Usuarios", href: "#" },
    { icon: Beaker, label: "Experimentos", href: "#" },
    { icon: Settings, label: "Configuración", href: "#" },
]

const users = [
    { id: 1, name: "María García", email: "maria@example.com", role: "Estudiante" },
    { id: 2, name: "Carlos Rodríguez", email: "carlos@example.com", role: "Profesor" },
    { id: 3, name: "Ana Martínez", email: "ana@example.com", role: "Investigador" },
    { id: 4, name: "Juan López", email: "juan@example.com", role: "Estudiante" },
    { id: 5, name: "Laura Sánchez", email: "laura@example.com", role: "Profesor" },
]

function JuntaPage() {
    const [sideNavOpen, setSideNavOpen] = useState(false)

    return (
        <div className="flex h-screen bg-gray-100">
            {/* SideNav */}
            <nav
                className={`bg-base shadow-lg transition-all duration-300 ease-in-out ${sideNavOpen ? "w-64" : "w-20"} flex flex-col`}
            >
                <div className="p-4 flex justify-between items-center">
                    <h1 className={`text-xl font-bold text-blue-600 ${sideNavOpen ? "block" : "hidden"}`}><img src="./src/assets/img/ChemiqLogoNav.png" className="w-full h-[50px]" /></h1>
                    <button
                        className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        onClick={() => setSideNavOpen(!sideNavOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
                <ul className="flex-1">
                    {sideNavItems.map((item, index) => (
                        <li key={index}>
                            <a
                                href={item.href}
                                className="flex items-center p-4 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                            >
                                <item.icon className="h-6 w-6 mr-4" />
                                <span className={sideNavOpen ? "block" : "hidden"}>{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto bg-tertiary">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Panel de Control</h2>

                {/* Users Table */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <caption className="sr-only">Lista de usuarios registrados en el sistema</caption>
                        <thead className="bg-subase">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Nombre
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Rol
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

export default JuntaPage
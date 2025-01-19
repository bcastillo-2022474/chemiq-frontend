export function UserTable({ users, onEdit, onDelete }) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-xl font-semibold mb-6 text-gray-800">Users</h1>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-4 px-6 rounded-tl-lg">Avatar</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-white shadow-sm rounded-lg">
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                      {user.name[0]}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-800">{user.name}</td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6 text-gray-700">{user.role}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3">
                      <button
                        onClick={() => onEdit(user)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
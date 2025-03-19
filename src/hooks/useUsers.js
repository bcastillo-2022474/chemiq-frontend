import { useState, useEffect } from "react"
import {
  createUserRequest,
  deleteUserRequest,
  getUsers,
  updateUserRequest
} from "@/actions/users"

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    const [error, users] = await getUsers()
    if (error) {
      setError(error)
    } else {
      setUsers(users)
    }

    setLoading(false)
  }

  // Create a new user
  const createUser = async userDTO => {
    const [error] = await createUserRequest(userDTO)
    if (error) {
      setError(error)
    } else {
      void fetchUsers() // Refresh the user list
    }
  }

  // Update user data
  const updateUser = async (userId, userDTO) => {
    const [error] = await updateUserRequest({ id: userId, user: userDTO })
    if (error) {
      setError(error)
    } else {
      void fetchUsers() // Refresh the user list
    }
  }

  // Delete a user
  const deleteUser = async id => {
    const [error] = await deleteUserRequest({ id: id })
    if (error) {
      setError(error)
    } else {
      void fetchUsers() // Refresh the user list
    }
  }

  useEffect(() => {
    void fetchUsers()
  }, [])

  return { users, loading, error, createUser, updateUser, deleteUser }
}

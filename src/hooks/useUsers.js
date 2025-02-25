import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://backend-postgresql.vercel.app/api/users";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL);
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new user
  const createUser = async (userData) => {
    try {
      await axios.post(`${BASE_URL}/create`, userData);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError(err.message);
    }
  };

  // Update user data
  const updateUser = async (userId, userData) => {
    try {
      await axios.put(`${BASE_URL}/${userId}`, userData);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/${userId}`);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, createUser, updateUser, deleteUser };
}

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { resetPasswordRequest } from "@/actions/auth";

const Reset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    console.log('Token from query params:', token);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [error, { message }] = await resetPasswordRequest({ password: newPassword });
    if (error) {
      setMessage(error.message);
      return;
    }

    // @TODO: remove this or do something with the message
    console.log('Password reset:', message);
    navigate('/login');
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Restablecer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Reset;
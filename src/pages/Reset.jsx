import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    try {
      console.log('Sending request with token:', token, 'and newPassword:', newPassword);
      const response = await axios.post('http://localhost:3000/api/resetPassword', { token, newPassword });
      console.log('Response:', response.data);
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Error response:', error.response);
      setMessage(error.response.data.error);
    }
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
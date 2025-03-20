import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPasswordRequest } from "@/actions/users";

const Reset = () => {
  console.log('Reset.jsx');
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [error, message] = await resetPasswordRequest({ password: newPassword, token });
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
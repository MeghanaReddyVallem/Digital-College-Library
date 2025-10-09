import React, { useState } from 'react';

function LibrarianLogin({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isRegister ? '/api/librarian/register' : '/api/librarian/login';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        onLogin(data.librarian);
      } else {
        alert(data.message);
      }
    });
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '40px' }}>
      <h2>{isRegister ? 'Register' : 'Login'} as Librarian</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        {isRegister && (
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        )}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} style={{ marginTop: '10px', backgroundColor: 'transparent', border: 'none', color: '#e50914', cursor: 'pointer' }}>
        {isRegister ? 'Already have an account? Login' : 'Need to register?'}
      </button>
    </div>
  );
}

export default LibrarianLogin;

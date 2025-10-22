import React, { useState } from 'react';

function Login({ onLogin, onRegister, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('student');
  const [hallTicket, setHallTicket] = useState('');
  const [password, setPassword] = useState('');
  const [librarianUsername, setLibrarianUsername] = useState('');
  const [librarianPassword, setLibrarianPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (userType === 'student') {
        onLogin('student', { hallTicket, password });
      } else {
        onLogin('librarian', { username: librarianUsername, password: librarianPassword });
      }
    } else {
      if (userType === 'student') {
        if (contact.length !== 10) {
          setContactError('Contact number must be exactly 10 digits');
          return;
        }
        onRegister('student', { hallTicket, password, name, email, contact });
      } else {
        onRegister('librarian', { username: librarianUsername, password: librarianPassword, name, email });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <button className="back-button" onClick={onBack}>Back</button>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px auto',
            fontSize: '35px',
            border: '3px solid #e50914',
            boxShadow: '0 0 30px rgba(229, 9, 20, 0.4), inset 0 0 30px rgba(229, 9, 20, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img
              src="/librarylogo.jpg"
              alt="Library Logo"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 0 15px rgba(229, 9, 20, 0.3)'
              }}
            />
          </div>
          <h2 className="login-title">{isLogin ? 'Login' : 'Register'}</h2>
        </div>
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
          <label
            style={{
              color: '#e5e5e5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '15px 20px',
              borderRadius: '15px',
              border: userType === 'student' ? '2px solid #e50914' : '2px solid transparent',
              backgroundColor: userType === 'student' ? 'rgba(229, 9, 20, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              transition: 'all 0.3s ease',
              boxShadow: userType === 'student' ? '0 0 20px rgba(229, 9, 20, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (userType !== 'student') {
                e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.05)';
                e.target.style.boxShadow = '0 0 15px rgba(229, 9, 20, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (userType !== 'student') {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <input
              type="radio"
              value="student"
              checked={userType === 'student'}
              onChange={(e) => setUserType(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <span style={{ fontSize: '24px', marginBottom: '5px' }}>🎓</span>
            <span style={{ fontWeight: 'bold' }}>Student</span>
          </label>
          <label
            style={{
              color: '#e5e5e5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '15px 20px',
              borderRadius: '15px',
              border: userType === 'librarian' ? '2px solid #e50914' : '2px solid transparent',
              backgroundColor: userType === 'librarian' ? 'rgba(229, 9, 20, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              transition: 'all 0.3s ease',
              boxShadow: userType === 'librarian' ? '0 0 20px rgba(229, 9, 20, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (userType !== 'librarian') {
                e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.05)';
                e.target.style.boxShadow = '0 0 15px rgba(229, 9, 20, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (userType !== 'librarian') {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <input
              type="radio"
              value="librarian"
              checked={userType === 'librarian'}
              onChange={(e) => setUserType(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <span style={{ fontSize: '24px', marginBottom: '5px' }}>👨‍🏫</span>
            <span style={{ fontWeight: 'bold' }}>Librarian</span>
          </label>
        </div>

        {userType === 'student' ? (
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="login-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div>
                  <input
                    className="login-input"
                    type="tel"
                    placeholder="Contact Number (10 digits)"
                    value={contact}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setContact(value);
                      if (value.length !== 10 && value.length > 0) {
                        setContactError('Contact number must be exactly 10 digits');
                      } else {
                        setContactError('');
                      }
                    }}
                    maxLength="10"
                    required
                  />
                  {contactError && <p style={{ color: '#ff6b6b', fontSize: '12px', margin: '5px 0 0 0' }}>{contactError}</p>}
                </div>
              </>
            )}
            <input
              className="login-input"
              type="text"
              placeholder="Hall Ticket Number"
              value={hallTicket}
              onChange={(e) => setHallTicket(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button">
              {isLogin ? 'Login as Student' : 'Register as Student'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '20px', color: '#e5e5e5' }}>
              {isLogin ? 'New user?' : 'Already have an account?'} <span style={{ color: '#e50914', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register' : 'Login'}</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="login-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </>
            )}
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={librarianUsername}
              onChange={(e) => setLibrarianUsername(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={librarianPassword}
              onChange={(e) => setLibrarianPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button">
              {isLogin ? 'Login as Librarian' : 'Register as Librarian'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '20px', color: '#e5e5e5' }}>
              {isLogin ? 'New user?' : 'Already have an account?'} <span style={{ color: '#e50914', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register' : 'Login'}</span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default Login;

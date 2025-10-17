import React from 'react';

function Home({ onLogoClick }) {
  return (
    <div className="home-container" style={{
      backgroundImage: `url('/background.jpg')`,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backgroundBlendMode: 'overlay'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        maxWidth: '600px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div
          className="logo"
          onClick={onLogoClick}
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '60px',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            border: '4px solid #e50914',
            boxShadow: '0 0 50px rgba(229, 9, 20, 0.4), inset 0 0 50px rgba(229, 9, 20, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.15) rotate(5deg)';
            e.target.style.boxShadow = '0 0 80px rgba(229, 9, 20, 0.8), 0 0 100px rgba(229, 9, 20, 0.4), inset 0 0 80px rgba(229, 9, 20, 0.2)';
            e.target.style.borderColor = '#ff4757';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.boxShadow = '0 0 50px rgba(229, 9, 20, 0.4), inset 0 0 50px rgba(229, 9, 20, 0.1)';
            e.target.style.borderColor = '#e50914';
          }}
        >
          <img
            src="/librarylogo.jpg"
            alt="Library Logo"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(229, 9, 20, 0.3)'
            }}
          />
        </div>
        <h1 style={{
          fontFamily: 'Bebas Neue, cursive',
          letterSpacing: '4px',
          margin: '0',
          textShadow: '0 0 20px rgba(229, 9, 20, 0.8), 0 0 40px rgba(229, 9, 20, 0.4)',
          background: 'linear-gradient(45deg, #e50914, #ff6b6b, #fff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>Digital College Library</h1>
      </div>
      <style jsx>{`
        @keyframes glow {
          from { filter: drop-shadow(0 0 5px rgba(229, 9, 20, 0.5)); }
          to { filter: drop-shadow(0 0 20px rgba(229, 9, 20, 1)); }
        }
      `}</style>
    </div>
  );
}

export default Home;

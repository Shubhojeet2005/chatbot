import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    setError('');
    
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(input || "Explain how AI works");
      const response = await result.response;
      const text = await response.text();
      setResponse(text);
    } catch (err) {
      setError('Failed to get response from AI');
      console.error("Error generating content:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      height: '100vh',
      background: '#000',
      paddingBottom: '15vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glowing background elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(80,80,80,0.3) 0%, rgba(0,0,0,0) 70%)',
        animation: 'float 12s infinite ease-in-out'
      }}></div>
      
      <div style={{
        width: '100%',
        maxWidth: '500px',
        padding: '40px',
        background: 'rgba(20, 20, 20, 0.9)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '25px',
          width: '100%'
        }}>
          <h1 style={{
            color: '#fff',
            fontSize: '1.8rem',
            fontWeight: '400',
            marginBottom: '5px',
            letterSpacing: '-0.5px',
            textAlign: 'center'
          }}>Ask Gemini AI</h1>
          
          <div style={{
            position: 'relative',
            width: '100%'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your question here..."
              style={{
                width: '100%',
                padding: '18px 25px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                outline: 'none',
                background: 'rgba(30, 30, 30, 0.8)',
                boxShadow: isFocused ? '0 0 0 2px rgba(150, 150, 150, 0.3)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                color: '#fff'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: isFocused ? '100%' : '0%',
              height: '1px',
              background: 'linear-gradient(to right, transparent, #aaa, transparent)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}></div>
          </div>
          
          <button 
            type="submit"
            style={{
              padding: '16px 45px',
              fontSize: '1rem',
              fontWeight: '500',
              color: '#fff',
              background: loading ? '#444' : 'linear-gradient(to right, #555, #333)',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              position: 'relative',
              overflow: 'hidden',
              letterSpacing: '0.5px',
              width: '100%',
              maxWidth: '300px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 7px 20px rgba(0, 0, 0, 0.4)';
                e.target.style.background = 'linear-gradient(to right, #666, #444)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                e.target.style.background = 'linear-gradient(to right, #555, #333)';
              }
            }}
            disabled={loading || submitted}
          >
            <span style={{ position: 'relative', zIndex: '2' }}>
              {loading ? 'Processing...' : submitted ? '✓ Submitted' : 'Submit'}
            </span>
            {!loading && (
              <span style={{
                position: 'absolute',
                top: '0',
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                transition: 'all 0.6s ease',
                zIndex: '1'
              }}></span>
            )}
          </button>
          
          {error && (
            <div style={{
              color: '#ff6b6b',
              fontSize: '1rem',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease',
              marginTop: '10px'
            }}>
              {error}
            </div>
          )}

          {response && (
            <div style={{
              color: '#aaa',
              fontSize: '1rem',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease',
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(30, 30, 30, 0.6)',
              borderRadius: '8px',
              borderLeft: '3px solid #555'
            }}>
              {response}
            </div>
          )}
        </form>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
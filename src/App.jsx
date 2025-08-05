import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputSection from './components/InputSection';
import ResultSection from './components/ResultSection';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [results, setResults] = React.useState(null);
  const resultsRef = React.useRef(null);

  const handleCalculate = (data) => {
    setResults(data);
    toast.success('Calculation completed!');
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Add Header */}
      <Header />

      {/* Main Content */}
      <div className="content-container">
        <div className="section-wrapper">
          <InputSection onCalculate={handleCalculate} />
          <div ref={resultsRef}>
            {results && <ResultSection scores={results} />}
          </div>
        </div>
      </div>

      {/* Add Footer */}
      <Footer />

      {/* Keep your styles here */}
      <style jsx>{`
        .app-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-height: 100vh;
          background: #f3e8ff;
          padding: 0;
          margin: 0;
        }

        .content-container {
          width: 100%;
          max-width: 1400px;
          padding: 0 2rem;
          margin: 0 auto;
          margin-top: 2rem; /* Optional spacing from header */
          margin-bottom: 2rem; /* Optional spacing from footer */
        }

        .section-wrapper {
          background: #e9d5ff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          box-sizing: border-box;
        }

        @media (min-width: 1400px) {
          .content-container {
            padding: 0 4rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;

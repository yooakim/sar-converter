import React, { useState } from 'react';
import CoordinateSearchBox from './components/CoordinateSearchBox';
import './App.css';

function App() {
  const [coordinateResult, setCoordinateResult] = useState(null);

  const handleCoordinateChange = (result) => {
    setCoordinateResult(result);
    console.log('Coordinate changed:', result);
  };

  const testCoordinates = [
    {
      name: 'New York City (DD)',
      value: '40.7128, -74.0060',
      description: 'Decimalgrader format'
    },
    {
      name: 'London (GMS)',
      value: '51°30\'26"N, 0°7\'39"W',
      description: 'Grader Minuter Sekunder format'
    },
    {
      name: 'Sydney (GDM)',
      value: '33°52.08\'S, 151°12.48\'E',
      description: 'Grader Decimalminuter format'
    },
    {
      name: 'Tokyo (Blandat)',
      value: '35.6762, 139°41\'30"E',
      description: 'Blandade format (DD latitud, GMS longitud)'
    },
    {
      name: 'Enstaka koordinat (DD)',
      value: '59.3293',
      description: 'Enstaka decimalgrad koordinat'
    },
    {
      name: 'Enstaka koordinat (GMS)',
      value: '40°42\'46"N',
      description: 'Enstaka GMS koordinat'
    }
  ];

  const fillExample = (value) => {
    // Trigger the input change by dispatching an event
    const input = document.querySelector('.coordinate-input');
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SSRS Koordinatkonverterare</h1>
        <p>
          Ange koordinater i valfritt format: Decimalgrader (DD), 
          Grader Minuter Sekunder (GMS), eller Grader Decimalminuter (GDM)
        </p>
      </header>

      <main className="App-main">
        <section className="converter-section">
          <CoordinateSearchBox
            onCoordinateChange={handleCoordinateChange}
            placeholder="Ange koordinater (t.ex. 40.7128, -74.0060 eller 40°42'46&quot;N, 74°0'21&quot;V)"
            showConversions={true}
          />
        </section>

        <section className="examples-section">
          <h2>Prova dessa exempel:</h2>
          <div className="examples-grid">
            {testCoordinates.map((coord, index) => (
              <div key={index} className="example-card">
                <h3>{coord.name}</h3>
                <p className="example-description">{coord.description}</p>
                <div className="example-coordinate">{coord.value}</div>
                <button 
                  className="try-example-btn"
                  onClick={() => fillExample(coord.value)}
                >
                  Prova detta exempel
                </button>
              </div>
            ))}
          </div>
        </section>

        {coordinateResult && (
          <section className="result-section">
            <h2>Aktuellt resultat:</h2>
            <div className="result-display">
              <pre>{JSON.stringify(coordinateResult, null, 2)}</pre>
            </div>
          </section>
        )}

        <section className="info-section">
          <h2>Format som stöds:</h2>
          <div className="format-info">
            <div className="format-card">
              <h3>Decimalgrader (DD)</h3>
              <p>Enkelt decimalformat med positiva/negativa värden</p>
              <div className="format-examples">
                <div>40.7128, -74.0060</div>
                <div>40.7128N, 74.0060V</div>
                <div>-33.8688, 151.2093</div>
              </div>
            </div>
            
            <div className="format-card">
              <h3>Grader Minuter Sekunder (GMS)</h3>
              <p>Traditionellt format med grader, minuter och sekunder</p>
              <div className="format-examples">
                <div>40°42'46"N, 74°0'21"V</div>
                <div>51°30'26"N, 0°7'39"V</div>
                <div>40 42 46 N, 74 0 21 V</div>
              </div>
            </div>
            
            <div className="format-card">
              <h3>Grader Decimalminuter (GDM)</h3>
              <p>Grader med decimalminuter</p>
              <div className="format-examples">
                <div>40°42.767'N, 74°0.35'V</div>
                <div>33°52.08'S, 151°12.48'Ö</div>
                <div>40 42.767 N, 74 0.35 V</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="App-footer">
        <p>
          Byggd för koordinatkonvertering och parsning. 
          Stöder plattformsoberoende geografiska koordinatformat.
        </p>
      </footer>
    </div>
  );
}

export default App;
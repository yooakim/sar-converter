import React, { useState } from "react";
import CoordinateSearchBox from "./components/CoordinateSearchBox";
import "./App.css";

function App() {
  const [coordinateResult, setCoordinateResult] = useState(null);
  const [exampleValue, setExampleValue] = useState(null);

  const handleCoordinateChange = (result) => {
    setCoordinateResult(result);
    console.log("Coordinate changed:", result);
  };

  const testCoordinates = [
    {
      name: "Stockholm (DD)",
      value: "59.3039747, 18.0628513",
      description: "Decimalgrader format",
    },
    {
      name: "Fårösund (GMS)",
      value: "57°51'56\"N, 19°3'11\"E",
      description: "Grader Minuter Sekunder format",
    },
    {
      name: "Värmdö (GDM)",
      value: "59°18.074'N, 18°40.743'E",
      description: "Grader Decimalminuter format",
    },
    {
      name: "Bua (Blandat)",
      value: "57.2411118, 12°6'25\"E",
      description: "Blandade format (DD latitud, GMS longitud)",
    },
    {
      name: "Enstaka koordinat (DD)",
      value: "57.2411118",
      description: "Enstaka decimalgrad koordinat (latitud)",
    },
    {
      name: "Enstaka koordinat (GMS)",
      value: "18°3'46\"E",
      description: "Enstaka GMS koordinat (longitud)",
    },
  ];

  const fillExample = (value) => {
    setExampleValue(value);
    // Reset the external value after a short delay to allow for new examples
    setTimeout(() => setExampleValue(null), 100);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SSRS Koordinatkonverterare</h1>
        <p>
          Ange koordinater i valfritt format: Decimalgrader (DD), Grader Minuter
          Sekunder (GMS), eller Grader Decimalminuter (GDM)
        </p>
      </header>

      <main className="App-main">
        <section className="converter-section">
          <CoordinateSearchBox
            onCoordinateChange={handleCoordinateChange}
            placeholder="Ange koordinater (t.ex. 59.3039747, 18.0628513 eller 57°51'56&quot;N, 19°3'11&quot;Ö)"
            showConversions={true}
            externalValue={exampleValue}
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
                <div>33°52.08'S, 151°12.48'E</div>
                <div>40 42.767 N, 74 0.35 V</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="App-footer">
        <p>
          Byggd för koordinatkonvertering och parsning. Stöder
          plattformsoberoende geografiska koordinatformat.
        </p>
      </footer>
    </div>
  );
}

export default App;

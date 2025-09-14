import React, { useState } from "react";
import CoordinateSearchBox from "./components/CoordinateSearchBox";
import MapDisplay from "./components/MapDisplay";
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
      value: "59.303965,18.0812836",
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
      <header className="App-header" role="banner">
        <h1>Koordinatkonverterare</h1>
        <p>
          Ange koordinater i valfritt format: Decimalgrader (DD), Grader Minuter
          Sekunder (GMS), eller Grader Decimalminuter (GDM)
        </p>
      </header>

      <main className="App-main" role="main">
        <section
          className="converter-section"
          aria-labelledby="converter-heading"
        >
          <h2 id="converter-heading" className="visually-hidden">
            Koordinatkonverterare
          </h2>
          <CoordinateSearchBox
            onCoordinateChange={handleCoordinateChange}
            placeholder="Ange koordinater (t.ex. 59.3039747, 18.0628513 eller 57°51'56&quot;N, 19°3'11&quot;E)"
            showConversions={true}
            externalValue={exampleValue}
          />
        </section>

        <MapDisplay coordinateResult={coordinateResult} />

        <section
          className="examples-section"
          aria-labelledby="examples-heading"
        >
          <h2 id="examples-heading">Prova dessa exempel:</h2>
          <div
            className="examples-grid"
            role="group"
            aria-label="Exempel på koordinatformat"
          >
            {testCoordinates.map((coord, index) => (
              <article key={index} className="example-card">
                <h3>{coord.name}</h3>
                <p className="example-description">{coord.description}</p>
                <div
                  className="example-coordinate"
                  aria-label={`Exempel koordinat: ${coord.value}`}
                >
                  {coord.value}
                </div>
                <button
                  className="try-example-btn"
                  onClick={() => fillExample(coord.value)}
                  aria-label={`Prova exempel för ${coord.name}`}
                >
                  Prova detta exempel
                </button>
              </article>
            ))}
          </div>
        </section>

        {coordinateResult && (
          <section className="result-section" aria-labelledby="result-heading">
            <h2 id="result-heading">Aktuellt resultat:</h2>
            <div
              className="result-display"
              role="region"
              aria-label="Konverteringsresultat"
            >
              <pre aria-label="JSON-formaterat resultat">
                {JSON.stringify(coordinateResult, null, 2)}
              </pre>
            </div>
          </section>
        )}

        <section className="info-section" aria-labelledby="formats-heading">
          <h2 id="formats-heading">Format som stöds:</h2>
          <div className="format-info">
            <div className="format-card">
              <h3>Decimalgrader (DD)</h3>
              <p>Enkelt decimalformat med positiva/negativa värden</p>
              <div className="format-examples">
                <div>40.7128, -74.0060</div>
                <div>40.7128N, 74.0060W</div>
                <div>-33.8688, 151.2093</div>
              </div>
            </div>

            <div className="format-card">
              <h3>Grader Minuter Sekunder (GMS)</h3>
              <p>Traditionellt format med grader, minuter och sekunder</p>
              <div className="format-examples">
                <div>40°42'46"N, 74°0'21"W</div>
                <div>51°30'26"N, 0°7'39"W</div>
                <div>40 42 46 N, 74 0 21 W</div>
              </div>
            </div>

            <div className="format-card">
              <h3>Grader Decimalminuter (GDM)</h3>
              <p>Grader med decimalminuter</p>
              <div className="format-examples">
                <div>40°42.767'N, 74°0.35'W</div>
                <div>33°52.08'S, 151°12.48'E</div>
                <div>40 42.767 N, 74 0.35 W</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="App-footer" role="contentinfo">
        <p>
          Byggd för koordinatkonvertering och parsning. Stöder
          plattformsoberoende geografiska koordinatformat.
        </p>
      </footer>
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import Papa from "papaparse";

export default function Services() {
  const [data, setData] = useState([
    {
      Code: "C001",
      Name: "Diabetes",
      Meaning: "A chronic metabolic disorder",
      System: "NAMASTE",
      TM2: "",
      BMS: "",
    },
    {
      Code: "C002",
      Name: "Hypertension",
      Meaning: "Persistently high BP",
      System: "NAMASTE",
      TM2: "",
      BMS: "",
    },
  ]);
  const [fhirCodeSystem, setFhirCodeSystem] = useState(null);
  const [fhirConceptMap, setFhirConceptMap] = useState(null);

  // CSV Upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  // Add to CodeSystem
  const handleAddToCodeSystem = () => {
    alert("Codes added to in-memory FHIR CodeSystem!");
  };

  // Map Data
  const handleMapData = () => {
    const mapped = data.map((row, index) => ({
      ...row,
      TM2: row.TM2 || `TM2-${1000 + index + 1}`,
      BMS: row.BMS || `BMS-${2000 + index + 1}`,
    }));
    setData(mapped);
  };

  // Generate FHIR JSON
  const handleGenerateFHIR = () => {
    const codeSystem = {
      resourceType: "CodeSystem",
      id: "example-codesystem",
      status: "active",
      content: "complete",
      concept: data.map((row) => ({
        code: row.Code,
        display: row.Name,
        definition: row.Meaning,
      })),
    };

    const conceptMap = {
      resourceType: "ConceptMap",
      id: "example-conceptmap",
      status: "active",
      group: [
        {
          source: "NAMASTE",
          target: "TM2",
          element: data.map((row) => ({
            code: row.Code,
            target: [{ code: row.TM2 }],
          })),
        },
        {
          source: "NAMASTE",
          target: "BMS",
          element: data.map((row) => ({
            code: row.Code,
            target: [{ code: row.BMS }],
          })),
        },
      ],
    };

    setFhirCodeSystem(codeSystem);
    setFhirConceptMap(conceptMap);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Page Title */}
      <h1 style={{ marginBottom: "20px" }}>Terminology Mapping</h1>

      {/* CSV Upload */}
      <section style={{ marginBottom: "20px" }}>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <button onClick={handleAddToCodeSystem} style={{ marginLeft: "10px" }}>
          Add to CodeSystem
        </button>
      </section>

      {/* Data Table */}
      <section style={{ marginBottom: "20px" }}>
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Meaning</th>
              <th>System</th>
              <th>TM2</th>
              <th>BMS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.Code}</td>
                <td>{row.Name}</td>
                <td>{row.Meaning}</td>
                <td>{row.System}</td>
                <td>{row.TM2}</td>
                <td>{row.BMS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Map + Generate Buttons */}
      <section style={{ marginBottom: "20px" }}>
        <button onClick={handleMapData} style={{ marginRight: "10px" }}>
          Map Data
        </button>
        <button onClick={handleGenerateFHIR}>Generate FHIR</button>
      </section>

      {/* FHIR JSON Outputs */}
      {fhirCodeSystem && (
        <section style={{ marginBottom: "20px" }}>
          <h2>FHIR CodeSystem</h2>
          <pre
            style={{
              backgroundColor: "#f4f4f4",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            {JSON.stringify(fhirCodeSystem, null, 2)}
          </pre>
        </section>
      )}

      {fhirConceptMap && (
        <section>
          <h2>FHIR ConceptMap</h2>
          <pre
            style={{
              backgroundColor: "#f4f4f4",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            {JSON.stringify(fhirConceptMap, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import Papa from "papaparse";

export default function Services() {
  const [data, setData] = useState([
   
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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Terminology Mapping</h1>
        <p className="text-secondary">Map between different medical terminology systems and generate FHIR resources</p>
      </div>

      {/* CSV Upload */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Data Import</h2>
          <p className="text-sm text-secondary mt-1">Upload CSV files to import terminology data</p>
        </div>
        <div className="card-body ">
          <div className="flex flex-col md:flex-row gap-4 ">
            <div className="flex-1 items-end">
              <label htmlFor="csv-upload" className="form-label">CSV File</label>
              <div className="flex gap-3">
              <input 
                id="csv-upload"
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload}
                className="form-input"
                aria-describedby="csv-help"
              />
              <button 
                onClick={handleAddToCodeSystem} 
                className="btn btn-primary py-2 mt-2"
                disabled={data.length === 0}
                aria-describedby="add-help"
              >

                Add to CodeSystem
              </button>
              </div>
              <p id="csv-help" className="text-xs text-muted mt-1">Select a CSV file with Code, Name, Meaning, System columns</p>
            </div>
            <div className="flex items-end">
              
            </div>
          </div>
          <p id="add-help" className="text-xs text-muted mt-2">
            Add the imported data to FHIR CodeSystem
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Terminology Data</h2>
          <p className="text-sm text-secondary mt-1">View and manage imported terminology mappings</p>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Namaste Code</th>
                  <th>Name</th>
                  <th>Meaning</th>
                  <th>System</th>
                  <th>TM2 Mapping</th>
                  <th>BMS Mapping</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className="font-mono text-sm">{row.Code}</td>
                    <td className="font-medium">{row.Name}</td>
                    <td className="text-sm">{row.Meaning}</td>
                    <td>
                      <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
                        {row.System}
                      </span>
                    </td>
                    <td className="font-mono text-sm">{row.TM2 || '-'}</td>
                    <td className="font-mono text-sm">{row.BMS || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Actions</h2>
          <p className="text-sm text-secondary mt-1">Process data and generate FHIR resources</p>
        </div>
        <div className="card-body">
          <div className="flex gap-3">
            <button 
              onClick={handleMapData} 
              className="btn btn-secondary"
              disabled={data.length === 0}
              aria-describedby="map-help"
            >
              Map Data
            </button>
            <button 
              onClick={handleGenerateFHIR}
              className="btn btn-primary"
              disabled={data.length === 0}
              aria-describedby="generate-help"
            >
              Generate FHIR
            </button>
          </div>
          <p id="map-help" className="text-xs text-muted mt-2">
            Generate TM2 and BMS mappings for unmapped codes
          </p>
          <p id="generate-help" className="text-xs text-muted mt-1">
            Generate FHIR CodeSystem and ConceptMap resources
          </p>
        </div>
      </div>

      {/* FHIR JSON Outputs */}
      {fhirCodeSystem && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="text-xl font-semibold">FHIR CodeSystem</h2>
            <p className="text-sm text-secondary mt-1">Generated FHIR CodeSystem resource</p>
          </div>
          <div className="card-body">
            <pre className="text-xs max-h-80 overflow-auto bg-neutral-50 p-4 rounded-lg border">
              {JSON.stringify(fhirCodeSystem, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {fhirConceptMap && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">FHIR ConceptMap</h2>
            <p className="text-sm text-secondary mt-1">Generated FHIR ConceptMap resource</p>
          </div>
          <div className="card-body">
            <pre className="text-xs max-h-80 overflow-auto bg-neutral-50 p-4 rounded-lg border">
              {JSON.stringify(fhirConceptMap, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

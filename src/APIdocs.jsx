import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import React from "react";



const endpoints = [
  {
    title: "NAMASTE CodeSystem",
    description:
      "Provides FHIR-compliant NAMASTE codes linked to WHO International Terminologies, ICD-11 TM2, and Biomedicine.",
    method: "GET",
    path: "/api/namaste-codes",
    params: [
      { name: "version", type: "string", description: "Optional version of CodeSystem" },
    ],
    requestExample: `GET /api/namaste-codes?version=2025-01-01`,
    responseExample: `{
  "resourceType": "CodeSystem",
  "id": "namaste",
  "concept": [
    { "code": "A01", "display": "Alpha", "definition": "Represents first type" },
    { "code": "B02", "display": "Beta", "definition": "Represents second type" }
  ]
}`,
  },
  {
    title: "Auto-complete Lookup",
    description:
      "Returns suggested codes from NAMASTE and ICD-11 TM2/Biomedicine for diagnosis auto-complete.",
    method: "GET",
    path: "/api/lookup?term=<search-term>",
    params: [
      { name: "term", type: "string", description: "Search term for diagnosis" },
      { name: "limit", type: "integer", description: "Max number of results (optional)" },
    ],
    requestExample: `GET /api/lookup?term=fever&limit=10`,
    responseExample: `[
  { "code": "A01", "display": "Fever - Ayurveda", "system": "NAMASTE" },
  { "code": "TM2-123", "display": "Fever Pattern", "system": "ICD-11 TM2" }
]`,
  },
  {
    title: "Translate NAMASTE ↔ TM2",
    description:
      "Translates codes between NAMASTE and ICD-11 TM2 codes for interoperability.",
    method: "POST",
    path: "/api/translate",
    params: [
      { name: "sourceCode", type: "string", description: "Code to translate" },
      { name: "direction", type: "string", description: "Translation direction: NAMASTE_TO_TM2 or TM2_TO_NAMASTE" },
    ],
    requestExample: `POST /api/translate
{
  "sourceCode": "A01",
  "direction": "NAMASTE_TO_TM2"
}`,
    responseExample: `{
  "sourceCode": "A01",
  "translatedCode": "TM2-123",
  "display": "Fever Pattern"
}`,
  },
  {
    title: "Upload FHIR Encounter",
    description:
      "Ingests FHIR Bundles with dual coding (NAMASTE + TM2/Biomedicine) and stores in EMR system.",
    method: "POST",
    path: "/api/encounter/upload",
    params: [
      { name: "bundle", type: "FHIR Bundle (JSON)", description: "FHIR Bundle containing problem list entries" },
      { name: "authToken", type: "string", description: "OAuth 2.0 ABHA token" },
    ],
    requestExample: `POST /api/encounter/upload
Headers: Authorization: Bearer <authToken>
Body: {
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "resource": {
        "resourceType": "Condition",
        "code": [
          { "coding": [{ "system": "NAMASTE", "code": "A01", "display": "Alpha" }] },
          { "coding": [{ "system": "ICD-11 TM2", "code": "TM2-123", "display": "Fever Pattern" }] }
        ]
      },
      "request": { "method": "POST", "url": "Condition" }
    }
  ]
}`,
    responseExample: `{
  "status": "success",
  "message": "Bundle ingested successfully",
  "processedEntries": 1
}`,
  },
];

export default function APIdocs() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>
        API Documentation
      </h1>

      {endpoints.map((ep, index) => (
        <section key={index} style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
            {ep.title}
          </h2>
          <p>{ep.description}</p>
          <p>
            <strong>Method:</strong> {ep.method} | <strong>Path:</strong> <code>{ep.path}</code>
          </p>

          {/* Parameters Table */}
          {ep.params.length > 0 && (
            <table
              border="1"
              cellPadding="8"
              style={{ borderCollapse: "collapse", width: "100%", marginBottom: "20px" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {ep.params.map((param, idx) => (
                  <tr key={idx}>
                    <td>{param.name}</td>
                    <td>{param.type}</td>
                    <td>{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Request Example */}
          <div style={{ marginBottom: "10px" }}>
            <strong>Request Example:</strong>
            <pre style={{ backgroundColor: "#f4f4f4", padding: "12px", borderRadius: "8px" }}>
              {ep.requestExample}
            </pre>
          </div>

          {/* Response Example */}
          <div>
            <strong>Response Example:</strong>
            <pre style={{ backgroundColor: "#f4f4f4", padding: "12px", borderRadius: "8px" }}>
              {ep.responseExample}
            </pre>
          </div>
        </section>
      ))}
    </div>
  );
}

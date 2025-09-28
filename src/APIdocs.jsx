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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
        <p className="text-lg text-secondary max-w-3xl">
          Comprehensive API documentation for FHIR-compliant medical terminology services. 
          All endpoints support NAMASTE, ICD-11 TM2, and Biomedicine terminologies.
        </p>
      </div>

      {endpoints.map((ep, index) => (
        <div key={index} className="card mb-8">
          <div className="card-header">
            <h2 className="text-2xl font-semibold mb-2">{ep.title}</h2>
            <p className="text-secondary">{ep.description}</p>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  ep.method === 'GET' ? 'bg-success-100 text-success-800' : 'bg-primary-100 text-primary-800'
                }`}>
                  {ep.method}
                </span>
                <code className="bg-neutral-100 px-2 py-1 rounded text-sm">{ep.path}</code>
              </div>
            </div>

            {/* Parameters Table */}
            {ep.params.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Parameters</h3>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ep.params.map((param, idx) => (
                        <tr key={idx}>
                          <td className="font-mono text-sm">{param.name}</td>
                          <td>
                            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
                              {param.type}
                            </span>
                          </td>
                          <td className="text-sm">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Request Example */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Request Example</h3>
              <pre className="text-xs bg-neutral-50 p-4 rounded-lg border overflow-x-auto">
                {ep.requestExample}
              </pre>
            </div>

            {/* Response Example */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Response Example</h3>
              <pre className="text-xs bg-neutral-50 p-4 rounded-lg border overflow-x-auto">
                {ep.responseExample}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useState } from "react";

/**
 * ValidationPage
 * - FHIR Validation section: posts sample bundle to HAPI FHIR and shows response in a new tab
 * - SNOMED CT validation: GET search (heart attack) -> show response in new tab
 * - LOINC validation: GET search (glucose) with Basic Auth -> show response in new tab
 * - Version controlling: v1/v2/v3 -> show details
 * - ISO 22600: explanatory content
 *
 * NOTE: Some remote endpoints may block client-side cross-origin requests (CORS).
 * If you see CORS errors in the console, call these endpoints from a server-side proxy.
 */
 // Version details for v1, v2, v3
  const versionDetails = {
    v1: {
      summary: "Version 1 — initial prototype",
      details: [
        "Basic CodeSystem ingestion",
        "Simple Code → Mapping demo",
        "No versioning per concept",
      ],
    },
    v2: {
      summary: "Version 2 — production-ready features",
      details: [
        "Add versionId & lastUpdated on resources",
        "Audit metadata support",
        "ConceptMap support",
      ],
    },
    v3: {
      summary: "Version 3 — enterprise & standards-compliant",
      details: [
        "Full FHIR R4 compliance",
        "ISO 22600 access control metadata",
        "SNOMED/LOINC semantics & sync",
        "Robust audit trail and immutable versions",
      ],
    },
  };

export default function Audit() {
  const [isPosting, setIsPosting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetching2, setIsFetching2] = useState(false);
  const[version, setVersion] = useState(versionDetails.v1);

  const sampleBundle = {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        fullUrl: "urn:uuid:patient-1",
        resource: {
          resourceType: "Patient",
          id: "patient-1",
          identifier: [
            {
              system: "http://example.org/abha",
              value: "ABHA-123456",
            },
          ],
          name: [
            {
              use: "official",
              family: "Test",
              given: ["Alice"],
            },
          ],
          gender: "female",
          birthDate: "1980-01-01",
        },
        request: {
          method: "POST",
          url: "Patient",
        },
      },
      {
        fullUrl: "urn:uuid:cond-1",
        resource: {
          resourceType: "Condition",
          id: "cond-1",
          subject: {
            reference: "urn:uuid:patient-1",
          },
          code: {
            coding: [
              {
                system: "http://example.org/namaste",
                code: "NAMASTE-0001",
                display: "Test Ayush Condition",
              },
            ],
            text: "Test Ayush Condition",
          },
          clinicalStatus: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active",
              },
            ],
          },
          verificationStatus: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                code: "confirmed",
              },
            ],
          },
        },
        request: {
          method: "POST",
          url: "Condition",
        },
      },
    ],
  };

  // Helper: open JSON in a new tab with pretty formatting
  const openJsonInNewTab = (obj, title = "Response") => {
    const json = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      alert("Unable to open new tab — check popup blocker.");
      return;
    }
    // Basic HTML: show response in <pre>
    const html = `
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8"/>
          <style> body { font-family: monospace; padding: 18px; background:#fafafa; } pre { white-space: pre-wrap; word-break:break-word; } </style>
        </head>
        <body>
          <h3>${title}</h3>
          <pre>${escapeHtml(json)}</pre>
        </body>
      </html>
    `;
    newWindow.document.open();
    newWindow.document.write(html);
    newWindow.document.close();
  };

  // Escape HTML for safety inside pre
  const escapeHtml = (unsafe) =>
    String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  // 1) FHIR Validation: POST sample bundle to HAPI FHIR
  const validateFHIR = async () => {
    setIsPosting(true);
    try {
      const url = "https://hapi.fhir.org/baseR4/";
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/fhir+json",
          "Content-Type": "application/fhir+json",
        },
        body: JSON.stringify(sampleBundle),
      });

      // Try to parse JSON, fallback to text
      const contentType = resp.headers.get("content-type") || "";
      let data;
      if (contentType.includes("application/json") || contentType.includes("application/fhir+json")) {
        data = await resp.json();
      } else {
        data = await resp.text();
      }

      openJsonInNewTab(
        {
          status: resp.status,
          statusText: resp.statusText,
          response: data,
        },
        "HAPI FHIR Response"
      );
    } catch (err) {
      openJsonInNewTab({ error: String(err) }, "HAPI FHIR Error");
    } finally {
      setIsPosting(false);
    }
  };

  // 2) SNOMED CT: search "heart attack"
  const validateSnomed = async () => {
    setIsFetching(true);
    try {
      const url =
        "https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/descriptions?lang=english&skipTo=0&&limit=1&term=heart%20attack&conceptActive=true&returnLimit=1";
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      const data = await resp.json();
      openJsonInNewTab({ status: resp.status, response: data }, "SNOMED Response");
    } catch (err) {
      openJsonInNewTab({ error: String(err) }, "SNOMED Error");
    } finally {
      setIsFetching(false);
    }
  };

  // 3) LOINC: search "glucose" with Basic Auth (username: Yaloin, password: Yaloinc@123)
  const validateLoinc = async () => {
    setIsFetching2(true);
    try {
      const url =
        "https://loinc.regenstrief.org/searchapi/loincs?query=glucose&rows=1&offset=1&sortorder=loinc_num";
      const username = "Yaloin";
      const password = "Yaloinc@123";
      const basic = btoa(`${username}:${password}`);

      const resp = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Basic ${basic}`,
        },
      });

      // Many public APIs block Basic Auth in browser; if CORS prevents it, you'll need a backend proxy.
      const data = await resp.json();
      openJsonInNewTab({ status: resp.status, response: data }, "LOINC Response");
    } catch (err) {
      openJsonInNewTab({ error: String(err) }, "LOINC Error");
    } finally {
      setIsFetching2(false);
    }
  };

 

  // ISO 22600 summary
  const iso22600Text = `ISO 22600 covers access control for health information, including
policies for authorization, inheritance of access rules, auditability and consent metadata.
In this demo we include meta.security and meta.tag for consent and confidentiality flags
to demonstrate audit-ready metadata. For a production system you would integrate
ISO 22600 profiles (and local legal requirements) into your access control layer.`;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Validation & Standards</h1>
        <p className="text-lg text-secondary max-w-3xl">
          Validate FHIR bundles and ensure compliance with medical standards including SNOMED CT, LOINC, and ISO 22600.
        </p>
      </div>

      {/* FHIR Validation */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-2xl font-semibold">1. FHIR Validation</h2>
          <p className="text-secondary mt-1">Validate FHIR bundles against HAPI FHIR server</p>
        </div>
        <div className="card-body">
          <p className="mb-4">
            Sample FHIR Bundle (Transaction) — click <strong>Validate</strong> to test against HAPI FHIR server
          </p>

          <div className="mb-6">
            <pre className="text-xs max-h-80 overflow-auto bg-neutral-50 p-4 rounded-lg border">
              {JSON.stringify(sampleBundle, null, 2)}
            </pre>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={validateFHIR} 
              disabled={isPosting}
              className="btn btn-primary"
              aria-describedby="fhir-help"
            >
              {isPosting ? "Validating..." : "Validate FHIR Bundle"}
            </button>
          </div>
          <p id="fhir-help" className="text-xs text-muted mt-2">
            Posts the bundle to HAPI FHIR server and displays validation results
          </p>
        </div>
      </div>

      {/* SNOMED CT / LOINC Validation */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-2xl font-semibold">2. SNOMED CT / LOINC Validation</h2>
          <p className="text-secondary mt-1">Validate against international medical terminology standards</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">SNOMED CT</h3>
                <p className="text-sm text-secondary mb-3">Search: <strong>heart attack</strong></p>
                <button 
                  onClick={validateSnomed} 
                  disabled={isFetching}
                  className="btn btn-secondary"
                  aria-describedby="snomed-help"
                >
                  {isFetching ? "Fetching SNOMED..." : "Validate SNOMED"}
                </button>
                <p id="snomed-help" className="text-xs text-muted mt-2">
                  Searches SNOMED CT terminology for heart attack concepts
                </p>
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-secondary mb-1">API Endpoint:</p>
                <code className="text-xs break-all">
                  https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/descriptions?lang=english&skipTo=0&&limit=1&term=heart%20attack&conceptActive=true&returnLimit=1
                </code>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">LOINC</h3>
                <p className="text-sm text-secondary mb-3">Search: <strong>glucose</strong></p>
                <button 
                  onClick={validateLoinc} 
                  disabled={isFetching2}
                  className="btn btn-secondary"
                  aria-describedby="loinc-help"
                >
                  {isFetching2 ? "Fetching LOINC..." : "Validate LOINC"}
                </button>
                <p id="loinc-help" className="text-xs text-muted mt-2">
                  Searches LOINC terminology for glucose-related codes
                </p>
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-secondary mb-1">API Endpoint:</p>
                <code className="text-xs break-all">
                  https://loinc.regenstrief.org/searchapi/loincs?query=glucose&rows=1&offset=1&sortorder=loinc_num
                </code>
                <p className="text-xs text-muted mt-2">
                  Uses Basic Auth: Yaloin / Yaloinc@123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Controlling */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-2xl font-semibold">3. Version Controlling</h2>
          <p className="text-secondary mt-1">Track system versions and feature evolution</p>
        </div>
        <div className="card-body">
          <p className="mb-4">Select a version to view details about that release/design:</p>
          <div className="flex gap-3 mb-6">
            <button 
              onClick={() => setVersion(versionDetails.v1)} 
              className={`btn ${version === versionDetails.v1 ? 'btn-primary' : 'btn-secondary'}`}
              aria-label="View version 1 details"
            >
              v1
            </button>
            <button 
              onClick={() => setVersion(versionDetails.v2)} 
              className={`btn ${version === versionDetails.v2 ? 'btn-primary' : 'btn-secondary'}`}
              aria-label="View version 2 details"
            >
              v2
            </button>
            <button 
              onClick={() => setVersion(versionDetails.v3)} 
              className={`btn ${version === versionDetails.v3 ? 'btn-primary' : 'btn-secondary'}`}
              aria-label="View version 3 details"
            >
              v3
            </button>
          </div>

          <div className="bg-neutral-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">{version.summary}</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span className="text-sm">{version.details[0]}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span className="text-sm">{version.details[1]}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span className="text-sm">{version.details[2]}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ISO 22600 */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-semibold">4. ISO 22600 (Access Control & Consent)</h2>
          <p className="text-secondary mt-1">Healthcare access control and consent management standards</p>
        </div>
        <div className="card-body">
          <p className="mb-6">
            ISO 22600 defines policies for access control in healthcare — how authorizations,
            consent, and confidentiality constraints are expressed and enforced. In the FHIR world,
            this often maps to <code>meta.security</code>, <code>meta.tag</code> and provenance/audit resources.
          </p>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h3 className="text-lg font-semibold mb-4">Audit-ready metadata included in generated FHIR Bundle</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <code className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-sm">meta.versionId</code>
                <span className="text-sm">— resource version identifier</span>
              </li>
              <li className="flex items-start gap-3">
                <code className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-sm">meta.lastUpdated</code>
                <span className="text-sm">— timestamp of last update</span>
              </li>
              <li className="flex items-start gap-3">
                <code className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-sm">meta.security</code>
                <span className="text-sm">— confidentiality classification</span>
              </li>
              <li className="flex items-start gap-3">
                <code className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-sm">meta.tag</code>
                <span className="text-sm">— consent flags (consent-granted / consent-revoked)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sm">Provenance resources can be added for full audit trails (who/when/what)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


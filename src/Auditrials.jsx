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
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 1100, margin: "0 auto" }}>
      <h1>Validation & Standards </h1>

      {/* --- Section 1: FHIR Validation --- */}
      <section style={sectionStyle}>
        <h2>1. FHIR Validation</h2>
        <p>
          Sample FHIR Bundle (Transaction) — click <b>Validate </b> 
          
        </p>

        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <pre style={preStyle}>{JSON.stringify(sampleBundle, null, 2)}</pre>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={validateFHIR} disabled={isPosting}>
            {isPosting ? "Validating..." : "Validate "}
          </button>
          
        </div>
        
      </section>

      {/* --- Section 2: SNOMED CT / LOINC Validation --- */}
      <section style={sectionStyle}>
        <h2>2. SNOMED CT / LOINC Validation</h2>

        <div style={{ display: "flex", gap: 18 }}>
          <div style={{ flex: 1 }}>
            <h3>SNOMED</h3>
            <p>Search: <b>heart attack</b></p>
            <button onClick={validateSnomed} disabled={isFetching}>
              {isFetching ? "Fetching SNOMED..." : "Validate"}
            </button>
            <p style={{ color: "#555", marginTop: 8 }}>
              GET URL:
              <br />
              <small style={{ color: "#333" }}>
                https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/descriptions?lang=english&skipTo=0&&limit=1&term=heart%20attack&conceptActive=true&returnLimit=1
              </small>
            </p>
          </div>

          <div style={{ flex: 1 }}>
            <h3>LOINC</h3>
            <p>Search: <b>glucose</b></p>
            <button onClick={validateLoinc} disabled={isFetching2}>
              {isFetching2 ? "Fetching LOINC..." : "Validate "}
            </button>
            <p style={{ color: "#555", marginTop: 8 }}>
              GET URL:
              <br />
              <small style={{ color: "#333" }}>
                https://loinc.regenstrief.org/searchapi/loincs?query=glucose&rows=1&offset=1&sortorder=loinc_num
              </small>
              <br />
              
            </p>
            
          </div>
        </div>
      </section>

      {/* --- Section 3: Version Controlling --- */}
      <section style={sectionStyle}>
        <h2>3. Version Controlling</h2>
        <p>Select a version to view details about that release/design:</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setVersion(versionDetails.v1) }>v1</button>
          <button onClick={() => setVersion(versionDetails.v2)}>v2</button>
          <button onClick={() => setVersion(versionDetails.v3)}>v3</button>
        </div>

        <div style={{ background: "#f9f9f9", padding: 12, borderRadius: 6 }}>
          <h4>{version.summary}</h4>
          <ul>
            <li>{version.details[0]}</li>
            <li>{version.details[1]}</li>
            <li>{version.details[2]}</li>
          </ul>
        </div>
      </section>

      {/* --- Section 4: ISO 22600 --- */}
      <section style={sectionStyle}>
        <h2>4. ISO 22600 (Access Control & Consent)</h2>
        <p>
          ISO 22600 defines policies for access control in healthcare — how authorizations,
          consent, and confidentiality constraints are expressed and enforced. In the FHIR world,
          this often maps to <code>meta.security</code>, <code>meta.tag</code> and provenance/audit resources.
        </p>

        <div style={{ background: "#fff", padding: 12, borderRadius: 6, border: "1px solid #eee" }}>
          <h4>Audit-ready metadata included in generated FHIR Bundle</h4>
          <ul>
            <li><code>meta.versionId</code> — resource version identifier</li>
            <li><code>meta.lastUpdated</code> — timestamp of last update</li>
            <li><code>meta.security</code> — confidentiality classification</li>
            <li><code>meta.tag</code> — consent flags (consent-granted / consent-revoked)</li>
            <li>Provenance resources can be added for full audit trails (who/when/what)</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// Styles
const sectionStyle = {
  marginTop: 18,
  padding: 14,
  borderRadius: 8,
  background: "#ffffff",
  border: "1px solid #e6e6e6",
};

const preStyle = {
  maxHeight: 360,
  overflow: "auto",
  padding: 12,
  background: "#f7f7f7",
  borderRadius: 6,
  border: "1px solid #eee",
};

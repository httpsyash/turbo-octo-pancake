import React, { useState } from "react";

const dummyHierarchy = [
  {
    name: "Metabolic Disorders",
    Parent: [
      {
        code: "C000",
        name: "Metabolic Disorders",
        meaning: "A chronic disorder",
        system: "NAMASTE",
        tm2: "TM2-1022",
        biomedicine: "ICD-11-dd11",
      },
    ],
    children: [
      {
        code: "C001",
        name: "Diabetes",
        meaning: "A chronic metabolic disorder affecting glucose metabolism.",
        system: "NAMASTE",
        tm2: "TM2-1001",
        biomedicine: "ICD-11-5A11",
      },
      {
        code: "C002",
        name: "Hypertension",
        meaning: "Persistently high blood pressure.",
        system: "NAMASTE",
        tm2: "TM2-1002",
        biomedicine: "ICD-11-5A10",
      },
    ],
  },
  {
    name: "Infectious Diseases",
    Parent: [
      {
        code: "C010",
        name: "Infectious Diseases",
        meaning: "Diseases caused by pathogens",
        system: "NAMASTE",
        tm2: "TM2-2000",
        biomedicine: "ICD-11-2A00",
      },
    ],
    children: [
      {
        code: "C003",
        name: "Malaria",
        meaning: "A mosquito-borne infectious disease.",
        system: "NAMASTE",
        tm2: "TM2-2001",
        biomedicine: "ICD-11-1G40",
      },
    ],
  },
];

export default function DiagnosisSearch() {
  const [abhaId, setAbhaId] = useState("");
  const [otp, setOtp] = useState("");
  const [patient, setPatient] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [problemList, setProblemList] = useState([]);
  const [fhirBundle, setFhirBundle] = useState(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [consent, setConsent] = useState(false);

  // Search bar input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const matches = dummyHierarchy.filter(
        (group) =>
          group.name.toLowerCase().includes(value.toLowerCase()) ||
          group.children.some((child) =>
            child.name.toLowerCase().includes(value.toLowerCase())
          )
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setQuery(item.name);
    setSuggestions([]);
    setSelectedCode(item.Parent[0]); // reset detail panel
  };

  // Simulated ABHA Authentication
  const handleVerify = () => {
    if (abhaId && otp) {
      setPatient({
        id: "patient-123",
        name: "Ravi Kumar",
        gender: "male",
        age: 42,
      });
      alert("Patient verified successfully!");
    } else {
      alert("Please enter ABHA ID and OTP.");
    }
  };

  const handleGenerateOtp = () => {
    alert("OTP Generated: 123456"); // dummy OTP
  };

  const addToProblemList = (code) => {
    setProblemList([...problemList, code]);
  };

  const generateFHIR = () => {
    const bundle = {
      resourceType: "Bundle",
      type: "collection",
      entry: [],
    };

    if (patient) {
      bundle.entry.push({
        resource: {
          resourceType: "Patient",
          id: patient.id,
          name: [{ text: patient.name }],
          gender: patient.gender,
        },
      });
    }

    problemList.forEach((code, idx) => {
      bundle.entry.push({
        resource: {
          resourceType: "Condition",
          id: `condition-${idx + 1}`,
          code: {
            coding: [{ system: code.system, code: code.code, display: code.name }],
            text: code.meaning,
          },
          subject: patient ? { reference: `Patient/${patient.id}` } : undefined,
        },
      });
    });

    setFhirBundle(bundle);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Diagnosis Search </h2>

      {/* ABHA Authentication */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h4>ABHA Authentication</h4>
        <input
          type="text"
          placeholder="Enter ABHA ID"
          value={abhaId}
          onChange={(e) => setAbhaId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="password"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleGenerateOtp} style={{ marginRight: "10px" }}>
          Generate OTP
        </button>
        <button onClick={handleVerify}>Verify OTP</button>
        {/* ✅ Consent Section */}
<div style={{ marginTop: "15px" }}>
  <label>
    <input
      type="checkbox"
      checked={consent}
      onChange={(e) => setConsent(e.target.checked)}
      style={{ marginRight: "8px" }}
    />
    I consent to share my health records with this application{" "}
    <a
      href="https://abdm.gov.in:8081/uploads/privacypolicy_178041845b.pdf"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn more
    </a>
  </label>
</div>
        {patient && (
          <p>
            ✅ Verified: {patient.name}, Age: {patient.age}, Gender: {patient.gender}
          </p>
        )}
      </div>

      {/* Search + Filters */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <input
          type="text"
          placeholder="Search diagnosis..."
          style={{ marginRight: "10px", width: "250px" }}
          value={query}
          onChange={handleInputChange}
        />
        <select style={{ marginRight: "10px" }}>
          <option>All</option>
          <option>NAMASTE</option>
          <option>ICD-11 TM2</option>
          <option>Biomedicine</option>
        </select>

        {suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "36px",
              left: "0",
              width: "250px",
              border: "1px solid #ccc",
              background: "#fff",
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxHeight: "150px",
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(item)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Hierarchy List */}
        <div style={{ flex: 1 }}>
             <h3>Disease</h3>
              <h4>Supertype</h4>
          {selectedItem && (
            <>
             
              
              <p
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => setSelectedCode(selectedItem.Parent[0])}
              >
                
                {selectedItem.name}
              </p>
              </>
              )}
              <h4>Subtype</h4>
              <ul>
                {selectedItem && selectedItem.children.map((child, cIdx) => (
                  <li
                    key={cIdx}
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => setSelectedCode(child)}
                  >
                    {child.name}
                  </li>
                ))}
              </ul>
            
          
        </div>

        {/* Code Details Panel */}
        <div style={{ flex: 1 }}>
          <h4>Code Details</h4>
          {selectedCode ? (
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <p>
                <b>Code:</b> {selectedCode.code}
              </p>
              <p>
                <b>Name:</b> {selectedCode.name}
              </p>
              <p>
                <b>Meaning:</b> {selectedCode.meaning}
              </p>
              <p>
                <b>System:</b> {selectedCode.system}
              </p>
              <p>
                <b>TM2 Mapping:</b> {selectedCode.tm2}
              </p>
              <p>
                <b>Biomedicine Mapping:</b> {selectedCode.biomedicine}
              </p>
              <button onClick={() => addToProblemList(selectedCode)}>
                + Add to Problem List
              </button>
            </div>
          ) : (
            <p>Click a code from the left to view details.</p>
          )}
        </div>
      </div>

      {/* Problem List Table */}
      <div style={{ marginTop: "20px" }}>
        <h4>Problem List</h4>
        {problemList.length > 0 ? (
          <table
            border="1"
            cellPadding="6"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>System</th>
              </tr>
            </thead>
            <tbody>
              {problemList.map((code, idx) => (
                <tr key={idx}>
                  <td>{code.code}</td>
                  <td>{code.name}</td>
                  <td>{code.system}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No problems added yet.</p>
        )}
      </div>

      {/* FHIR Bundle */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={generateFHIR}>Generate FHIR Bundle</button>
        {fhirBundle && (
          <pre
            style={{
              marginTop: "10px",
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "8px",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(fhirBundle, null, 2)}
          </pre>
        )}
        <button onClick={() => {
      generateFHIR();
      alert("✅ FHIR Bundle uploaded successfully!");
    }}>Upload FHIR </button>
      </div>
    </div>
  );
}

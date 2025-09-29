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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Diagnosis Search</h1>
        <p className="text-secondary">Search and explore medical diagnoses using NAMASTE, ICD-11 TM2, and Biomedicine terminologies</p>
      </div>

      {/* ABHA Authentication */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-xl font-semibold">ABHA Authentication</h2>
          <p className="text-secondary text-sm mt-1">Verify patient identity using ABHA (Ayushman Bharat Health Account)</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="abha-id" className="form-label">ABHA ID</label>
              <input
                id="abha-id"
                type="text"
                placeholder="Enter ABHA ID"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                className="form-input"
                aria-describedby="abha-help"
              />
              <p id="abha-help" className="text-xs text-muted mt-1">Your unique health account identifier</p>
            </div>
            <div>
              <label htmlFor="otp" className="form-label">OTP</label>
              <input
                id="otp"
                type="password"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-input"
                aria-describedby="otp-help"
              />
              <p id="otp-help" className="text-xs text-muted mt-1">One-time password sent to your registered mobile</p>
            </div>
          </div>
          <div className="flex gap-3 mb-4">
            <button onClick={handleGenerateOtp} className="btn btn-secondary">
              Generate OTP
            </button>
            <button onClick={handleVerify} className="btn btn-primary">
              Verify OTP
            </button>
          </div>
          {/* Consent Section */}
          <div className="border-t pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="form-checkbox mt-1"
                aria-describedby="consent-help"
              />
              <div>
                <span className="text-sm">I consent to share my health records with this application</span>
                <a
                  href="https://abdm.gov.in:8081/uploads/privacypolicy_178041845b.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                  aria-label="Read privacy policy"
                >
                  Learn more
                </a>
                <p id="consent-help" className="text-xs text-muted mt-1">Required for accessing your health records</p>
              </div>
            </label>
          </div>
          {patient && (
            <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-success-600" role="img" aria-label="Success">✅</span>
                <span className="font-medium text-success-800">Patient Verified</span>
              </div>
              <p className="text-sm text-success-700 mt-1">
                {patient.name}, Age: {patient.age}, Gender: {patient.gender}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Search Diagnosis</h3>
          <div className="flex flex-col md:flex-row gap-4 relative">
            <div className="flex-1">
              <label htmlFor="search-input" className="form-label">Search Term</label>
              <input
                id="search-input"
                type="text"
                placeholder="Search diagnosis..."
                value={query}
                onChange={handleInputChange}
                className="form-input"
                aria-describedby="search-help"
              />
              <p id="search-help" className="text-xs text-muted mt-1">Enter disease name or symptoms</p>
            </div>
            <div className="md:w-48">
              <label htmlFor="system-filter" className="form-label">Terminology System</label>
              <select id="system-filter" className="form-select">
                <option value="">All Systems</option>
                <option value="NAMASTE">NAMASTE</option>
                <option value="ICD-11 TM2">ICD-11 TM2</option>
                <option value="Biomedicine">Biomedicine</option>
              </select>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="relative  left-0 right-0 md:right-auto md:w-80  bg-white  rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              <ul className="">
                {suggestions.map((item, idx) => (
                
                    <button
                      onClick={() => handleSelect(item)}
                      className="w-full px-4 py-2 text-left hover:bg-neutral-50 focus:bg-primary-50 "
                      aria-label={`Select ${item.name}`}
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-secondary">
                        {item.children.length} subtypes available
                      </div>
                    </button>
                
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hierarchy List */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Disease Hierarchy</h3>
          </div>
          <div className="card-body">
            {selectedItem ? (
              <>
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-3 text-primary-600">Supertype</h4>
                  <button
                    onClick={() => setSelectedCode(selectedItem.Parent[0])}
                    className="w-full p-3 text-left border border-primary-200 rounded-lg hover:bg-primary-50 focus:bg-primary-50 focus:outline-none transition-colors"
                    aria-label={`Select ${selectedItem.name} supertype`}
                  >
                    <div className="font-medium text-primary-700">{selectedItem.name}</div>
                    <div className="text-sm text-secondary mt-1">
                      Code: {selectedItem.Parent[0].code}
                    </div>
                  </button>
                </div>
                <div>
                  <h4 className="text-md font-medium mb-3 text-primary-600">Subtypes</h4>
                  <div className="space-y-2">
                    {selectedItem.children.map((child, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => setSelectedCode(child)}
                        className="w-full p-3 text-left border border-neutral-200 rounded-lg hover:bg-neutral-50 focus:bg-primary-50 focus:outline-none transition-colors"
                        aria-label={`Select ${child.name} subtype`}
                      >
                        <div className="font-medium">{child.name}</div>
                        <div className="text-sm text-secondary mt-1">
                          Code: {child.code}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-secondary">
                <p>Search for a disease to view its hierarchy</p>
              </div>
            )}
          </div>
        </div>

        {/* Code Details Panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Code Details</h3>
          </div>
          <div className="card-body">
            {selectedCode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-secondary">Code</label>
                    <p className="text-lg font-mono bg-neutral-50 p-2 rounded">{selectedCode.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary">Name</label>
                    <p className="text-lg font-medium">{selectedCode.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary">Meaning</label>
                    <p className="text-sm">{selectedCode.meaning}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary">System</label>
                    <p className="text-sm font-mono bg-primary-50 text-primary-700 px-2 py-1 rounded inline-block">{selectedCode.system}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary">TM2 Mapping</label>
                    <p className="text-sm font-mono">{selectedCode.tm2}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary">Biomedicine Mapping</label>
                    <p className="text-sm font-mono">{selectedCode.biomedicine}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <button 
                    onClick={() => addToProblemList(selectedCode)}
                    className="btn btn-primary w-full"
                    aria-label={`Add ${selectedCode.name} to problem list`}
                  >
                    + Add to Problem List
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-secondary">
                <p>Select a code from the hierarchy to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Problem List Table */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Problem List</h3>
          <p className="text-sm text-secondary mt-1">Selected diagnoses for FHIR bundle generation</p>
        </div>
        <div className="card-body">
          {problemList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>System</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problemList.map((code, idx) => (
                    <tr key={idx}>
                      <td className="font-mono text-sm">{code.code}</td>
                      <td className="font-medium">{code.name}</td>
                      <td>
                        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
                          {code.system}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => setProblemList(problemList.filter((_, i) => i !== idx))}
                          className="text-error-600 hover:text-error-700 text-sm"
                          aria-label={`Remove ${code.name} from problem list`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-secondary">
              <p>No problems added yet. Select codes from the hierarchy above.</p>
            </div>
          )}
        </div>
      </div>

      {/* FHIR Bundle */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold">FHIR Bundle Generation</h3>
          <p className="text-sm text-secondary mt-1">Generate and upload FHIR-compliant bundles</p>
        </div>
        <div className="card-body">
          <div className="flex gap-3 mb-4">
            <button 
              onClick={generateFHIR}
              className="btn btn-primary"
              disabled={problemList.length === 0}
              aria-describedby="generate-help"
            >
              Generate FHIR Bundle
            </button>
            <button 
              onClick={() => {
                generateFHIR();
                alert("✅ FHIR Bundle uploaded successfully!");
              }}
              className="btn btn-success"
              disabled={problemList.length === 0}
              aria-describedby="upload-help"
            >
              Upload FHIR Bundle
            </button>
          </div>
          <p id="generate-help" className="text-xs text-muted mb-2">
            Generate a FHIR bundle from the selected problems
          </p>
          <p id="upload-help" className="text-xs text-muted mb-4">
            Upload the generated bundle to the EMR system
          </p>
          
          {fhirBundle && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-3">Generated FHIR Bundle</h4>
              <pre className="text-xs max-h-80 overflow-auto bg-neutral-50 p-4 rounded-lg border">
                {JSON.stringify(fhirBundle, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

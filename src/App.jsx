import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import  APIdocs  from "./APIdocs.jsx";
import Services from "./terminologymapping.jsx";
import DiagnosisSearch from "./DiagnosisSearch.jsx";
import Audit from "./Auditrials.jsx";

function Header() {
  return (
    <header style={{ background: "#2563eb", color: "white", padding: "16px", fontSize: "20px", fontWeight: "bold" }}>
      My App Header
    </header>
  );
}

function Sidebar() {
  return (
    <aside style={{ width: "200px", background: "#e5e7eb", height: "100vh", padding: "16px" }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/DiagnosisSearch">Diagnosis research</Link>
        <Link to="/services">Terminology mapping</Link>
       
        <Link to="/APIdocs">API documntation</Link>
        <Link to="/Audits">Validation & Standards</Link>
      </nav>
    </aside>
  );
}

// Example pages
function Home() { return <div>
  <h2>🏠 Home Page</h2>
  <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",        // space between items
    justifyContent: "flex-start",
  }}
>
  <div style={{ border: "1px solid #ccc", padding: "12px" }}>
    <p>Search</p>
    <Link to="/DiagnosisSearch">Start Search</Link>
  </div>

  <div style={{ border: "1px solid #ccc", padding: "12px" }}>
    <p>Terminology mapping</p>
    <Link to="/services">Terminology mapping</Link>
  </div>

  

  <div style={{ border: "1px solid #ccc", padding: "12px" }}>
    <p>API documentation</p>
    <Link to="/APIdocs">API documentation</Link>
  </div>

  <div style={{ border: "1px solid #ccc", padding: "12px" }}>
    <p>Audit logs</p>
    <Link to="/Audits">Validation & Standards</Link>
  </div>


</div>



</div>; }



export default function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <main style={{ flex: 1, padding: "24px", background: "white" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/DiagnosisSearch" element={<DiagnosisSearch/>} />
              <Route path="/services" element={<Services />} />
             
              <Route path="/APIdocs" element={<APIdocs />} />
              <Route path="/Audits" element={<Audit />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

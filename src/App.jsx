import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import  APIdocs  from "./APIdocs.jsx";
import Services from "./terminologymapping.jsx";
import DiagnosisSearch from "./DiagnosisSearch.jsx";
import Audit from "./Auditrials.jsx";

function Header({ onMenuToggle, isMenuOpen }) {
  return (
    <header style={{ 
      backgroundColor: 'white', 
      borderBottom: '1px solid #e5e5e5', 
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '1rem 1.5rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'block'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            <svg style={{ width: '1.5rem', height: '1.5rem', color: '#737373' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            backgroundColor: '#171717', 
            borderRadius: '0.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>🏥</span>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#171717', margin: 0 }}>Medical Terminology Hub</h1>
        </div>
        <div style={{ 
          fontSize: '0.875rem', 
          color: '#737373',
          display: 'none'
        }} className="header-subtitle">
          NAMASTE • ICD-11 • FHIR Standards
        </div>
      </div>
    </header>
  );
}

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/DiagnosisSearch", label: "Diagnosis Research", icon: "🔍" },
    { path: "/services", label: "Terminology Mapping", icon: "🗺️" },
    { path: "/APIdocs", label: "API Documentation", icon: "📚" },
    { path: "/Audits", label: "Validation & Standards", icon: "✅" }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                backgroundColor: '#171717', 
                borderRadius: '0.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>🏥</span>
              </div>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#171717', margin: 0 }}>Medical Hub</h2>
                <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>Terminology System</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'none'
              }}
              className="mobile-close-btn"
              aria-label="Close menu"
            >
              <svg style={{ width: '1.5rem', height: '1.5rem', color: '#737373' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close mobile menu when navigating
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  transition: 'all 200ms ease-in-out',
                  backgroundColor: location.pathname === item.path ? '#171717' : 'transparent',
                  color: location.pathname === item.path ? 'white' : '#737373',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.backgroundColor = '#f5f5f5';
                    e.target.style.color = '#171717';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#737373';
                  }
                }}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: '0.75rem', color: '#737373', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>NAMASTE • ICD-11 • FHIR</p>
            <p style={{ margin: '0.25rem 0 0 0' }}>Standards Compliant</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Home() {
  const features = [
    {
      title: "Diagnosis Research",
      description: "Search and explore medical diagnoses with NAMASTE, ICD-11 TM2, and Biomedicine terminologies",
      icon: "🔍",
      link: "/DiagnosisSearch",
      color: "primary"
    },
    {
      title: "Terminology Mapping",
      description: "Map between different medical terminology systems and generate FHIR resources",
      icon: "🗺️",
      link: "/services",
      color: "secondary"
    },
    {
      title: "API Documentation",
      description: "Comprehensive API documentation for FHIR-compliant medical terminology services",
      icon: "📚",
      link: "/APIdocs",
      color: "primary"
    },
    {
      title: "Validation & Standards",
      description: "Validate FHIR bundles and ensure compliance with medical standards",
      icon: "✅",
      link: "/Audits",
      color: "secondary"
    }
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">Welcome to Medical Terminology Hub</h1>
        <p className="text-lg text-secondary text-center max-w-2xl mx-auto">
          A comprehensive platform for medical terminology management, mapping, and validation 
          using NAMASTE, ICD-11 TM2, and FHIR standards.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {features.map((feature, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            transition: 'box-shadow 200ms ease-in-out',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}>
            <div style={{ 
              padding: '1.5rem', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div style={{ 
                fontSize: '2.25rem', 
                marginBottom: '1rem' 
              }} role="img" aria-label={feature.title}>
                {feature.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '0.75rem',
                color: '#171717',
                margin: '0 0 0.75rem 0'
              }}>{feature.title}</h3>
              <p style={{ 
                color: '#737373', 
                marginBottom: '1rem', 
                fontSize: '0.875rem',
                flex: 1,
                margin: '0 0 1rem 0'
              }}>{feature.description}</p>
              <Link 
                to={feature.link} 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  lineHeight: '1.25',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  backgroundColor: 'white',
                  color: '#171717',
                  transition: 'all 150ms ease-in-out',
                  width: '100%',
                  marginTop: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.borderColor = '#d4d4d4';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#e5e5e5';
                }}
                aria-label={`Go to ${feature.title}`}
              >
                Get Started
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="card">
          <div className="card-body">
            <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-neutral-900">500+</div>
                <div className="text-neutral-600">Medical Codes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-900">3</div>
                <div className="text-neutral-600">Terminology Systems</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-900">FHIR R4</div>
                <div className="text-neutral-600">Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Router>
      <div className="flex h-screen bg-neutral-50">
        <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
        <div className="main-content flex flex-col flex-1 overflow-hidden">
          <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
          <main className="flex-1 overflow-y-auto bg-white">
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

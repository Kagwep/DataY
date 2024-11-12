import { SetStateAction, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SurveyBuilder from './componets/SurveyBuilder'
import { FormResponse, FormStructure } from './types'
import FormRenderer from './componets/FormRenderer'
import HomePage from './pages/Home'
import Navbar from './componets/Navbar'
import Footer from './componets/Footer'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import MarketplacePage from './pages/MarketplacePage';
import EarnPage from './componets/EarnPage';
import SurveysPage from './pages/SurveysPage'
import ImageAnnotationPage from './pages/Annotate'
import AnnotationMarketplacePage from './pages/Annotation'

const Layout = ({ children }: {children: any}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};


function App() {

  const handleFormSubmit = (response: FormResponse) => {
    console.log('Form Response:', response);
  };

  
  const sampleForm: FormStructure = {
    "title": "Hello world",
    "description": "This is a test",
    "fields": [
        {
            "type": "text",
            "label": "Name",
            "required": true,
            "options": [],
            "id": "field_1729695247610"
        },
        {
            "type": "number",
            "label": "Age",
            "required": true,
            "options": [],
            "id": "field_1729695260705"
        },
        {
            "type": "textarea",
            "label": "Address",
            "required": true,
            "options": [],
            "id": "field_1729695272201"
        },
        {
            "type": "radio",
            "label": "What makes you happy",
            "required": true,
            "options": [
                "Money",
                "health",
                "hobbies"
            ],
            "id": "field_1729695306146"
        },
        {
            "type": "checkbox",
            "label": "are you a thief",
            "required": true,
            "options": [
                "yes",
                "no"
            ],
            "id": "field_1729695327866"
        },
        {
            "type": "select",
            "label": "When do you go to school",
            "required": true,
            "options": [
                "Moday",
                "Tue",
                "Wed",
                "Thur",
                "Fri"
            ],
            "id": "field_1729695376866"
        }
    ]
};

const [currentPage, setCurrentPage] = useState('home');

// Navigation handler
const navigate = (page: SetStateAction<string>) => {
  setCurrentPage(page);
  // Update URL without page reload
  window.history.pushState({}, '', `/${page === 'home' ? '' : page}`);
};

// Content renderer based on current page
const renderContent = () => {
  switch (currentPage) {
    // case 'marketplace':
    //   return <MarketplacePage />;
    // case 'surveys':
    //   return <SurveysPage />;
    // case 'earn':
    //   return <EarnPage />;
    default:
      return <HomePage />;
  }
};

  // Navigation links configuration
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'surveys', label: 'Surveys' },
    { id: 'earn', label: 'Earn' }
  ];

  return (
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/surveys" element={<SurveysPage />} />
          <Route path="/earn" element={<EarnPage />} />
          <Route path="/annotation" element={<AnnotationMarketplacePage />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
                <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                <NavLink 
                  to="/" 
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go Home
                </NavLink>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
  )
}

export default App

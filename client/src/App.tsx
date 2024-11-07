
import Navbar from '@/components/NavBar/Navbar';
import LoginGuard from '@/features/loginGuard/LoginGuard.tsx';
import MyProtectedData from '@/features/myProtectedData/MyProtectedData.tsx';
import CreateProtectedData from '@/features/myProtectedData/createProtectedData/CreateProtectedData.tsx';
import OneProtectedData from '@/features/myProtectedData/oneProtectedData/OneProtectedData.tsx';
import MyEmailContacts from '@/features/sendEmail/MyEmailContacts.tsx';
import SendEmailForm from '@/features/sendEmail/SendEmailForm.tsx';
import { useWatchWagmiAccount } from '@/utils/watchWagmiAccount.ts';
import { SetStateAction, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SurveyBuilder from './components/SurveyBuilder'
import { FormResponse, FormStructure } from './types'
import FormRenderer from './components/FormRenderer'
import HomePage from './pages/Home'
import Footer from './components/Footer'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import MarketplacePage from './pages/MarketplacePage';
import EarnPage from './components/EarnPage';
import SurveysPage from './pages/SurveysPage'
import ImageAnnotationPage from './pages/Annotate'
import AnnotationMarketplacePage from './pages/Annotation'
import UserProfilePage from './pages/UsersPage';



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

  useWatchWagmiAccount();

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
          <Route path="/marketplace"
           element={
            <LoginGuard>
            <MarketplacePage />  
            </LoginGuard>
            } />
          <Route path="/surveys" element={
            <LoginGuard>
            <SurveysPage />
            </LoginGuard>
            } />
          <Route path="/earn" element={
            <LoginGuard>
            <EarnPage />
            </LoginGuard>
            } />
          <Route path="/annotation" element={
            <LoginGuard>
            <AnnotationMarketplacePage />
            </LoginGuard>
            } />
          <Route path="/profile" element={
            <LoginGuard>
            <UserProfilePage />
            </LoginGuard>
            } />
          <Route path="/surveys/create-survey" element={
            <LoginGuard>
            <SurveyBuilder />
            </LoginGuard>
            } />
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


// function App() {
//   useWatchWagmiAccount();

//   return (
//     <div className="App">
//       <NavBar />
//       <div className="mx-auto mt-12 w-[80%] max-w-6xl">
//         <Routes>
//           <Route
//             path="protectedData"
//             element={
//               <LoginGuard>
//                 <MyProtectedData />
//               </LoginGuard>
//             }
//           />
//           <Route
//             path="/protectedData/consent/:protectedDataAddress"
//             element={
//               <LoginGuard>
//                 <OneProtectedData />
//               </LoginGuard>
//             }
//           />
//           <Route
//             path="/protectedData/create"
//             element={
//               <LoginGuard>
//                 <CreateProtectedData />
//               </LoginGuard>
//             }
//           />
//           <Route
//             path="sendEmail"
//             element={
//               <LoginGuard>
//                 <MyEmailContacts />
//               </LoginGuard>
//             }
//           />
//           <Route
//             path="/sendEmail/:receiverAddress/:protectedDataAddress"
//             element={
//               <LoginGuard>
//                 <SendEmailForm />
//               </LoginGuard>
//             }
//           />
//           {/* default redirect */}
//           <Route path="*" element={<Navigate to="protectedData" />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;

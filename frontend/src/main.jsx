import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './Context/UserProvider';
import { QuestionProvider } from './Context/QuestionContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <QuestionProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QuestionProvider>
  </UserProvider>
);
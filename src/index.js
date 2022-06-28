import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import './index.css';

import App from './App';
import Signin from './pages/signin/signin';
import Signup from './pages/signup/signup';

import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import store from './store/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* Страница главная страница */}
        <Route path="/signup" element={<Signup />} /> {/* Страница регистрации */}
        <Route path="/signin" element={<Signin />} /> {/* Страница входа */}
      </Routes>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Routes,Route } from "react-router-dom";

import './styles/global/setup.scss';
import './styles/global/elements.scss';
import './styles/global/animations.scss';


import App from './App';
import Dev from './Dev';
import Register from './pages/register/register';
import Login from './pages/login/login';
import UserAgreement from './pages/userAgreement/userAgreement';
import EditProfile from './pages/editProfile/editProfile';
import NewPost from './pages/newPost/newPost';

import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import store from './store/index';
import User from './pages/user/user';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* Страница главная страница */}
        <Route path="/dev" element={<Dev />} /> {/* Страница главная страница */}

        <Route path="/user/:id" element={<User />} /> {/* Профиль пользователя */}
        <Route path="/editProfile" element={<EditProfile />} /> {/* Редактирование профиля */}
        <Route path="/newPost" element={<NewPost />} /> {/* Создать новый пост */}

        <Route path="/login" element={<Login />} /> {/* Страница регистрации */}
        <Route path="/register" element={<Register />} /> {/* Страница входа */}

        <Route path="/userAgreement" element={<UserAgreement />} /> {/* Страница входа */}
      </Routes>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();

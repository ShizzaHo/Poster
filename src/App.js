import './App.scss';
import {useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';

import PosterTitle from './components/global/posterTitle/PosterTitle';

export default function App() {
  const navigate = useNavigate();

  const [openPanel, setOpenPanel] = useState(false);

  useEffect(() =>{
    const checkSession = async () => {
      const userSession = localStorage.getItem("SESSION_TOKEN");
      let response = await fetch("http://localhost:3001/api/getUserInfo?session="+ await userSession);

      if (response.ok) {
          let json = await response.json();
          if (json.payload.status === "OK") {
            navigate('/user/'+json.payload.data.login, [navigate])
          } else {
            localStorage.setItem("SESSION_TOKEN", undefined);
          }
      }
    }
    checkSession();
  }, []);

  return (
    <main className='app'>
      <div className={openPanel ? "app__blurPanel_open" : "app__blurPanel"}>
        <div className='blurPanel__content'>
          <PosterTitle />
          <div className='content__buttonPanel'>
            <button className='buttonPanel_button button' onClick={login}>Войти</button>
            <button className='buttonPanel_button button' onClick={register}>Регистрация</button>
            <a href='#'>Забыли пароль?</a>
          </div>
        </div>
      </div>
    </main>
  );

  function login() {
    setOpenPanel(true)
    setTimeout(()=>{navigate('/login', [navigate])},1000)
  }

  function register() {
    setOpenPanel(true)
    setTimeout(()=>{navigate('/register', [navigate])},1000)
  }

}
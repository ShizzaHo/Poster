import './App.scss';
import {useNavigate} from 'react-router-dom';

import PosterTitle from './components/global/posterTitle/PosterTitle';

export default function App() {
  const navigate = useNavigate();

  return (
    <main className='app'>
      <div className='app__blurPanel'>
        <div className='blurPanel__content'>
          <PosterTitle />
          <div className='content__buttonPanel'>
            <button className='buttonPanel_button button' onClick={signin}>Войти</button>
            <button className='buttonPanel_button button'>Регистрация</button>
            <a href='#'>Забыли пароль?</a>
          </div>
        </div>
      </div>
    </main>
  );

  function signin() {
    navigate('/signin', [navigate])
  }

}
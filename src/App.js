import './App.scss';
import { useDispatch, useSelector } from 'react-redux';

export default function App() {
  const state = useSelector(state => state);

  return (
    <main>
      <a href='/signup'>Регистрация</a><br></br>
      <a href='/signin'>Авторизация</a><br></br>
      <a href='/userAgreement'>Пользовательское соглашение</a><br></br>
    </main>
  );
}
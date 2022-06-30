import './App.scss';
import {useNavigate} from 'react-router-dom';

export default function Dev() {
  const navigate = useNavigate();

  return (
    <main>
      <h4>Эта страница предназначена для разработчиков, и будет доступна только в период разработки</h4>
      <a href='/signup'>Регистрация</a><br></br>
      <a href='/signin'>Авторизация</a><br></br>
      <a href="#" onClick={openMyPage}>Личная страница</a><br></br>
      <a href='/userAgreement'>Пользовательское соглашение</a><br></br>
      <br></br>
      <a href='#' onClick={clearLS}>Очистить LocalStorage</a><br></br>
    </main>
  );

  function clearLS() {
    window.localStorage.clear();
    alert("Очищено")
  }

  async function openMyPage() {
    let response = await fetch("http://localhost:3001/api/getUserInfo?session="+window.localStorage.getItem("SESSION_TOKEN"));

    if (response.ok) {
      let json = await response.json();
      if (json.payload.status === "OK") {
        navigate('/user/'+json.payload.data.login, {replace: true}, [navigate])
      } else {
        navigate('/user/signin')
      }
    }
  }
}
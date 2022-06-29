import './App.scss';

export default function App() {
  return (
    <main>
      <a href='/signup'>Регистрация</a><br></br>
      <a href='/signin'>Авторизация</a><br></br>
      <a href='/signin'>Личная страница</a><br></br>
      <a href='/userAgreement'>Пользовательское соглашение</a><br></br>
      <br></br>
      <a href='#' onClick={clearLS}>Очистить LocalStorage</a><br></br>
    </main>
  );

  function clearLS() {
    window.localStorage.clear();
    alert("Очищено")
  }
}
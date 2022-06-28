import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';

export default function App() {
  const state = useSelector(state => state);

  return (
    <>
      <button onClick={cu}>Создать юзера (Пример)</button>
    </>
  );
}

async function cu() {
  let response = await fetch("http://localhost:3001/api/createUser",{
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: "Павел Дуров",
      email: "VernySteny@mail.ru",
      fullname: "Дуров Дура Дурович",
      password: "YaNeNeo",
      passwordRepeat: "YaNeNeo"
    })
  });

  if (response.ok) {
    let json = await response.json();
    if (json.payload.data == ) {
      
    }
    console.log(json);
  } else {
    alert("Ошибка HTTP: " + response.status);
  }
}
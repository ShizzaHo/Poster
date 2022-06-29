import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const openPageLogin = window.location.pathname.split("/")[2];

export default function User(props) {

    const [userData, setUserData] = useState({});
    const [accountInfo, setAccountInfo] = useState({});

    useEffect(() =>{
        const getData = async () => {
            let response = await fetch("http://localhost:3001/api/getUserInfo",{
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: openPageLogin
                })
            });

            if (response.ok) {
                let json = await response.json();
                if (json.payload.status === "OK") {
                    setUserData(json.payload.data);
                    setAccountInfo(json.payload.data.accountInfo);
                } else {
                    errorPage();
                }
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
        }
        getData();
    }, []);

    return (
        <main className=''>
            <p>Логин: {userData.login}</p>
            <p>Полное имя: {userData.fullname}</p>
            <p>Статус пользователя: {accountInfo.profileStatus}</p>
            <p>Email: {userData.email}</p>
            <p>Статус аккаунта: {userData.status}</p>
        </main>
    );

    function errorPage() {
        
    }
}
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {useNavigate} from 'react-router-dom';


export default function User(props) {
    const [userData, setUserData] = useState({});
    const [accountInfo, setAccountInfo] = useState({});

    const [userEditLogin, setUserEditLogin] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() =>{
        const getData = async () => {
            const userSession = localStorage.getItem("SESSION_TOKEN");
            let response = await fetch("http://localhost:3001/api/getUserInfo?session="+ await userSession);

            if (response.ok) {
                let json = await response.json();
                if (json.payload.status === "OK") {
                    setUserData(json.payload.data);
                    setAccountInfo(json.payload.data.accountInfo);
                    setUserEditLogin(json.payload.data.login)
                } else {
                    errorPage();
                }
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
        }
        getData();
    },[]);

    return (
        <main className=''>
            <input value={userData.login} onChange={loginEdit} placeholder="Логин"></input><br></br>
            <input value={userData.fullname} onChange={fullnameEdit} placeholder="Полное имя"></input><br></br>
            <input value={userData.email} onChange={emailEdit} placeholder="Электронная почта"></input><br></br><br></br>
            <input value={accountInfo.profileStatus} onChange={profileStatsEdit} placeholder="Статус"></input><br></br><br></br>
            <button onClick={save}>Сохранить</button>
        </main>
    );

    async function save() {
        let response = await fetch("http://localhost:3001/api/editUserData",{
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userLogin: userEditLogin,
                global: userData,
                other: accountInfo,
            })
        });
        
        if (response.ok) {
            let json = await response.json();
            if (json.payload.status === "OK") {
                navigate('/user/'+json.payload.data.newLogin, [navigate]);
            } else {
                alert(json.payload.data)
            }
            console.log(json);
            } else {
                alert("Ошибка HTTP: " + response.status);
        }
    }

    function loginEdit(e) {
        setUserData({
            ...userData,
            login: e.target.value
        })
    }

    function fullnameEdit(e) {
        setUserData({
            ...userData,
            fullname: e.target.value
        })
    }

    function emailEdit(e) {
        setUserData({
            ...userData,
            email: e.target.value
        })
    }

    function profileStatsEdit(e) {
        setAccountInfo({
            ...accountInfo,
            profileStatus: e.target.value
        })
    }

    function errorPage() {
        window.location.href = "/";
    }
}
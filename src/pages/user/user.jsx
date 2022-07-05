import { webInfo } from '../../info';
import './user.scss'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";

import LeftMenu from '../../components/global/leftMenu/leftMenu';
import LoaderBox from '../../components/global/loaderBox/loaderBox';

import { useHorizontalScroll } from "../../components/modules/useSideScroll/useSideScroll";

export default function User(props) {
    const { id } = useParams();

    const [userData, setUserData] = useState({});
    const [accountInfo, setAccountInfo] = useState({});
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();

    document.documentElement.style.setProperty("--cover", "url("+accountInfo.cover+")");   
    
    useEffect(() =>{
        const getData = async () => {
            let response = await fetch(webInfo.backendServer+"/api/getUserInfo?login="+id);

            if (response.ok) {
                let json = await response.json();
                if (json.payload.status === "OK") {
                    setUserData(json.payload.data);
                    setAccountInfo(json.payload.data.accountInfo);
                    setCategories(json.payload.data.categories);
                    setPosts(json.payload.data.posts);
                } else {
                    errorPage();
                }
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
        }
        getData();
    }, [id]);

    const scrollRef = useHorizontalScroll();

    return (
        <>
            <LoaderBox
                mode="hide"    
            />
            <main className='user__main'>
            <LeftMenu/>
            <div className='user__main__content'>
                <div className='user__content__account'>
                    <div className='user__account__fans'>
                        <p><b>0</b> читателей</p>
                        <p><b>0</b> лайков</p>
                    </div>
                    <div className='user__account__info'>
                        <img src={accountInfo.avatar} className="user__info__avatar"/>
                        <p className='user__info__fullname'>{userData.fullname}</p>
                        <p className='user__info__login'>{userData.login}</p>
                    </div>
                    <div className='user__account__stats'>
                        <p><b>0</b> читает</p>
                        <p><b>0</b> оценил</p>
                    </div>
                    {/* <p>Статус пользователя: {accountInfo.profileStatus}</p>
                    <p>Email: {userData.email}</p>
                    <p>Статус аккаунта: {userData.status}</p>
                    <a href='#' onClick={editProfile}>Редактировать данные аккаунта</a><br></br>
                    <a href='#' onClick={closeAllSessions}>Завершить все активные сессии</a><br></br>
                    <a href='#' onClick={deleteAccount}>Удалить аккаунт</a><br></br> */}
                </div>
                <div className='user__content__posts'>
                    <div ref={scrollRef} className='user__posts__category'>
                        <ul className="user__category__categories">
                            {categories.map(item => {
                                return <li key={item}>{item}</li>
                            })}
                        </ul>
                    </div>
                    {posts.map(item => {
                        return <p key={item}>{item}</p>
                    })}
                </div>
            </div>
            </main>
        </>
    );

    function errorPage() {
        window.location.href = "/";
    }

    function editProfile() {
        navigate('/editProfile', [navigate])
    }

    async function closeAllSessions() {
        const password = await prompt("Введите ваш пароль");

        let response = await fetch(webInfo.backendServer+"/api/closeAllSessions", {
            method: "post",
            headers: {
            Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: await userData.login,
                password: await password,
            }),
        });

        if (response.ok) {
            let json = await response.json();
            if (json.payload.status === "OK") {
                localStorage.setItem("SESSION_TOKEN", undefined);
                navigate('/', [navigate])
            } else {
                alert("Не удалось удалить все сессии")
                alert(json.payload.data)
            }
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }

    async function deleteAccount() {
        const password = await prompt("Введите ваш пароль");

        let response = await fetch(webInfo.backendServer+"/api/deleteAccount", {
            method: "post",
            headers: {
            Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: await userData.login,
                password: await password,
            }),
        });

        if (response.ok) {
            let json = await response.json();
            if (json.payload.status === "OK") {
                localStorage.setItem("SESSION_TOKEN", undefined);
                navigate('/', [navigate])
            } else {
                alert("Не удалось удалить аккаунт")
                alert(json.payload.data)
            }
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }
}
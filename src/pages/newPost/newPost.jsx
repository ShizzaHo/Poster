import { webInfo } from '../../info';
import './newPost.scss';
import {useNavigate} from 'react-router-dom';

import { useState, useEffect } from 'react';

import LoaderBox from '../../components/global/loaderBox/loaderBox';
import LeftMenu from '../../components/global/leftMenu/leftMenu';

export default function NewPost() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState();
    const [postTitle, setPostTitle] = useState("");
    const [postMessage, setPostMessage] = useState("");

    useEffect(() =>{
        const getData = async () => {
            let response = await fetch(webInfo.backendServer+"/api/getUserInfo?session="+localStorage.getItem("SESSION_TOKEN"));

            if (response.ok) {
                let json = await response.json();
                if (json.payload.status === "OK") {
                    setUserData(json.payload.data);
                    setCategories(json.payload.data.categories)
                    setSelectedCategory(json.payload.data.categories[0])
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
        <>
            <LoaderBox
                mode="hide"   
            />
            <main className='newPost__main'>
                <LeftMenu/>
                <div className='newPost__main__content'>
                    <div className='newPost__content__post'>
                    <select name="" id="" onChange={selectItem}>
                        <option disabled>Выберите категорию</option>
                        {categories.map(item => {
                            return <option value={item} key={item}>{item}</option>
                        })}
                    </select><br></br>
                    <input value={postTitle} onChange={(e)=>{setPostTitle(e.target.value)}} placeholder="Заголовок"></input><br></br>
                    <textarea value={postMessage} onChange={(e)=>{setPostMessage(e.target.value)}} placeholder="Текст"></textarea><br></br>
                    <button onClick={publish}>Опубликовать в категорию: {selectedCategory}</button>
                    </div>
                </div>
            </main>
        </>
    );

    function errorPage() {
        window.location.href = "/";
    }

    function selectItem(e){
        setSelectedCategory(e.target.value)
    }

    async function publish(){
        let response = await fetch(webInfo.backendServer+"/api/publishPost", {
            method: "post",
            headers: {
            Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: await userData.login,
                password: localStorage.getItem("PASSWORD"),
                title: postTitle,
                message: postMessage,
            }),
        });

        if (response.ok) {
            let json = await response.json();
            if (json.payload.status === "OK") {
                navigate('/user/'+userData.login, [navigate])
            } else {
                alert("Не удалось удалить все сессии")
                alert(json.payload.data)
            }
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }
}
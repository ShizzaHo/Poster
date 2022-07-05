import { webInfo } from '../../info';
import './newPost.scss';
import {useNavigate} from 'react-router-dom';

import { useState, useEffect } from 'react';

export default function NewPost() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState();
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
        <main>
            <select name="" id="" onChange={selectItem}>
                <option disabled>Выберите категорию</option>
                {categories.map(item => {
                    return <option value={item} key={item}>{item}</option>
                })}
            </select><br></br>
            <textarea value={postMessage} onChange={(e)=>{setPostMessage(e.target.value)}}></textarea><br></br>
            <button onClick={publish}>Опубликовать в категорию: {selectedCategory}</button>
        </main>
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
                password: await "1",
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
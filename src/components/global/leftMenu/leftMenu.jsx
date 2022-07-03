import './leftMenu.scss'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import userIcon from "../../../res/icons/user.svg";
import dashboardIcon from "../../../res/icons/dashboard.svg";
import notificationIcon from "../../../res/icons/notifications.svg";
import friendsIcon from "../../../res/icons/friends.svg";
import searchIcon from "../../../res/icons/search.svg";

import editIcon from "../../../res/icons/edit.svg";
import settingsIcon from "../../../res/icons/settings.svg";



export default function LeftMenu(props) {
    const navigate = useNavigate();

    return (
        <nav className='leftMenu__nav'>
            <ul className='leftMenu__buttons'>
                <li className='leftMenu__buttons__poster'>P</li>
                <li><img src={userIcon} alt="Личная страница"/></li>
                <li><img src={dashboardIcon} alt="Лента постов"/></li>
                <li><img src={notificationIcon} alt="Уведомления"/></li>
                <li><img src={friendsIcon} alt="Друзья"/></li>
                <li><img src={searchIcon} alt="Поиск"/></li>
            </ul>

            <ul className='leftMenu__buttons'>
                <li><img src={editIcon} alt="Новый пост"/></li>
                <li><img src={settingsIcon} alt="Настройки"/></li>
            </ul>
        </nav>
    );
}
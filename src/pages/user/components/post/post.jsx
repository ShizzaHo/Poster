import './post.scss';

import React from 'react'
import { useEffect, useState } from 'react';

import EditPost from "../../../../res/icons/edit2.svg";

export default function Post(props) {

    const [postData, setPostData] = useState(props.data[0]);

    return (
        <div className='post__box'>
            <div className='post__box__content'>
                <h1>{postData.title}</h1>
                <p>{postData.content}</p>
            </div>
            <div className='post__box__info'>
                <span className='post__info__text'>Дата публикации: <b>{postData.data}</b> | Прочитано <b>{postData.readings}</b> раз</span>
                <div className="post__info__buttonList">
                    {props.editButton ? <button className='post__buttonList__button post__iconButton'> </button> : <></>}
                    <button className='post__buttonList__button post__likeButton'>{postData.likes}</button>
                    <button className='post__buttonList__button'>Читать</button>
                </div>
            </div>
        </div>
    )
}

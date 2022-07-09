import './categoryManager.scss'
import React from 'react'

export default function categoryManager(props) {
  return (
    <div className='categoryManager__background'>
        <div className='categoryManager__background__page'>
            <div className='categoryManager__page__topPanel'>
                <button onClick={props.onCategoryClose}>Закрыть</button>
            </div>
            <div className='categoryManager__page__content'>
                В разработке...
            </div>
        </div>
    </div>
  )
}

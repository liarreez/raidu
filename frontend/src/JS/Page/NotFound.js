import React from 'react';
import { useNavigate } from "react-router-dom";

import image from '../../Imgs/turtleneck.png'
import '../../CSS/NotFound.css'

import FadeAnime from '../Component/FadeAnime'

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <FadeAnime>
                    <div className='notfound-wrapper'>
            <img className='notfound-image' src={image} alt='404이미지'></img>
            <div className='notfound-title'>준비되지 않은 페이지입니다!</div>
            <div className='notfound-desc'>길을 잘못드셨네요...</div>
            <button className='notfound-button' onClick={() => navigate(-1)}>뒤로 가기</button>
        </div>
        </FadeAnime>

    );
};

export default NotFound;
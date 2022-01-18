import React from 'react';
import {Link} from 'react-router-dom';
import './not.found.css';

const NotFound = () => (
    <div>
        <p className="not-found"> Страница не найдена </p>

        <div className="tipsiz">
            <div className="tipsiz-body">
                <div className="left-arm arm"/>
                <div className="face">
                    <div className="upper-face">
                        <div className="element">4</div>
                        <div className="element">0</div>
                        <div className="element">4</div>
                    </div>
                    <div className="mouth"/>
                </div>
                <div className="right-arm arm"/>
            </div>
        </div>

        <p>Возможно вам стоит перейти <Link to="/">домой</Link></p>

    </div>
);

export default NotFound;
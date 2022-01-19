import React from 'react';
import './not.found.css';

const InfoComponent = () => (
    <div>
        <p className="not-found"> Тут появится описание, но пока что его нет </p>

        <div className="tipsiz">
            <div className="tipsiz-body">
                <div className="left-arm arm"/>
                <div className="face">
                    <div className="upper-face">
                        <div className="element">2</div>
                        <div className="element">0</div>
                        <div className="element">4</div>
                    </div>
                    <div className="mouth"/>
                </div>
                <div className="right-arm arm"/>
            </div>
        </div>

        <p>Но вы не грустите</p>

    </div>
);

export default InfoComponent;
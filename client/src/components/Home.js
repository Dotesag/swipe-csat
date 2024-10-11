import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SwipeProducts from './SwipeProducts';

const Home = () => {

    return (
        <div className="container mt-5">
            {/* Отображение опросов в виде плиток */}
            <div className="row">
                <h1>Swipe Products</h1>
                <SwipeProducts />
            </div>
        </div>
    );
};

export default Home;

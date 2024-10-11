import React from 'react';
import Sidebar from './Sidebar';
import { Container } from 'react-bootstrap';

const Panel = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <Container className="p-4">
                <h1>Добро пожаловать в панель управления</h1>
                {/* Здесь будет ваша информация, которую вы хотите отображать */}
            </Container>
        </div>
    );
};

export default Panel;

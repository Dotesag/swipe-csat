import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';

const SurveyStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { surveyId } = useParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/surveys/${surveyId}/stats`);
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching survey stats:', err);
                setError(err);
                setLoading(false);
            }
        };

        if (surveyId) {
            fetchStats();
        } else {
            setLoading(false);
        }
    }, [surveyId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-4">
                <Spinner animation="border" />
                <span className="ms-2">Загрузка...</span>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">Ошибка при загрузке статистики характеристики: {error.message}</div>;
    }

    if (!stats) {
        return <div className="alert alert-warning">Статистика недоступна.</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Статистика характеристики: {stats.title}</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <Container className="flex-grow-1 p-3">
                    <Row>
                        {stats.questionStats.map((qs, index) => (
                            <Col key={index} md={6} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{qs.questionText}</Card.Title>
                                        <Card.Text>Количество ответов на вопрос: {qs.answersCount}</Card.Text>
                                        <Card.Text>Средний балл: {qs.averageScore.toFixed(2)}</Card.Text>
                                        <Card.Text>Ответы по вариантам:</Card.Text>
                                        <table className="table table-striped mt-2">
                                            <thead>
                                                <tr>
                                                    <th>Вариант ответа</th>
                                                    <th>Количество ответов</th>
                                                    <th>Баллы за ответ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(qs.answerCounts).map(([text, { count, value }]) => (
                                                    <tr key={text}>
                                                        <td>{text}</td>
                                                        <td>{count} {count === 1 ? "ответ" : "ответа"}</td>
                                                        <td>{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default SurveyStats;

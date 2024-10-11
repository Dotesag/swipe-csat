import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import SurveyList from './components/SurveyList';
import CreateSurvey from './components/CreateSurvey';
import EditSurvey from './components/EditSurvey';
import QuestionList from './components/QuestionList';
import CreateQuestion from './components/CreateQuestion';
import EditQuestion from './components/EditQuestion';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth'; // Импортируйте компонент RequireAuth
import NotAuthorized from './components/NotAuthorized'; // Импортируйте компонент NotAuthorized
import Profile from './components/Profile'; // Импортируйте компонент NotAuthorized
import SurveyPage from './components/SurveyPage'; // Импортируй новый компонент
import ResponsesPage from './components/ResponsesPage'; // Импортируй новый компонент
import CreateProduct from './components/CreateProduct'; // Импортируй новый компонент
import ProductPage from './components/ProductPage'; // Импортируй новый компонент
import MyProducts from './components/MyProducts'; // Импортируй новый компонент
import EditProduct from './components/EditProduct';
import ProductDetail from './components/ProductDetail';
import SurveysProducts from './components/SurveysProducts'; 
import UsersList from './components/UsersList';
import UserForm from './components/UserForm';
import Settings from './components/settings'
import SurveyStats from './components/SurveyStats';
import History from './components/ResponsesHistory';


function App() {
    const isAuthenticated = !!localStorage.getItem('token'); // Проверяем, авторизован ли пользователь

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Удаляем токен
        window.location.reload(); // Перезагружаем страницу
    };
    return (
        <Router>
            <div>
                <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/survey/:id" element={<SurveyPage/>} />
                    <Route path="/surveys/product/:productId" element={
                        <RequireAuth>
                            <SurveysProducts />
                        </RequireAuth>
                    } />

                    <Route path="/" element={<Home />} />
                    <Route path="/responses" element={
                        <RequireAuth>
                            <ResponsesPage />
                        </RequireAuth>
                        } />

                    {/* авторизация и регистрация */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* опросы */}
                    <Route path="/survey/:id" element={<SurveyPage/>} />
                    <Route path="/settings" element={
                        <RequireAuth>
                            <Settings />
                        </RequireAuth>
                        } />

                    <Route path="/history" element={
                        <RequireAuth>
                            <History />
                        </RequireAuth>
                        } />

                    <Route path="/survey" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <SurveyList />
                        </RequireAuth>
                    } />
                    <Route path="/add-survey" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <CreateSurvey />
                        </RequireAuth>
                    } />
                    <Route path="/edit-survey/:id" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <EditSurvey />
                        </RequireAuth>
                    } />
                    <Route path="/surveys/:id/questions" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <QuestionList />
                        </RequireAuth>
                    } />

                    <Route path="/surveys/:surveyId/stats" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <SurveyStats />
                        </RequireAuth>
                    } />
                    <Route path="/surveys/:id/add-question" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <CreateQuestion />
                        </RequireAuth>
                    } />
                    <Route path="/surveys/:id/edit-question/:questionId" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <EditQuestion />
                        </RequireAuth>
                    } />
                    <Route path="/surveys/product/:productId" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <SurveysProducts />
                        </RequireAuth>
                    } />

                    {/* панель управления */}
                    <Route path="/profile" element={
                        <RequireAuth>
                            <Profile />
                        </RequireAuth>
                    } />
                    
                    {/* Ответы опросов */}
                    <Route path="/responses" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <ResponsesPage />
                        </RequireAuth>
                        } />
                    {/* Продукты */}
                    <Route path="/my-products" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <MyProducts />
                        </RequireAuth>
                    } />
                    <Route path="/create-product" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <CreateProduct/>
                        </RequireAuth>
                    } />
                    <Route path="/products/detail/:id" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <ProductDetail/>
                        </RequireAuth>
                    } />
                    <Route path="/products/:id" element={<ProductPage/>} />
                    <Route path="/edit-product/:id" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                                <EditProduct />
                        </RequireAuth>
                    } />                    
                    
                    {/* Пользователи */}
                    <Route path="/" element={<Home />} />
                    <Route path="/users" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <UsersList />
                        </RequireAuth>
                        } />
                    <Route path="/users/new" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <UserForm />
                        </RequireAuth>
                        } />
                    <Route path="/users/:id/edit" element={
                        <RequireAuth allowedRoles={['admin', 'productOwner']}>
                            <UserForm />
                        </RequireAuth>
                        } />                    
                        
                    {/* 404 */}
                    <Route path="*" element={<NotAuthorized />} /> {/* Заглушка для несуществующих маршрутов */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Убедитесь, что Bootstrap подключен

const ChatGptDialog = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); // Состояние для управления видимостью чата
  const [loading, setLoading] = useState(false); // Состояние загрузки

  const sendMessage = async () => {
    if (!input.trim()) return; // Игнорируем пустое сообщение

    // Добавляем сообщение пользователя в чат
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setLoading(true); // Устанавливаем состояние загрузки в true

    try {
      // Отправляем запрос на сервер
      const response = await fetch('http://localhost:5000/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      // Логируем ответ сервера
      const responseText = await response.text();
      console.log('Response from server:', responseText); // Выводим текст ответа в консоль

      // Пробуем парсить ответ как JSON
      const data = JSON.parse(responseText); // Изменено с await response.json()

      // Добавляем ответ ChatGPT в чат
      setMessages([...newMessages, { role: 'bot', content: data.message }]);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    } finally {
      setInput(''); // Очищаем поле ввода
      setLoading(false); // Сбрасываем состояние загрузки
    }
  };

  // Функция для переключения видимости чата
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Кнопка для открытия/закрытия чата */}
      <button
        onClick={toggleChat}
        className="btn btn-light rounded-circle shadow"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          cursor: 'pointer',
        }}
        id='chatgpt'
      >
        {/* SVG логотип ChatGPT */}
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
          <path d="M21 11.5V21l-4-2h-7a9 9 0 1 1 0-18 9.01 9.01 0 0 1 8.5 5.25" />
        </svg>
      </button>

      {/* Окно чата */}
      {isChatOpen && (
        <div className="card position-fixed" style={{ bottom: '70px', right: '20px', width: '350px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease-in-out' }}>
          <div className="card-body" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Инструкция для пользователя */}
            <div className="mb-3 text-center">
              <small>Используйте этот чат, чтобы создать вопрос или варианты ответов.</small>
            </div>
            <div className="chat-window" style={{ height: '300px', overflowY: 'scroll', marginBottom: '10px', padding: '10px', borderRadius: '10px', backgroundColor: '#fff' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 p-2 rounded ${msg.role === 'user' ? 'bg-primary text-white text-end' : 'bg-light text-dark text-start'}`} style={{ animation: 'fadeIn 0.5s' }}>
                  <strong>{msg.role === 'user' ? 'Вы' : 'ChatGPT'}:</strong>
                  <p className="mb-0">{msg.content}</p>
                </div>
              ))}
              {loading && (
                <div className="text-center mb-2">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите сообщение"
                style={{ borderRadius: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} // Упрощение стилизации
              />
              <button className="btn btn-success" onClick={sendMessage} style={{ borderRadius: '15px' }}>Отправить</button>
            </div>
          </div>
        </div>
      )}

      {/* Стили для анимации */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatGptDialog;

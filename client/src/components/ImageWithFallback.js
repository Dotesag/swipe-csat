import React from 'react';

const ImageWithFallback = ({ src, alt, fallbackSrc, ...props }) => {
    const handleError = (e) => {
        e.target.onerror = null; // Убираем обработчик ошибки
        e.target.src = fallbackSrc; // Устанавливаем заглушку
    };

    return (
        <img 
            src={src} 
            alt={alt} 
            onError={handleError} 
            {...props}
        />
    );
};

export default ImageWithFallback;

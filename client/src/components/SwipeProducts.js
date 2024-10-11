import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from './api';
import ImageWithFallback from './ImageWithFallback';
import './SwipeProducts.css';

const SwipeProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [endMessage, setEndMessage] = useState(false);
  const [isDragging, setIsDragging] = useState(false); 
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 }); 
  const [currentTranslate, setCurrentTranslate] = useState({ x: 0, y: 0 }); 
  const productCardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();

    const hintTimeout = setTimeout(() => {
      setShowHint(false);
    }, 2000);

    return () => clearTimeout(hintTimeout);
  }, []);

  // Функция для скрытия подсказки при клике
  const handleHintClick = () => {
    setShowHint(false);
  };

  // Начало перетаскивания
  const handleMouseDown = (e) => {
    e.preventDefault(); 
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  // Перетаскивание
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    e.preventDefault();
    const deltaX = e.clientX - dragStartPos.x;
    const deltaY = e.clientY - dragStartPos.y;
    setCurrentTranslate({ x: deltaX, y: deltaY });
  };

  // Окончание перетаскивания
  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const deltaX = currentTranslate.x;

    if (deltaX > 100) {
      handleSwipeRight();
    } else if (deltaX < -100) {
      handleSwipeLeft();
    }

    setCurrentTranslate({ x: 0, y: 0 });
  };

  // Свайп влево
  const handleSwipeLeft = () => {
    if (products.length > 0 && currentIndex < products.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setEndMessage(true);
    }
  };

  // Свайп вправо
  const handleSwipeRight = () => {
    const product = products[currentIndex];
    navigate(`/products/${product._id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handleSwipeLeft();
      } else if (event.key === 'ArrowRight') {
        handleSwipeRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, products]);

  if (products.length === 0) return <p>Loading...</p>;

  if (endMessage) {
    return (
      <div className="swipe-container">
        <h2>Товары для оценки закончились!</h2>
        <button className="btn btn-primary" onClick={() => setEndMessage(false)}>
          Вернуться к началу
        </button>
      </div>
    );
  }

  return (
    <div
      className="swipe-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {showHint && (
        <div className="swipe-hint-container" onClick={handleHintClick}> {/* Добавлен обработчик клика */}
          <div className="swipe-hint">
            <p>Свайпните влево, чтобы пропустить, или вправо для оценки!</p>
            <div className="animated-arrows">
              <span className="arrow-left">&larr;</span>
              <span className="arrow-right">&rarr;</span>
            </div>
          </div>
        </div>
      )}

      <button className="arrow-btn arrow-left" onClick={handleSwipeLeft}>
        &larr;
      </button>

      <div
        ref={productCardRef}
        className="product-card"
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${currentTranslate.x}px, ${currentTranslate.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
        }}
      >
        <ImageWithFallback
          src={`http://localhost:5000/${products[currentIndex].image}`}
          alt={products[currentIndex].name}
          fallbackSrc="/placeholder-image.jpg"
          className="product-image"
        />
        <h2>{products[currentIndex].name}</h2>
        <p>{products[currentIndex].description}</p>
        <button className="btn btn-primary" onClick={handleSwipeRight}>
          Оценить товар
        </button>
      </div>

      <button className="arrow-btn arrow-right" onClick={handleSwipeRight}>
        &rarr;
      </button>

      <div className="progress-indicator">
        {currentIndex + 1} / {products.length}
      </div>
    </div>
  );
};

export default SwipeProducts;

import React from 'react';

const StarRating = ({ rating, onRate }) => {
    return (
        <div className="star-rating">
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                return (
                    <span
                        key={starValue}
                        className={`star ${starValue <= rating ? 'filled' : ''}`}
                        onClick={() => onRate(starValue)} // Вызываем onRate при клике
                        style={{
                            cursor: 'pointer',
                            fontSize: '2rem',
                            color: starValue <= rating ? 'gold' : 'gray',
                        }}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;

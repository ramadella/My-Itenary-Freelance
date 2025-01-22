import React from 'react';

const RecommendationCard = ({ category, title, recommendations, onNextRecommendation }) => {
    const recommendation = recommendations?.[category]?.main;
    if (!recommendation) return null;
  
    const renderStars = (rating) => {
      if (!rating) return null;
      return (
        <div className="stars">
          {[...Array(5)].map((_, index) => (
            <span key={index} className={`icon is-small ${index < Math.floor(rating) ? 'has-text-warning' : 'has-text-grey-lighter'}`}>
              <i className="fas fa-star"></i>
            </span>
          ))}
        </div>
      );
    };
  
    return (
      <div className="column is-6">
        <div className="box" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h4 className="title is-5 mb-3">{title}</h4>
          <div className="columns" style={{ flexGrow: 1 }}>
            <div className="column is-5">
              <figure className="image is-4by3">
                <img src={recommendation.image || '/api/placeholder/150/100'} alt={recommendation.name || 'Rekomendasi'} style={{ objectFit: 'cover' }} />
              </figure>
            </div>
            <div className="column is-7">
              <h5 className="title is-6">{recommendation.name || `${title} tidak tersedia`}</h5>
              <p className="is-size-7 has-text-grey mb-2">{recommendation.description || 'Deskripsi tidak tersedia'}</p>
              {renderStars(recommendation.rating)}
              <p className="is-size-7 has-text-grey mt-2">
                {recommendation.estimasi_biaya && recommendation.estimasi_biaya !== "Harga tidak tersedia" 
                  ? recommendation.estimasi_biaya
                  : <span className="has-text-danger">Harga tidak tersedia</span>}
              </p>
            </div>
          </div>
          <div className="buttons mt-3">
            {recommendation.booking && (
              <a href={recommendation.booking} target="_blank" rel="noopener noreferrer" className="button is-info is-small">
                Booking
              </a>
            )}
            <button className="button is-primary is-small" onClick={() => onNextRecommendation(category)}>
              Rekomendasi lainnya
            </button>
          </div>
        </div>
      </div>
    );
  };

export default RecommendationCard;
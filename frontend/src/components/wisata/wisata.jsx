import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'bulma/css/bulma.css';
import L from 'leaflet';

// Define a default icon for the marker
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const Wisata = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [location, setLocation] = useState('');
  const [mapCenter, setMapCenter] = useState([-2.5, 118]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [zoom, setZoom] = useState(5);
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    setCurrentDate(formattedDate);
  }, []);

  const handleSearch = async () => {
    if (!location) return;

    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(location)}`);
      const data = await response.json();

      if (data.length > 0) {
        setAttractions(data);
        const firstAttraction = data[0];
        const newCenter = [firstAttraction.latitude_wisata, firstAttraction.longitude_wisata];
        if (newCenter[0] !== undefined && newCenter[1] !== undefined) {
          setMapCenter(newCenter);
          setMarkerPosition(newCenter);
          setZoom(10);
        }
        setLocation('');
      } else {
        alert('Lokasi tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Terjadi kesalahan saat mencari lokasi');
    }
  };

  const handleAttractionClick = async (attraction) => {
    setSelectedAttraction(attraction);
    const newCenter = [attraction.latitude_wisata, attraction.longitude_wisata];
    if (newCenter[0] !== undefined && newCenter[1] !== undefined) {
      setMapCenter(newCenter);
      setMarkerPosition(newCenter);
      setZoom(15);
    }

    const categories = ['hotel', 'penerbangan', 'Fotographer', 'guide', 'kendaraan', 'oleh-oleh'];
    const newRecommendations = {};

    for (const category of categories) {
      try {
        const response = await fetch(`http://localhost:5000/api/recommendations/${attraction.id}/${category}`);
        const data = await response.json();
        newRecommendations[category] = data;
      } catch (error) {
        console.error(`Error fetching ${category} recommendations:`, error);
      }
    }

    setRecommendations(newRecommendations);
  };

  const handleNextRecommendation = (category) => {
    if (recommendations[category]) {
      const currentRecommendations = [
        recommendations[category].main,
        ...recommendations[category].recommendations
      ];
      const updatedRecommendations = {
        main: currentRecommendations[1],
        recommendations: [
          ...currentRecommendations.slice(2),
          currentRecommendations[0]
        ]
      };
      setRecommendations({ ...recommendations, [category]: updatedRecommendations });
    }
  };

  const renderStars = (rating) => {
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

  const RecommendationCard = ({ category, title }) => {
    const recommendation = recommendations[category]?.main;
    if (!recommendation) return null;

    return (
      <div className="column is-6">
        <div className="box" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h4 className="title is-5 mb-3">{title}</h4>
          <div className="columns" style={{ flexGrow: 1 }}>
            <div className="column is-5">
              <figure className="image is-4by3">
                <img src={recommendation.image || '/api/placeholder/150/100'} alt={recommendation.name} style={{ objectFit: 'cover' }} />
              </figure>
            </div>
            <div className="column is-7">
              <h5 className="title is-6">{recommendation.name || 'Nama tidak tersedia'}</h5>
              <p className="is-size-7 has-text-grey mb-2">{recommendation.description || 'Deskripsi tidak tersedia'}</p>
              {renderStars(recommendation.rating)}
              <p className="is-size-7 has-text-grey mt-2">{recommendation.estimasi_biaya || 'Harga tidak tersedia'}</p>
            </div>
          </div>
          <div className="buttons mt-3">
            {recommendation.booking && (
              <a href={recommendation.booking} target="_blank" rel="noopener noreferrer" className="button is-info is-small">
                Booking
              </a>
            )}
            <button className="button is-primary is-small" onClick={() => handleNextRecommendation(category)}>
              Rekomendasi lainnya
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container">
      <h2 className="title is-4 has-text-weight-bold has-text-dark has-text-centered mb-5">Maps</h2>

      <div className="field has-addons is-justify-content-center mb-5">
        <div className="control" style={{ width: '40%' }}>
          <input
            className="input"
            type="text"
            placeholder="Masukkan nama kota atau negara"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="control">
          <button className="button is-info" onClick={handleSearch}>
            Cari
          </button>
        </div>
      </div>

      <div className="box has-background-white p-5 mb-5">
        <div className="has-background-light is-flex is-justify-content-center is-align-items-center" style={{ height: '400px', borderRadius: '10px' }}>
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: "100%", width: "100%", borderRadius: '10px' }}
          >
            <ChangeView center={mapCenter} zoom={zoom} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markerPosition && markerPosition[0] !== undefined && markerPosition[1] !== undefined && (
              <Marker position={markerPosition}>
                <Popup>{selectedAttraction?.tempat_wisata || location}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      <div className="has-text-centered mb-5">
        <button className="button is-info" style={{ borderRadius: '10px' }}>
          {currentDate}
        </button>
      </div>

      {attractions.length > 0 && (
        <div className="box mb-5">
          <h3 className="title is-5 mb-3">Daftar Wisata</h3>
          <div className="columns is-multiline">
            {attractions.map((attraction) => (
              <div key={attraction.id} className="column is-4">
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={attraction.url_image_wisata} alt={attraction.tempat_wisata} style={{ objectFit: 'cover' }} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <p className="title is-6">{attraction.tempat_wisata}</p>
                    <p className="subtitle is-7">{attraction.lokasi}</p>
                    {renderStars(attraction.rating_wisata)}
                    <button className="button is-primary is-small mt-2" onClick={() => handleAttractionClick(attraction)}>
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

{selectedAttraction && (
        <div className="columns is-multiline" style={{ marginBottom: '2rem', textAlign: 'justify' }}>
          <RecommendationCard 
            category="hotel" 
            title="Rekomendasi Hotel" 
            recommendations={recommendations}
            onNextRecommendation={handleNextRecommendation}
          />
          <RecommendationCard 
            category="penerbangan" 
            title="Rekomendasi Pesawat" 
            recommendations={recommendations}
            onNextRecommendation={handleNextRecommendation}
          />
          <RecommendationCard 
            category="Fotographer" 
            title="Rekomendasi Fotographer" 
            recommendations={recommendations}
            onNextRecommendation={handleNextRecommendation}
          />
          <RecommendationCard 
            category="guide" 
            title="Rekomendasi Tour Guide" 
            recommendations={recommendations}
            onNextRecommendation={handleNextRecommendation}
          />
          <RecommendationCard 
            category="kendaraan" 
            title="Rekomendasi Rental Kendaraan" 
            recommendations={recommendations}
            onNextRecommendation={handleNextRecommendation}
          />
          <RecommendationCard 
            category="oleh-oleh" 
            title="Rekomendasi Oleh Oleh" 
            recommendations={recommendations}
            onNextRecommendation={handleNextRecommendation}
          />
        </div>
      )}
    </div>
  );
};

export default Wisata;
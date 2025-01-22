// Dashboard.js
import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import { FaBars, FaTimes, FaMap, FaHotel, FaBook } from 'react-icons/fa'; // Import icons
import Wisata from './wisata/wisata'; // Import Wisata component


const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('Akomodasi');
    const [showDescription, setShowDescription] = useState(false);
    const [showWisata, setShowWisata] = useState(false); // State to control Wisata visibility

    const customStyles = {
        logoText: {
            fontSize: '24px',
            fontWeight: 'bold',
            position: 'relative',
        },
        my: {
            color: 'orange',
            fontSize: '24px',
            position: 'relative',
            zIndex: 1,
        },
        itinerary: {
            color: '#0088cc',
            fontSize: '30px',
            position: 'relative',
            zIndex: 1,
            top: '-20px',
            marginLeft: '-12px',
        },
        line: {
            width: '82%',
            height: '2px',
            backgroundColor: '#f3b726',
            position: 'absolute',
            top: '-0.2rem',
            left: '30px',
            zIndex: 0,
        },
        secondline: {
            width: '88.5%',
            height: '2px',
            backgroundColor: '#f3b726',
            position: 'absolute',
            top: '-1.8rem',
            left: '-10px',
            zIndex: 0,
        },
        subtitle: {
            fontSize: '30px',
            marginBottom: '20px',
            fontWeight: '600',
        },
        buttonStyle: {
            margin: '0 5px 10px',
            transition: 'background-color 0.3s, color 0.3s',
            color: '#0088cc',
            borderRadius: '5px',
            padding: '10px 20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        activeButton: {
            backgroundColor: '#0088cc',
            color: 'white',
        },
        iconContainer: {
            fontSize: '30px',
            position: 'relative',
            cursor: 'pointer',
            marginLeft: '20px',
        },
        description: {
            position: 'absolute',
            top: '50px',
            right: '0',
            zIndex: 1,
            width: '300px',
            transition: 'transform 0.3s ease-in-out',
            padding: '15px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            borderRadius: '5px',
        },
        card: {
            margin: '20px 0',
            padding: '20px',
            border: '1px solid #e3e3e3',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9', // Soft background for cards
        },
        section: {
            padding: '20px',
            backgroundColor: '#f0f0f0', // Section background color
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
    };

    const handleTabClick = (event, tab) => {
        event.preventDefault();
        setActiveTab(tab);
        if (tab === 'Akomodasi') {
            setShowWisata(true);
        } else {
            setShowWisata(false);
        }
    };

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    return (
        <div className="container">
            <header className="navbar is-white px-3 py-3">
                <div style={customStyles.logoText}>
                    <span style={customStyles.my}>My.</span>
                    <div style={{ position: 'relative', height: '2px', width: '100%' }}>
                        <span style={customStyles.line}></span>
                    </div>
                    <div>
                        <span style={customStyles.itinerary}>Itinerary</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div style={customStyles.secondline}></div>
                    </div>
                </div>
                <div className="navbar-end">
                    <div style={customStyles.iconContainer} onClick={toggleDescription}>
                        {showDescription ? <FaTimes /> : <FaBars />}
                    </div>
                    {showDescription && (
                        <div className="notification is-light" style={customStyles.description}>
                            <h2 className="title is-5 has-text-link">Description</h2>
                            <p className="has-text-dark" style={{ textAlign: 'justify' }}>
                                This website provides an organized itinerary for your travel plans, offering insights into accommodations, references, and an overall guide for your journey.
                            </p>
                        </div>
                    )}
                </div>
            </header>

            <section className="section" style={customStyles.section}>
                <h1 className="title has-text-warning">Itinerary</h1>
                <p className="subtitle has-text-grey" style={customStyles.subtitle}>Overview</p>

                <div className="buttons is-centered">
                    <button
                        className={`button ${activeTab === 'Itinerary' ? 'is-primary' : 'is-light'}`}
                        style={{ ...customStyles.buttonStyle, ...(activeTab === 'Itinerary' ? customStyles.activeButton : {}) }}
                        onClick={(e) => handleTabClick(e, 'Itinerary')}
                    >
                        <FaMap style={{ marginRight: '5px' }} />
                        Itinerary
                    </button>
                    <button
                        className={`button ${activeTab === 'Akomodasi' ? 'is-primary' : 'is-light'}`}
                        style={{ ...customStyles.buttonStyle, ...(activeTab === 'Akomodasi' ? customStyles.activeButton : {}) }}
                        onClick={(e) => handleTabClick(e, 'Akomodasi')}
                    >
                        <FaHotel style={{ marginRight: '5px' }} />
                        Akomodasi
                    </button>
                    <button
                        className={`button ${activeTab === 'Referensi' ? 'is-primary' : 'is-light'}`}
                        style={{ ...customStyles.buttonStyle, ...(activeTab === 'Referensi' ? customStyles.activeButton : {}) }}
                        onClick={(e) => handleTabClick(e, 'Referensi')}
                    >
                        <FaBook style={{ marginRight: '5px' }} />
                        Referensi
                    </button>
                </div>

                <div style={customStyles.card}>
                    {showWisata && <Wisata />}
                    
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import '../App.css'; 
import '../HomePage.css';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        const isAuthenticated = !!localStorage.getItem('username');
        
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="home-container">
            <Layout/>
            <h1 className="home-heading">Welcome to the Home Page</h1>
            <div className="home-content">
                <h3>About DEALSDRAY ONLINE PVT. LTD.</h3>
                <p>
                    DEALSDRAY ONLINE PVT. LTD. is a leading online marketplace that specializes in delivering a wide range of high-quality products and services. Our mission is to provide customers with an exceptional shopping experience, combining convenience, quality, and value.
                </p>
                <p>
                    We are committed to innovation and excellence, ensuring that our customers have access to the latest products and services from the comfort of their homes. With a user-friendly platform and a dedicated team, we strive to exceed customer expectations and build long-lasting relationships.
                </p>
                <p>
                    Our team consists of experienced professionals who are passionate about what they do and dedicated to ensuring that every customer interaction is positive and satisfying. We believe in continuous improvement and are always looking for new ways to enhance our offerings and serve our customers better.
                </p>
                <p>
                    At DEALSDRAY ONLINE PVT. LTD., customer satisfaction is our top priority. We are here to provide support and assistance to ensure that your experience with us is seamless and enjoyable. Thank you for choosing us as your preferred online shopping destination.
                </p>
            </div>
        </div>
    );
}

export default Home;

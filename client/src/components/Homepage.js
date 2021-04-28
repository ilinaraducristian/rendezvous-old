import {useHistory} from 'react-router-dom';

function Homepage() {

    let history = useHistory();

    return (
        <div className="homepage-container">
            <h5 className="logo">CAPP LOGO PLACEHOLDER</h5>

            <button className="open-app-button" onClick={() => history.push("/chat")}>Open CAPP</button>
            <button className="login-button">Login</button>
            <div className="homepage-description">
                <h1>Welcome to CAPP</h1>
            </div>
        </div>
    );

}

export default Homepage;

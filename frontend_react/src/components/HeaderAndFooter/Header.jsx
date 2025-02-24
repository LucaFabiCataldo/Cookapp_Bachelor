//CSS
import './Header.css'
import appLogo from './AppLogo.png';  // Bild importieren

function Header() {
    return (
        <div id="appHeader">
            <div id='appHeaderLogo'>
                <img src={appLogo} alt="App Logo" />
            </div>
            <div id='appHeaderNav'>
                <p>Explore</p>
                <p>Mein Kochbuch</p>
                <button className='appHeaderButton' id='appHeaderButtonLog' onClick={() => {alert("Die Funktion Anmelden ist im Prototypen nicht verfügbar")}}>Anmelden</button>
                <button className='appHeaderButton' id='appHeaderButtonReg' onClick={() => {alert("Die Funktion Registrieren ist im Prototypen nicht verfügbar")}}>Registrieren</button>
            </div>
        </div>
    )
  }
  
export default Header;
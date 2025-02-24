//CSS
import './Footer.css'
import appLogo from './AppLogo.png';  // Bild importieren
import social1 from './SocialIcons-02.svg';  // Bild importieren
import social2 from './SocialIcons-03.svg';  // Bild importieren
import social3 from './SocialIcons-04.svg';  // Bild importieren

function Footer() {
    return (
        <div id="appFooter">
            <div id='appFooterLogo'>
                <img src={appLogo} alt="App Logo" />
            </div>
            <div id='footerBlocks'>
                <div className='footerBlockInner' id='appFooterBlockLinks'>
                    <p>About</p>
                    <p>Team</p>
                    <p>Jobs</p>
                </div>
                <div className='blockTrenner'></div>
                <div className='footerBlockInner' id='appFooterBlockMitte'>
                    <p>FAQs</p>
                    <p>Kontakt</p>
                    <div id='socials'>
                        <p>Folge uns:</p>
                        <div id='socialImages'>
                            <img src={social1} alt="App Logo" />
                            <img src={social2} alt="App Logo" />
                            <img src={social3} alt="App Logo" />
                        </div>
                    </div>
                </div>
                <div className='blockTrenner'></div>
                <div className='footerBlockInner' id='appFooterBlockRechts'>
                    <p>AGBs</p>
                    <p>Datenschutz</p>
                    <p>Impressum</p>
                </div>
            </div>
        </div>
    )
  }
  
export default Footer;
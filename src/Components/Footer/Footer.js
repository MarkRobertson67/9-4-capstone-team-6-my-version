import './Footer.css'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
//import logo from '../Assets

function Footer() {
  let loc = useLocation();

  return (
    <div className="Footer" style={loc.pathname === "/" ? { display: "none" } : { display: "block" }}>
      <div className='footerText'>
        <p className='footerContact'><Link to='/contact'>Contact Us</Link></p>&nbsp;
        {/* <img className='footerImg'
          // src={logo}
          alt="Logo" /> */}
          &nbsp;
        <p className='footerAbout'><Link to='/about'>About Us</Link></p>
      </div>
    </div>
  )
}

export default Footer;

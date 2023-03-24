import { useState, useEffect } from "react";
import { Navbar, Nav, Container} from "react-bootstrap";
import { useLocation } from 'react-router-dom';


const NavBar = () => {
    const [activeLink, setActiveLink] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation().pathname;
    useEffect(() => {
      console.log(location.substring(1))
      setActiveLink(location.substring(1));
      const onScroll = () => {
          if (window.scrollY > 50) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
        }
    
        window.addEventListener("scroll", onScroll);
    
        return () => window.removeEventListener("scroll", onScroll);
      }, [])
    const onUpdateActiveLink = (value) => {
        setActiveLink(value);
     }
    return (
        <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/" className={activeLink === 'Home' ? 'active navbar-link' : 'navbar-link'} 
                    onClick={() => onUpdateActiveLink('Home')}>Home</Nav.Link>
                    <Nav.Link href="Practice" className={activeLink === 'Practice' ? 'active navbar-link' : 'navbar-link'} 
                    onClick={() => onUpdateActiveLink('Practice')}>Mock Interview</Nav.Link>
                    <Nav.Link href="/Media" className={activeLink === 'Media' ? 'active navbar-link' : 'navbar-link'} 
                    onClick={() => onUpdateActiveLink('Media')}>Media Gallery</Nav.Link>
                    <Nav.Link href="/Submit_Applications" className={activeLink === 'Submit_Applications' ? 'active navbar-link' : 'navbar-link'} 
                    onClick={() => onUpdateActiveLink('Submit_Applications')}>Submit Appliction</Nav.Link>
                    <Nav.Link href="/Applications" className={activeLink === 'Applications' ? 'active navbar-link' : 'navbar-link'} 
                    onClick={() => onUpdateActiveLink('Applications')}>Applictions</Nav.Link>
                </Nav>
                    
                </Navbar.Collapse>
            </Container>
    </Navbar>
    )

}
export default NavBar
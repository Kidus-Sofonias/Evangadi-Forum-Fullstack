import React, { useContext } from "react";
import logo from "../../Images/evangadi-logo-header.png";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userProvider } from "../../Context/UserProvider";

function Header() {
  const [user, setUser] = useContext(userProvider);
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/signin");
  };

  const handleButtonClick = () => {
    if (user?.user_name) {
      logOut();
    } else {
      navigate("/UserAccessPage");
    }
  };

  return (
    <Navbar expand="lg" bg="light" variant="light" fixed="top">
      <Container className="d-flex">
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="Logo"
            width="70%"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto fw-bold fs-5">
            <Nav.Link as={Link} to="/home" className="text-dark">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/how-it-works" className="text-dark">
              How it Works
            </Nav.Link>
          </Nav>

          <div className="d-flex">
            {!["/signin", "/UserAccessPage"].includes(location.pathname) && (
              <Button variant="success" onClick={handleButtonClick}>
                {user?.user_name ? "Log Out" : "Sign In"}
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col} from "react-bootstrap";
import Forum from "./Forum";

const Banner = () => {
    return(
        <section className="Banner" >
            <Container>
                <Row>
                    {/* <Col  >ajjjjjjjjjkkkkkkkkmmmmmmm</Col> */}
                    <Forum />
                </Row>
            </Container>
        </section>
    )
}
export default Banner
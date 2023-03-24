import Modal from "react-modal";
import {Container, Row, Col} from "react-bootstrap";
import React, { useRef, useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import python from "../assets/img/python-icon.png"
import behavorial from "../assets/img/behavorial-icon.png"
import frontend from "../assets/img/frontend-icon.png"
import react from "../assets/img/react-icon.png"
import sql from "../assets/img/sql-icon.png"
import standard from "../assets/img/standard-icon.jpg"


const images = [[python, "Python"], [behavorial, "Behavorial"], [frontend, "Frontend"], [react, "React"]
, [sql, "SQL"], [standard, "Standard"]];


  
 
const Popup = ({handleClose }) => {
    const videoRef = useRef(null);
    //lets us see image description on hover
    function Camera() {
      useEffect(() => {
        const constraints = { audio: false, video: true };
    
        navigator.mediaDevices.getUserMedia(constraints)
          .then((stream) => {
            videoRef.current.srcObject = stream;
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);
      return (
        
        <div className="Preview" >
          <video  ref={videoRef}  autoPlay controlsList="noplay nodownload" />
        </div>
      );
    }
    //Generates interview questiosn
    async function handleClick({type}) {

      // const res = await fetch('/api/info/Interview_Questions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({interview-type: type})
      // });
      // const data = await res.json();
      // console.log(data)
    }
    
  

    return (
        <div id="Practice-Popup">
          <Container className="Practice-Inital">
            <Row>
              <Col>
                <h1>
                  Hello, world!
                </h1>
              </Col>
            </Row>
            <Row>
                <Col>
                  <Carousel infinite={true} className="Carousel" indicators={false}>
                    {[0, 3].map((start, index) => (
                      <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                          {images.slice(start, start + 3).map((image, subIndex) => (
                            <img
                              key={start + subIndex}
                              src={image[0]}
                              alt={image[1]}
                              title={image[1]}
                              className="mx-2"
                              style={{ width: "100px", height: "50px", cursor: "pointer" }}
                              onClick={handleClick(image[1])}
                              />
                          ))}
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>                    
                </Col>
            </Row>
                  <Row>
                    <Col>
                      <div className="Preview">
                        <Camera />
                      </div>
                    </Col>
                  </Row>

              </Container>
          
                  
          {/* <h2>Hello! This is a popup!</h2>
          <button onClick={handleClose}>Close Modal</button>
        */}

      </div>
    );
}
export default Popup
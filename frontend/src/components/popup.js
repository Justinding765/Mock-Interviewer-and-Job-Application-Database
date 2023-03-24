import Modal from "react-modal";
import {Container, Row, Col, Form, Button} from "react-bootstrap";
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


  
 
const Popup = ({ handleClose, handleData}) => {
    const videoRef = useRef(null);
    const [numQuestions, setNumQuestions] = useState(5);
    const [title, setTitle] = useState("")
    const [questions, setQuestions] = useState("")
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
        
        <div className="Preview">
          <video  ref={videoRef}  autoPlay controlsList="noplay nodownload" />
        </div>
      );
    }
    //Generates interview questiosn
    async function handleClick(type) {

       const res = await fetch('/api/applications/Interview_Questions', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({interviewType: type, number: numQuestions})
       });
       const data = await res.json();
       console.log(data)
       setQuestions(data.data)
    }
    function handleSubmit(){
      handleData({"Title":title,"Questions": questions})
      handleClose()
    }

    
  

    return (
    <div id="Practice-Popup">

      <Container className="Practice-Inital">
        <Row className="justify-content-center">
          <Col md={6}>
            <Form className="custom-form" onSubmit={handleSubmit}>
              <h1>Genearte Interview!</h1>          

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Interview Title</Form.Label>
                <Form.Control required type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <Form.Text className="text-muted">
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Input the number of Questions</Form.Label>
                <Form.Control type="text" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)}/>
                <Form.Text className="text-muted">
                </Form.Text>
              </Form.Group>
              <Form.Group >
                <center><Form.Label>Auto Generate Questions</Form.Label></center>
                <div className="d-flex justify-content-center">

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
                              style={{ width: "80px", height: "50px", cursor: "pointer" }}
                              onClick={() => handleClick(image[1])}
                              />
                          ))}
                        </div>
                      </Carousel.Item>
                          ))}
                  </Carousel>
                </div>            
              </Form.Group>
              <Form.Group>
                <Form.Label>Interview Description</Form.Label>
                <Form.Control required as="textarea" rows={10}  value={questions} onChange={(e) => setQuestions(e.target.value)}
                style={{marginTop: '10px'}} />
              </Form.Group>
              <Form.Group>
                <Camera />        
              </Form.Group>
              <Button variant="primary" type="submit">
                Finish
              </Button>
            </Form>
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
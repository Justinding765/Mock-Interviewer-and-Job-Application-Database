import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
const Intro_anime = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = [ "Mock Interviews", "Media Gallery", "Job Application Database"];
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(200);
    const period = 1000;
    const [show, setShow] = useState(false);
    useEffect(() => {
        let ticker = setInterval(() => {
          tick();
        }, delta);

        return () => { clearInterval(ticker) };
      }, [text])

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
    
        setText(updatedText);
    
        if (isDeleting) {
          setDelta(prevDelta => prevDelta / 1.5);
        }
    
        if (!isDeleting && updatedText === fullText) {
          setIsDeleting(true);
          setDelta(period);
        } else if (isDeleting && updatedText === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          setDelta(200);
        } else {
        }
      }
    return (
    <>
        <h1 style={{color:'white'}}>{"It's time to sharpen you skills using our AI powered features!" } <br/>
        <span className="txt-rotate" ><span className="wrap">{"We offer "+ text}</span>
        </span></h1>
</>
    );
}
export default Intro_anime

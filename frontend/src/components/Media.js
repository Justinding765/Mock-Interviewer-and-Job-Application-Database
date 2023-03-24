import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import '../App.css';
import NavBar from './NavBar'
import Modal from "react-modal";
import { ModalHeader, ModalBody } from 'react-bootstrap';
import Resume_button from '../assets/img/Resume'
import Pause_button from '../assets/img/Pause'
import Swal from 'sweetalert2';

export default function Replays() {
    const [images, setImages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showResume, setshowResume] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [videoUrl, setVideoUrl] = useState("")
    const [isHovering, setIsHovering] = useState(false);
    const [i, seti] = useState(-1)
    const videoRef = useRef(null);
    let [click,setClick] = useState(false)
    const showSuccessAlert = () => {
        Swal.fire({
          icon: 'success',
          iconColor: '#008000',
          title: 'Success!',
          text: 'Video has been deleted',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6ac259',
          background: 'lightblue'
        }).then(() => {
            window.location.reload();
          });

    };
    useEffect(() => {
        fetch('/api/media/get_images',{
            method: 'GET',
        })
          .then(response => { 
            return response.json()})
          .then(images => {
            setImages(images);
          })
          .catch(error => console.error(error));
      }, []);


      function handleClick(index){
        fetch("api/media/get_video"+images[index].filename+"-video", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        //get video from stream
        .then(response => { 
            if (!response.ok) {
                throw new Error('Failed to download video');
            }
            return response.blob();
        })
        .then(blob => {
            // do something with the video blob, like create a URL and set it to the video source
            
            const videoUrl = URL.createObjectURL(blob);  
            setVideoUrl(videoUrl);
            const video = document.querySelector('video');

        })
        .catch(error => console.error(error));
        setClick(false)
        setIsOpen(true);
        seti(index)
     
      }

      function handleDelete(){
        console.log(images[i])
        fetch("api/media/delete_video/"+images[i].filename, {
            method: 'DELETE',
        })
        //get video from stream
        .then(response => { 
            return response.json()})
          .then(data => {
            showSuccessAlert()
        })
          .catch(error => console.error(error));
     
      }

      function toggleModal() {
        setIsOpen(!isOpen);
      }
    function handleMouseEnter(index) {
        setshowResume(true);
        setHoveredIndex(index);

    }

    function handleMouseLeave() {
        setshowResume(false);
        setHoveredIndex(-1);

    }

    const handleVideo = (Ref) => {
      setClick(prevState  => !prevState)
      if (click) {
        videoRef.current.pause()
      }
      else{
        videoRef.current.play()
      }
    }
      
      
    
    return (
        <div >
            <NavBar/>    
            <Container id="gallery">
            <Row className="custom-row">
            
            {images.length > 0 && images.map((image, index) => (
                <Col key={index} xl={3} md={6} sm={12} xs={12} style={{marginBottom: "20px"}}>
                    <div className="thumbnail-container" onClick={() => handleClick(index)} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                        <img  className="thumbnail"src={image.dataUrl} alt={image.filename} thumbnail 
                        />
                        {hoveredIndex === index && (
                            <div id="Resume_button" title="play"><Resume_button/></div>
                        )}
                    </div>
                </Col>
            ))}
            </Row>
        </Container>
            <Modal id="modal" isOpen={isOpen} onRequestClose={toggleModal}>
                <ModalHeader> 
                    <button type="button" id="btn" onClick={toggleModal}><div>x</div></button>
                        </ModalHeader>
                <ModalBody>
                    <div className='Modal-Stream '  onMouseEnter={()=>setIsHovering(true)} onMouseLeave={(()=>setIsHovering(false))}>
                        <video  autoplay={false} controls src={videoUrl} ref={videoRef} controlsList=""/>
                        <div className="overlay-pause-resume"  onClick={()=> handleVideo(videoRef)}>
                            {(click === true && isHovering === true) ? <Pause_button />  : 
                            (click === false && isHovering === true)  ? <Resume_button/>:(<></>) }
                        </div>
                        <div id="danger_btn">
                            <Button className="btn btn-danger btn-sm" onClick={() =>handleDelete()}>Delete </Button>
                        </div>

                    </div>
                </ModalBody>
            </Modal>
      </div>

      );}

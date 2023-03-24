import React, { useRef, useState, useEffect } from 'react';
import { ReactMediaRecorder, useReactMediaRecorder  } from 'react-media-recorder';
import {Container, Row, Col} from "react-bootstrap";
import NavBar from './NavBar';
import Button from 'react-bootstrap/Button';
import Recording from '../assets/img/recordSignal'
import Resume_Button from '../assets/img/Resume'
import Pause_button from '../assets/img/Pause'
import Modal from "react-modal";
import Popup from "./popup"
import Speech from "./Speech"
import Swal from 'sweetalert2';

const Buffer = require('buffer').Buffer;
Modal.setAppElement("#root");
export default function Practice() {
  const { resumeRecording, 
    pauseRecording,
    previewStream,
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl, } =
    useReactMediaRecorder({ video: true });
  const [isOpen, setIsOpen] = useState(false);
  const [enable, setEnable] = useState(true);
  //whether or not to show playback video. Either video is showing or the stream is showing, but not both
  const [video, setVideo] = useState(false)
  const [stream, setStream] = useState(false)
  const videoRef = useRef(null);
  const [interview_data, setData] = useState({});
  const utterance = new SpeechSynthesisUtterance()
  const showSuccessAlert = () => {
    Swal.fire({
      icon: 'success',
      iconColor: '#008000',
      title: 'Success!',
      text: 'Your form has been submitted.',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#6ac259',
      background: 'lightblue'
    }).then(() => {
        window.location.href = '/Media';
      });

};
  useEffect( () => {
      utterance.voice = window.speechSynthesis.getVoices().find((v) => v.name === "Microsoft Sonia Online (Natural) - English (United Kingdom)")
      utterance.rate = 0.8
    }, [interview_data])

  async function handleSpeech() {
    utterance.voice = window.speechSynthesis.getVoices().find((v) => v.name === "Microsoft Sonia Online (Natural) - English (United Kingdom)")
    if(utterance){
      cancelSpeech()
    }
    utterance.text = interview_data.Questions;

    window.speechSynthesis.speak(utterance);
  }

  
  async function pauseSpeech(){
    //window.speechSynthesis.cancel()
    window.speechSynthesis.pause()
  }
  async function resumeSpeech(){
    window.speechSynthesis.resume()
  }

  async function cancelSpeech(){
    window.speechSynthesis.cancel()
  }
  //add popup on popup
  useEffect(() => {
    setIsOpen(true);
    cancelSpeech()
  }, []);

  function toggleModal() {
    setIsOpen(!isOpen);
  }
  
  const VideoPreview = ({ stream }) => {

    let [click,setClick] = useState(true)
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseEnter = () => {
      setIsHovering(true);
    };
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    useEffect(()=>{

    },[click])

    utterance.addEventListener('boundary', (event) => {
      console.log()
      if (event.charIndex-1 > 0 && interview_data.Questions[event.charIndex-1] == "\n") {
        pauseSpeech()
        pauseRecording();
      }
    });
    function handleClick (){
      setClick(prevState  => !prevState)
      if (status === 'recording') {
        pauseRecording();
        pauseSpeech()

      } else {
        resumeRecording();
        resumeSpeech()

      }
    }

    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);
    if (!stream || !stream.active) {
        return null;
    }
    return (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>                 
        <video 
          ref={videoRef}autoPlay controlsList="noplay nodownload
        "/>
        <div id="overlay-record">
          { status === 'recording' ? <Recording />: (<div></div>)}
        </div>
        <div className="overlay-pause-resume"  onClick={handleClick}>
          {/* {status} */}
          {(status === 'recording' === true && isHovering === true) ? <Pause_button />  : 
          (status === 'paused' && isHovering === true)  ? <Resume_Button/>:(<></>) }
        </div>
      </div>
      );
  };
  
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
      <div  >
        <video  ref={videoRef}  autoPlay controlsList="noplay nodownload" />
      </div>
    );
  }

  const FinalVid = () => {
    
    let [click,setClick] = useState(true)
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseEnter = () => {
      setIsHovering(true);
    };
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    const handleClick = () => {
      setClick(prevState  => !prevState)
      if (click) {
        videoRef.current.pause()
      }
      else{
        videoRef.current.play()
      }
    }
    return (
      <div  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <video ref={videoRef}src={mediaBlobUrl} controls autoPlay /> 
        <div className="overlay-pause-resume"  onClick={handleClick}>
          {(click === true && isHovering === true) ? <Pause_button />  : 
          (click === false && isHovering === true)  ? <Resume_Button/>:(<></>) }
        </div>
      </div>
      );
  };

  const showVid = (vid) => {
    setVideo(vid)
  }

  const showStream = (stream) => {
    setStream(stream)
  }
  const handleData = (value) => {
    setData(value);
    
  }
  useEffect(() => {
    setData(interview_data);
  }, [interview_data]);

  function image_converter(thumbnailDataUrl){
    const a = document.createElement("a");
    a.href = thumbnailDataUrl;
    a.download = "thumbnail.png";
    a.click();
  }
  const handleSend = async () => {
    try {
      // genearate the video and a thumbnail    
      const videoBlob = await fetch(mediaBlobUrl).then(response => response.blob());
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoBlob);
      video.currentTime = 2; // Set the time for the thumbnail
      
      video.addEventListener('loadeddata', async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailDataUrl = canvas.toDataURL("image/png");
        const imageBlob = await fetch(thumbnailDataUrl).then(res => res.blob());
          // Use the blob as needed);
        //JSON.stringify({Title: interview_data.Title, Questions: interview_data.Questions})
        //image_converter(thumbnailDataUrl)
        const formData = new FormData();

        formData.append('video', videoBlob, interview_data.Title+"-video");
        formData.append("image", imageBlob, interview_data.Title)
        const response = fetch('/api/media/upload', {
          method: 'POST',
          body: formData, 

        })
        .then(response =>response)
        .then(data => {

            showSuccessAlert();
        })
      })
    } 
    catch (error) {
      console.error(error);
    }
  };
  
   
 
  return (
    <div>
      <div>
        <ReactMediaRecorder
          video
          blobPropertyBag={{
            type: 'video/webm',
          }}
          // askPermissionOnMount={true}
          render={({
          }) => {
            return (
              <div>
                <NavBar />
                  <Modal isOpen={isOpen} >
                    <Popup  handleData={handleData} handleClose={toggleModal}/>
                  </Modal>
                  <Container >
                    {/* <div style={{color:'white'}}>{status}</div> */}
                      <div className='Stream'>
                        {(status === 'stopped' && video===true) && <FinalVid ref={videoRef}/>}
                        {enable && stream && <VideoPreview stream={previewStream}/>}
                        {!(stream || video) ? (<Camera />): (<div></div>)}
                        <div className='Button-Section'>
                          <Row>
                            
                              {(status==='idle')&& 
                              <Col><Button onClick={() => {startRecording(); showVid(false); showStream(true);handleSpeech()}} variant="danger" className="play-button">
                                <i className="fas fa-play">Start Recording</i>
                              </Button></Col>
                              }
                            
                              {status != 'idle'&& status != 'stopped'&&
                               <Col><Button onClick={() => {stopRecording(); showVid(true); showStream(false);cancelSpeech(); }} variant="warning" className="stop-recording-button">
                                <i className="fas fa-stop"></i> Stop Recording
                              </Button></Col>}
                            <Col>
                              <Button onClick={()=> {window.location.reload();cancelSpeech()}} variant="primary" className="new-video-button">
                                <i className="fas fa-plus"></i> New Video
                              </Button>
                            </Col>
                              {status==='stopped' && 
                                <Col><Button variant="success"  onClick={handleSend}><i className="fas fa-plus"></i>Save</Button></Col>
                              }  
                          </Row>

                        </div>
                    </div>
                    <div id="speech">
                  
                    </div>

</Container>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

import "../App.css"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import AssignmentIcon from "@material-ui/icons/Assignment"
import PhoneIcon from "@material-ui/icons/Phone"
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import "../App.css"
const socket = io.connect("http://localhost:5000")

const Practice = () => {
    const [ me, setMe ] = useState("")
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()

  //Everything we set from  an initail load in order to call user
  useEffect(() =>{
    //Allows us to use webcam
    navigator.mediaDevices.getUserMedia({video: true, audio: true}). then((stream) =>{
      setStream(stream)
      myVideo.current.srcObject = stream
    })

    socket.on('me', (id) => {
      setMe(id)
    })
    socket.on("callUser", (data) =>{
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
    })
  }, [])
  const callUser = (id) =>{
    const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
    peer.on("signal", (data) => {
      console.log("a")
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name
			})
		})
    peer.on("stream", (stream) =>{
      //other persons video
      userVideo.current.srcObject = stream
    })

    socket.on("callAccepted", (signal) =>{
      var recorder = new MediaRecorder(stream);

      setCallAccepted(true)
      peer.signal(signal)
    })
    connectionRef.current = peer

  }
  const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) =>{
      console.log("b")
      socket.emit("answerCall", {signal: data, to: caller})
    })

		peer.on("stream", (stream) => {
      //sets other user to video
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
  }
  const leaveCall = () =>{
    setCallEnded(true)
    connectionRef.current.destroy( )
  }
    return(
        <>
    
	    </>
    );
}
export default Practice;
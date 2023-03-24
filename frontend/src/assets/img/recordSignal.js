import { useState, useEffect } from 'react';
import { FaCircle } from 'react-icons/fa';

function Recording() {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    let intervalId;
    intervalId = setInterval(() => {
        setShowOverlay(prevState => !prevState);
      }, 500);
    

    return () => clearInterval(intervalId);
  },[]);

  return (
    <div>
      {<div className="recording-overlay"><FaCircle style={{ color: 'red', visibility: showOverlay ? 'visible' : 'hidden' }} /><br/>Rec</div>}
     
    </div>
  );
}

export default Recording;

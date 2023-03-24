import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import './App.css';
import Practice from './components/Practice'
import Test from './components/Test'
import Speech from './components/Speech'
import Submit_Applications from './components/Submit_Application'
import Media from './components/Media'
import Applications from './components/Applications'
function App() {
  
  return (
    <div className="App">
        <BrowserRouter>
          <div className="pages">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Practice" element={<Practice />} />
              <Route path="/Speech" element={<Speech />} />
              <Route path="/Submit_Applications" element={<Submit_Applications />} />
              <Route path="/Media" element={<Media />} />
              <Route path="/Applications" element={<Applications />} />

              <Route path="/Test" element={<Test />} />

            </Routes>
          </div>
        </BrowserRouter>
        
    </div>
   
  );
}

export default App;

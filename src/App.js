import { BrowserRouter,Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
  
      <Toaster
        position='top-right'
        toastOptions={{
          success:{
                theme:{
                  primary:'#4aed48'
                }   
          }
        }
        }
      >
      </Toaster>
  
      <BrowserRouter>
              <Routes>
                      <Route path='/' element={<Home/>}/>
                      <Route 
                      path='/editor/:roomId' 
                      element={<EditorPage/>}/>
              </Routes>
      
      </BrowserRouter>
    
    </>
  );
}

export default App;

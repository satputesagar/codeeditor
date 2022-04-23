import React,{useState,useRef, useEffect} from 'react'
import ACTIONS from '../Actions'
import Clients from '../components/Clients'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import toast from 'react-hot-toast'

import { useLocation,useNavigate ,useParams ,Navigate} from 'react-router-dom'


const EditorPage = () => {
    
    const location =useLocation();
    const socketRef =useRef(null);
    const reactNavigator =useNavigate();
    const codeRef= useRef(null);
    const {roomId} =useParams();
    const [clients,setClients]=useState([]);

    useEffect(()=>{
        const init= async()=>{
            socketRef.current =await initSocket();

            socketRef.current.on('connect_error',(err)=>handleError(err));
            socketRef.current.on('connect_failed',(err)=>handleError(err));

            // handle Error
            function handleError (e){
                console.log('socket error',e);
                toast.error('socket connection failed, try again later');
                reactNavigator('/');
            }

 
            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                username:location.state?.username,
            });


            // listening for joined event
            socketRef.current.on(ACTIONS.JOINED,
                ({clients,username,socketId})=>{
                if(username !== location.state?.username){
                    toast.success(`${username} joined the room`);
                    console.log(`${username} joined`);
                }
                setClients(Clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE,{
                code:codeRef.current,
                socketId,
            });
         }
    );
  // listening for disconnected
        socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
            toast.success(`${username} left room`);
        setClients((prev)=>{
            return prev.filter(
                (client) => client.socketId !== socketId
                );
        });
        }
    );
};      
init();


        return ()=>{
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    },[]);

    // copy room ID  
     async function copyRoomId(){
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success('room Id has be copied to your Clipboard')
        }catch(err){
            toast.error("could not copy Room Id");
            console.error(err);
        }
    }

    // leave To Room
    function leaveRoom(){
        reactNavigator('/');
    }
 
    if(!location .state){
    return <Navigate to ="/" />;
}



return ( 
<div className="mainWrap">
  <div className="aside">
      <div className="asideInner">
          <div className="logo">
              <img
                  className="logoImage"
                  src="/code-editor.png"
                  alt="logo"
              />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client)=>(
               <Clients
                key={client.socketId}
                username={client.username}
            />
            ))}
          </div>
      </div>
      <button className="btn copyBtn " onClick={copyRoomId()}>
          Copy ROOM ID
      </button>
      <button className="btn leaveBtn" onClick={leaveRoom()} >
          Leave
      </button>
  </div>
  <div className="editorWrap">
      {/* <Editor/> */}
      <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
              codeRef.current = code;
          }}
      />
  </div>
</div>
  );
};

export default EditorPage;
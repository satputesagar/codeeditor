import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import "codemirror/lib/codemirror.css"
import "codemirror/theme/dracula.css";  
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/mode/javascript/javascript";

import ACTIONS from '../Actions';
const Editor = ({socketRef,roomId,onCodeChange}) => {
  
  const editorRef=useRef(null);
  useEffect(()=>{
        async function init(){
            editorRef.current=Codemirror.fromTextArea(
              document.getElementById("realtimeEditor"),{
                    mode:{name:'javascript',json:true},
                    theme:'dracula',
                    autoCloseTags:true,
                    autoCloseBrackets:true,
                  lineNumbers:true,
                  });


                  editorRef.current.on('change',(instance,changes )=>{
                    console.log('changes',changes);
                    const {origin} =changes;
                    const code =instance.getValue();
                    onCodeChange(code);


                    if(origin !== 'setValue'){
                      console.log('working code');
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                        roomId,
                        code,

                      });;
                    }
                    console.log(code);
                  });

        }
        init();

    },[]);

    useEffect(()=>{
      if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        console.log('wcode',code); 
        if(code !==null){
            editorRef.current.setValue(code);
          }
      })
    }
    return()=>{
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
// editorRef.current.setvalue('console.log')-->text add dymatic
},[socketRef.current]);


  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
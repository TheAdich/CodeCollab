'use client'
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import Language from './Language';
import Output from './Output';
import axios from 'axios';
import OutputLoading from './outputLoading';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { Suspense } from 'react';
import toast, { Toaster } from 'react-hot-toast';
const CodeEditor = () => {
    const editorRef = useRef(null);
    //const codeRef = useRef(null);
    const [language, setLanguage] = useState('javascript');
    const [languageId, setLanguageId] = useState(63);
    const [codeValue, setCodeValue] = useState("console.log('hi')");
    const [codeId, setcodeId] = useState(null);
    const [compileresult, setCompileResult] = useState(null);
    const [codeLoading, setCodeLoading] = useState(null);
    const searchParams = useSearchParams()
    const roomId = searchParams.get('id');
    const name = searchParams.get('name');
    const [socketId, setSocketId] = useState(null);
    //socket.io logic
    const socket = useMemo(() => {
        return io("https://codecollab-1.onrender.com", {
            withCredentials: true,
        });
    }, []);

    useEffect(() => {

        const init = () => {
            if (socket) {

                socket.on('connect', () => {
                    //console.log(socket.id);
                    setSocketId(socket.id);
                })
                socket.emit('join_room', ({ roomId, name }));
                socket.on('joined_room', ({ name }) => {
                    toast.success(`${name} has joined the CodeCollab`)
                });
                socket.on('room_codechange', ({ value }) => {
                    //editorRef.current

                    setCodeValue(value);
                    console.log(value);
                })
                return () => {
                    socket.off('joined_room');
                    socket.disconnect();
                }
            }
        }
        init();
        const syncCode=async()=>{
            try{
                const res=await axios.get(`https://codecollab-1.onrender.com/api/room/getroombyid?q=${roomId}`);
                const code=res.data.code;
                if(code!==""){
                    setCodeValue(code);
                    toast.success('Code Synced Successfully!')
                }
            }catch(err){
                console.log(err);
                toast.error('Error is syncing!');
            }
        }
        syncCode();

    }, [socket])

    //code related to editor and compiler
    const handleEditorMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    }
    const handlecodechange = (value) => {
        //codeRef.current = value;
       
        //console.log(codeRef.current);
        socket.emit('codechange', { roomId, value });
        setCodeValue(value);
    }
    const handleCompile = async () => {
        setCodeLoading(true);
        console.log(codeValue, languageId);
        const data = {
            language_id: languageId,
            source_code: btoa(codeValue),
        }
        const instance = axios.create({
            baseURL: 'https://judge0-ce.p.rapidapi.com',
            params: {
                base64_encoded: 'true',
                wait: 'false',
                fields: '*'
            },
            headers: {
                'x-rapidapi-key': '811e438b29mshf70b3ef17eb9b45p15e774jsneddfbc8d9c20',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                'Content-Type': 'application/json'
            }
        })
        try {
            const res = await instance.post('/submissions', data);
            console.log(res);
            const token = res.data.token;
            checkStatus(token);
        } catch (err) {
            let error = err.response ? err.response.data : err;
            // get error status
            let status = err.response.status;
            setCodeLoading(false);
            console.log("status", status);
            if (status === 429) {
                console.log("too many requests", status);
            }
            setCodeLoading(false);
            alert(error.message);
            console.log("catch block...", error);
        }
    }

    const checkStatus = async (token) => {
        const instance = axios.create({
            baseURL: 'https://judge0-ce.p.rapidapi.com',
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'x-rapidapi-key': '811e438b29mshf70b3ef17eb9b45p15e774jsneddfbc8d9c20',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
            }
        })
        try {
            const res = await instance.get(`/submissions/${token}`);
            let statusId = res.data.status?.id;

            // Processed - we have a result
            if (statusId === 1 || statusId === 2) {
                // still processing
                setTimeout(() => {
                    checkStatus(token);
                }, 2000);
                return;
            } else {
                console.log("response.data", res.data);
                setCompileResult(res.data);
                setCodeLoading(false);
                setcodeId(statusId);
                return;
            }
        } catch (err) {
            setCodeLoading(false);
            console.log(err);
        }
    }

    const handleSave=async()=>{
        //console.log(codeValue);
        try{
            const res=await axios.put('https://codecollab-1.onrender.com/api/room/savecode',{roomId,code:codeValue});
            console.log(res.data);
            toast.success('Code saved successfully!');
        }
        catch(err){
            console.log(err);
            toast.error('Could not save the doc!')
        }
    }



    return (
        <React.Fragment>
        <Suspense fallback={<div>Loading...</div>}>
        <Toaster />
        <div className='p-4 w-full'>
            <div className='flex w-full items-center'>
                <div className='w-3/4'>
                    <Language setLanguage={setLanguage} setLanguageId={setLanguageId} />
                    <p>Language:{language}</p>
                </div>
                <button onClick={handleSave} className='bg-blue-400 h-fit text-md rounded-md px-2 mr-4'>Save Changes</button>
                <button onClick={handleCompile} disabled={codeLoading} className='bg-blue-400 h-fit text-lg rounded-md px-4'>{codeLoading ? 'Compiling...' : 'Run'}</button>
            </div>
            <div className='flex w-full'>
                <Editor onMount={handleEditorMount}
                    theme='vs-dark'
                    height="80vh"
                    width="70vw"
                    className='border-2 border-white rounded-md'
                    defaultLanguage='javascript'
                    language={language}
                    value={codeValue}
                    onChange={handlecodechange}
                    defaultValue="console.log('hi')" />
                {codeLoading ? <OutputLoading /> : <Output codeId={codeId} compileresult={compileresult} />}
            </div>
        </div>
        </Suspense>
            
        </React.Fragment>

    )
}
export default CodeEditor;
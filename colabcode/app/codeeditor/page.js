'use client'
import React from 'react'
import CodeEditor from '../_components/Codeeditor'
import Image from 'next/image'
const Codeeditor = () => {
  return (
    <div className="w-full h-screen p-2">
    <div className="w-full mb-2 flex">
    <Image src='/Codinglogo.jpg' height={30} width={30} onClick={()=>window.location.href='/joinroom'} className='rounded-md mr-2'></Image>
      <h1 className="text-white text-xl cursor-pointer" onClick={()=>window.location.href='/joinroom'}>CollabCode</h1>
    </div>
    <CodeEditor />
  </div>
  )
}

export default Codeeditor
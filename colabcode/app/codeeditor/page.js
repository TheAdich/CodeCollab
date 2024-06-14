'use client'
import React from 'react'
import CodeEditor from '../_components/Codeeditor'
const Codeeditor = () => {
  return (
    <div className="w-full h-screen">
    <div className="w-full h-10 mb-2">
      <h1 className="text-white text-xl">CollabCode</h1>
    </div>
    <CodeEditor />
  </div>
  )
}

export default Codeeditor
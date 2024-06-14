'use client'
import React, { useState } from 'react';
import { languageOptions } from '../constants/languageOpt';
const Language=({setLanguage,setLanguageId})=>{
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const handleSelectLanguage = (event) => {
      setLanguage(event.target.value);
      setSelectedLanguage(event.target.value);
      const selectedLanguageObject=languageOptions.filter((e)=>e.value===event.target.value);
      setLanguageId(selectedLanguageObject[0].id)
    };
    return(
        <div className='w-full'>
        <select
          value={selectedLanguage}
          onChange={handleSelectLanguage}
          className="block appearance-none w-2/8 text-black border bg-slate-300 border-gray-300 hover:border-gray-500 px-2 py-2 rounded-md shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Language</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>
    )
}
export default Language;
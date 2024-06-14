'use client'
import React,{useEffect} from 'react'
import { statuses } from '../constants/status'
const Output = ({ codeId, compileresult,codeLoading }) => {
  const codeStatusResult = statuses.filter((e) => e.id === codeId)
  //console.log(codeStatusResult);
  const getOutputDetails=()=>{
    //console.log(codeId,compileresult);
    if(codeId===6){
      //compilation error
      return(
        <React.Fragment>
          <p>{codeStatusResult[0].description}</p>
          <p>{atob(compileresult?.compile_output)}</p>
        </React.Fragment>
      )
    }
    else if (codeId===3){
      return(
        <React.Fragment>
          {atob(compileresult.stdout)!==null?
          `${atob(compileresult.stdout)}`:null
        }
        </React.Fragment>
      )
    }
    else if (codeId===5){
      return(
        <React.Fragment>
          <p>{codeStatusResult[0].description}</p>
        </React.Fragment>
      )
    }
    else{
      return(
        <React.Fragment>
          <p>{codeStatusResult[0].description}</p>
          <p className='text-sm'>{atob(compileresult?.stderr)}</p>
        </React.Fragment>
      )
    }
  }
  return (
    <div className='w-[30vw] h-[80vh] bg-zinc-900 ml-4 p-4 rounded-md'>
      {compileresult ?
        <React.Fragment>{getOutputDetails()}</React.Fragment>
        :
        <p className='text-white'>Click Run to see the output</p>}
    </div>
  )
}

export default Output
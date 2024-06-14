import React from 'react';

const OutputLoading = () => {
    return (
        <div className="flex justify-center items-center w-[30vw] h-[80vh]">
            <div className="flex space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-8 h-8 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
            </div>
        </div>
    );
}

export default OutputLoading;

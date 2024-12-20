import React from 'react'
import SignUpForm from './signup'

const page = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
             <div className="max-w-md mx-auto border rounded-lg p-12 md:p-24 shadow-md bg-white">
             <SignUpForm />
             </div>
         
        </div>
      );
}

export default page

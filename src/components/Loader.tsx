import React from 'react'

function Loader() {
  return (
    <div className='flex justify-center items-center w-full p-8' >
        <div className='w-4 h-4 bg-transparent border-x border-t border-black animate-spin rounded-full' ></div>
    </div>
  )
}

export default Loader
import React from 'react'
import ProductPage from './product'

interface Props {
  params : {id:string}
}

const page =  ({params:{id}}:Props) => {
  return (
    <div>
      < ProductPage id={id}/>
    </div>
  )
}

export default page

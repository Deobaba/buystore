import React from 'react'
import EditProduct from './EditProduct'

interface Props {
  params : {id:string}
}
const page = ({params:{id}}:Props) => {
  return (
    <EditProduct id={id}/>
  )
}

// const page = () => {
//   return (
//     <div>
//       <EditProduct />
//     </div>
//   )
// }

export default page

import Homepage from "./(root)/homepage/page"
import { useRouter } from 'next/navigation';
import SignInForm from "./(auth)/signin/signin";

function MyApp() {
  
    return( 
    <div>
         <Homepage />
    </div>
   )
}



export default MyApp;

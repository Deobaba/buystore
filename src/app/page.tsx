import Homepage from "./(root)/homepage/page"
import { useRouter } from 'next/navigation';
import SignInForm from "./(auth)/signin/signin";

function MyApp() {
  
    return( 
    <div>
         <SignInForm />
    </div>
   )
}



export default MyApp;

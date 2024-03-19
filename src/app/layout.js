import '../app/globals.css'
//import Navbar from '../components/Navbar';
import Navbar from '../components/Navbar'
import SessionProvider from '../components/SessionProvider';

export const metadata = {
  title: 'Mindful Spending App',
  description: 'Mindfullness exercise',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
      <SessionProvider>
        <Navbar />
        <div className="mt-8">
          
            {children}
         
        </div>
        </SessionProvider>
      </body>
    </html>
  )
}

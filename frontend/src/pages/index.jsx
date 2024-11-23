import localFont from "next/font/local";

import { useRouter } from "next/router";
import styles  from "@/styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const router=useRouter();
  return (
   
    <UserLayout>
      <div className={styles.container}>
         <div className={styles.maincontainer}>
            <div className={styles.maincontainer_left}>
                <p>Connect with Friends without Exaggeration</p>
                <p>A True Social media platform ,with stories no bluffs </p>
                 <div  onClick={()=>{
                    router.push("/login")
                 }}className={styles.buttonjoin}>
                  <p>Join Now</p>
                 </div>

            </div>
            <div className={styles.maincontainer_right}>
              <img  style={{
                width:"300px",
                height:"300px"
              }} src="images/connection.jpg" alt=""/>
            </div>
         </div>
      </div>
      </UserLayout>
    
  );
}

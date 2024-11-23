import { clientServer, BASE_URL } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest,  getMyConnectionRequest,  sendConnectionRequset } from '@/config/redux/action/authAction';


export default function view_profile({userProfile}) {
    const router= useRouter()
    const postState=useSelector((state)=>state.post);
   
    const authState=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    const [userPost,setUserPosts]=useState([]);
    const [isCurrentUserInConnnections,setIsCurrentUserInConnnections]=useState(false);
    const [isConnectionNull,setIsConnectionNull]=useState(true)
    const getUserPost=async()=>{
      await dispatch(getAllPosts());
     
      await dispatch(getConnectionsRequest({token:localStorage.getItem('token')}));
      await dispatch(getMyConnectionRequest({token:localStorage.getItem('token')}))

    }
   
    useEffect(()=>{
    let post=postState.all_posts.filter((post)=>{
      return post.userId.username===router.query.username;

    })
   
    
    setUserPosts(post);
  
    },[postState.all_posts])
    useEffect(()=>{
      
      if(authState.connection.some(user=>user.connectionId._id===userProfile.userId._id))
      {
        setIsCurrentUserInConnnections(true)
        if(authState.connection.find(user=>user.connectionId._id===userProfile.userId._id).status_accepted===true){
          setIsConnectionNull(false)
        }
      }
      if(authState.connectionRequest.some(user=>user.userId._id===userProfile.userId._id))
        {
          setIsCurrentUserInConnnections(true)
          if(authState.connectionRequest.find(user=>user.userId._id===userProfile.userId._id).status_accepted===true){
            setIsConnectionNull(false)
          }
        }
    
    },[authState.connection,authState.connectionRequest])
     useEffect(()=>{
      getUserPost()
     },[])
    const searchParams=useSearchParams();
  return (
    <UserLayout>
       <DashboardLayout>
            <div className={styles.Container}>
              <div className={styles.backDropContainer}>
                <img className={styles.backdrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`}></img> 
              </div>
                  <div className={styles.ProfileContainer_details}>
                   <div style={{display:"flex",gap:"1.7rem"}}>
                      <div style={{flex:"0.8"}}>
                         <div style={{display:"flex", width:"fit-content", alignItems:"center", gap:"1.2rem"}}>
                          <h2>{userProfile.userId.name}</h2>
                          <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                         </div>
                         <div style={{display:"flex", alignItems:"center", gap:"1.2rem"}}>
                         {isCurrentUserInConnnections ? <button className={styles.connectionsButton}>
                          {isConnectionNull ?  "Pending" :"Connected"}
                          
                         </button>:<button onClick={()=>{
                          dispatch( sendConnectionRequset({token:localStorage.getItem("token"),user_id:userProfile.userId._id}))
                         }} className={styles.connection_btn}>Connect</button>}
                         <div  onClick={async()=>{
                            const response=await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                            window.open(`${BASE_URL}/${response.data.message}`,"_blank")
                         }}style={{cursor:"pointer"}}>
                         <svg  style={{width:"1.2rem"}}xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

                         </div>
                         </div>
                         <div>
                          <p>{userProfile.bio}</p>
                         
                         </div>
                      </div>

                       <div style={{flex:"0.2"}}>
                          <h3>Recent Activity</h3>
                           {userPost.map((post)=>{
                            return (
                              <div key={post._id} className={styles.postCard}>
                                <div className={styles.card}>
                                  <div className={styles.card_profileContanier}>
                                    {post.media!=="" ?<img src={`${BASE_URL}/${post.media}`}></img>: <div style={{width:"3.4rem", height:"3.4rem"}}></div>}
                                  </div>
                                  <p>{post.body}</p>
                                </div>
                              </div>
                            )
                           })}
                       </div>
                   </div>
                        


         

               </div>
               <div className={styles.workHistrory}>
                <h3 >Work History</h3>
                
                  <div className={styles.workHistoryContainer}>
                       {
                        userProfile.pastwork.map((work,index)=>{
                          return(
                          <div key={index} className={styles.workHistoryCard}>
                            <p style={{fontWeight:"bold", display:"flex", alignItems:"center", gap:"3rem"}}>
                                    {work.company}-{work.position}
                              </p>
                              <p>
                              Years:{work.years}
                              </p>
                            
                          </div>)
                        })
                       }
                  </div>
               </div>
            </div>
</DashboardLayout>
    </UserLayout>
    
  )
}
export async function getServerSideProps(context){
    const requset= await clientServer.get("/user/get_profile_based_on_username",{
        params:{
            username:context.query.username
        }
    });
    const response= await requset.data;
   
return {props:{userProfile:requset.data.profile}}
}

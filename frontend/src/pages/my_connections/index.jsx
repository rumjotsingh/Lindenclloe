import React, { useEffect } from 'react'
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from './../../layout/UserLayout/index';
import { useDispatch, useSelector } from 'react-redux';
import { AcceptConnection, getMyConnectionRequest } from '@/config/redux/action/authAction';
import styles from "./index.module.css"
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function MyConnectionsPage() {
  const dispatch=useDispatch()
  const authState=useSelector((state)=>state.auth);
  const router=useRouter();
  useEffect(()=>{
    dispatch(getMyConnectionRequest({token:localStorage.getItem('token')}));
  },[]);
  useEffect(()=>{
    if(authState.connectionRequest.length!==0 ){
      console.log(authState.connectionRequest);
    }
 
  },[])
  return (
    <UserLayout>
    <DashboardLayout>
      <div style={{display:"flex",flexDirection:"column", gap:"1.2rem"}}>
       
        <h4>My Connections</h4>
        {authState.connectionRequest.length===0 && <h1>No Connections Request</h1>}
        {authState.connectionRequest.length !=0 && authState.connectionRequest.filter((connect)=>connect.status_accepted===null).map((user,index)=>{
          return(
            <div onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
            }} className={styles.userCard} key={index}>
              <div className={styles.ProfilePicture} style={{display:"flex", alignItems:"center"}}>
                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile picture" style={{width:"50px"}}></img>
              </div>
              <div>
                <h3>{user.userId.name}</h3>
                <p>@{user.userId.username}</p>
              </div>
             
              <button  onClick={(e)=>{
                e.stopPropagation()
                dispatch(AcceptConnection({
                  token:localStorage.getItem('token'),
                  requestId:user._id,
                  action_type:"accept",
                  

              }))
            
              }}className={styles.connectionsButton}>Accept</button>
            </div>
          )
        })}
        <h4>My network</h4>
        {authState.connectionRequest.length !=0 && authState.connectionRequest.filter((connect)=>connect.status_accepted!==null).map((user,index)=>{
          return(
            <div onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
            }} className={styles.userCard} key={index}>
              <div className={styles.ProfilePicture} style={{display:"flex", alignItems:"center"}}>
                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile picture" style={{width:"50px"}}></img>
              </div>
              <div>
                <h3>{user.userId.name}</h3>
                <p>@{user.userId.username}</p>
              </div>
             
            </div>
          )
        })}
      </div>
    </DashboardLayout>
   </UserLayout>
  )
}

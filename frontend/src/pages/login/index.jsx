import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./styles.module.css"
import {  loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'


function LoginCoponent() {
  const dispatch=useDispatch();
  const [userLoginMethod,setuserLoginMethod]=useState(false);
  const authState=useSelector((state)=>state.auth)
  const router=useRouter();
  useEffect(()=>{
    if(authState.loggedin){
      router.push('/dashboard')
    }
  },[]);
  const[email,setemail]=useState("");
  const[name,setname]=useState("");
  const[username,setusername]=useState("");
  const[password,setpassword]=useState("");
  const handleregister=()=>{
      dispatch(registerUser({username,email,password,name}))
  }
  useEffect(()=>{(
   dispatch(emptyMessage()));
  },[userLoginMethod])
  const handleLogin=()=>{
     dispatch(loginUser({email,password}));
  }
  useEffect(()=>{
      if(localStorage.getItem("token")){
        router.push("/dashboard");
      }
  },[authState.loggedin])
  return (
    <UserLayout>
      
       <div className={styles.container}>
       <div className={styles.cardContainer}>
           <div className={styles.cardContainer_left}>
                <p className={styles.cardleft_heading} >{  userLoginMethod? "Sign In" :"Sign Up"}</p>
                <p style={{ color:authState.isError ? "red" :"green"}}>{authState.message.message}</p>
                   <div className={styles.inputContainer}>
                    {!userLoginMethod &&    <div className={styles.inputRow}>
                    <input  onChange={(e)=>setusername(e.target.value)}className={styles.inputField}type='text' placeholder='Username'></input>
                    <input onChange={(e)=>setname(e.target.value)} className={styles.inputField}type='text' placeholder='Name'></input>
                    </div>}
                    <input   onChange={(e)=>setemail(e.target.value)}className={styles.inputField}type='text' placeholder='Email'></input>
                    <input   onChange={(e)=>setpassword(e.target.value)}className={styles.inputField}type='text' placeholder='Password'></input>
                       <div onClick={()=>{
                          if(userLoginMethod){
                              handleLogin();
                          }else{
                            handleregister();
                          }
                       }} className={styles.buttonwithoutline}>
                       <p >{  userLoginMethod? "Sign In" :"Sign Up"}</p>
                       </div>
                    </div> 
               
           </div>
           <div className={styles.cardContainer_right}>
                   
                      {userLoginMethod ?  <p>Dont Have Account  </p> :<p>Already Have an  Account</p>}
                <div onClick={()=>{
                         setuserLoginMethod(!userLoginMethod)
                       }} style={{color:"black", textAlign:"center"}} className={styles.buttonwithoutline}>
                       <p >{  userLoginMethod? "Sign Up" :"Sign In"}</p>
                 </div>
                    
                    </div> 
           </div>
      </div>
     
    </UserLayout>
  )
}

export default LoginCoponent
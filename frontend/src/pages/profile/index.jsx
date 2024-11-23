import { getAboutUser } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css'
import { BASE_URL, clientServer } from '@/config';
import { getAllPosts } from '@/config/redux/action/postAction';


function ProfilePage() {
    const authState=useSelector((state)=>state.auth);
    const postState=useSelector((state)=>state.post);
    const [userProfile,setUserProfile]=useState({});
    const[userPost,setUserPosts]=useState([]);
    const[isModalOpen,setIsModalOpen]=useState(false);
    
    const [inputData,setInputData]=useState({
      company: ' ',
          position:"",
            years: ''

    });
    const handleInputChange=(e)=>{
      const {name,value}=e.target;
      setInputData({...inputData,[name]:value})
    }
    
    const dispatch =useDispatch();
    useEffect(()=>{
     dispatch(getAboutUser({token:localStorage.getItem('token')}));
     dispatch(getAllPosts())

    },[]);
    useEffect(() => {
      if (authState.user!==undefined) {
        setUserProfile(authState.user);
        let post=postState.all_posts.filter((post)=>{
          return post.userId.username===authState.user.userId.username
    
        })
        setUserPosts(post);
       
      }
           
    },[authState.user,postState.all_posts])
    const uploadProfilePicture=async(file)=>{
      const formData=new FormData();
      formData.append('profile_picture',file);
      formData.append("token",localStorage.getItem('token'));
      const response=await clientServer.post("/update_profile_picture",formData,{
        headers:{
          "Content-Type": "multipart/form-data",

        }
      });
      dispatch(getAboutUser({token:localStorage.getItem('token')}));
    }
    const UpadateProfile= async()=>{
      const request=await clientServer.post("/user_update",{
        token:localStorage.getItem('token'),
        username:userProfile.userId.username,
        email:userProfile.userId.email,
        name:userProfile.userId.name

      });
      const response=await clientServer.post("/update_profile_data",{
        token:localStorage.getItem('token'),
        bio:userProfile.bio,
        currentpost:userProfile.currentpost,
        pastwork:userProfile.pastwork,
        education:userProfile.education
      });
      dispatch(getAboutUser({token:localStorage.getItem('token')}))

    }
    
  return (
    <UserLayout>
        <DashboardLayout>
        {authState.user && userProfile.userId&& (
  <div className={styles.Container}>
    <div className={styles.backDropContainer}>
     
        <label htmlFor='profilePictureUpload' className={styles.backdrop_overlay}>
          <p>Edit</p>
        </label>
        <input onChange={(e)=>{
                uploadProfilePicture(e.target.files[0]);
        }} hidden name='profile_picture' type='file' id='profilePictureUpload'></input>
        
               <img
          
          src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
          alt="Profile Backdrop"
        />
        
       
    
    </div>
    <div className={styles.ProfileContainer_details}>
      <div style={{ display: "flex", gap: "1.7rem" }}>
        <div style={{ flex: "0.8" }}>
          <div
            style={{
              display: "flex",
              width: "fit-content",
              alignItems: "center",
              gap: "1.2rem",
            }}
          >
           <div style={{display:"flex", width:"fit-content", alignItems:"center", gap:"1.2rem"}}>
            <input className={styles.nameEdit} type='text' value={userProfile.userId.name} onChange={(e)=>{
              setUserProfile({...userProfile,userId:{...userProfile.userId,name:e.target.value}})
            }}></input>
            </div> 
            <p style={{ color: "grey" }}>@{userProfile?.userId?.username}</p>
          </div>
          <div>
            <textarea value={userProfile.bio} onChange={(e)=>{
              setUserProfile({...userProfile,bio:e.target.value})
            }} rows={Math.max(3,Math.ceil(userProfile.bio.length/80))} style={{width:"100%"}}></textarea>
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
      <h3>Work History</h3>
      <div className={styles.workHistoryContainer}>
        {userProfile?.pastwork?.map((work, index) => (
          <div key={index} className={styles.workHistoryCard}>
            <p
              style={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "3rem",
              }}
            >
              {work.company} - {work.position}
            </p>
            <p>Years: {work.years}</p>
          </div>
        ))}
        <button className={styles.addWorkButton} onClick={()=>{
           setIsModalOpen(true)
        }}>
          Addwork
        </button>
      </div>
    </div>
    {userProfile!=authState.user && <div onClick={()=>{
         UpadateProfile();
    }} className={styles.connectionsButton}>
      Update profile
      </div>}
  </div>
)}

   {isModalOpen &&
  <div
    onClick={()=>{
      setIsModalOpen(false);
    }}
  >

    <div className={styles.CommentsContainer}>
      <div onClick={(e)=>{
         e.stopPropagation()
      }} className={styles.allCommnetsContainer}>
         <input onChange={handleInputChange} name ='company'className={styles.inputField}type='text' placeholder='Enter the Comapny'></input>
         <input onChange={handleInputChange} name='position'className={styles.inputField}type='text' placeholder='Enter the positon'></input>
         <input onChange={handleInputChange} name='years' className={styles.inputField}type='number' placeholder='Enter the Years'></input>
         <div>
          <button onClick={()=>{
            setUserProfile({...userProfile,pastwork:[...userProfile.pastwork,inputData]});
            setIsModalOpen(false);
          }} className={styles.connectionsButton}>Add Work</button>
         </div>
      </div>

    </div>
  </div>
}

        </DashboardLayout>
    </UserLayout>
    
  )
}

export default ProfilePage

import { createPost, deletePost, getAllPosts,increamentLikes, decreamentLikes,getCommnets, postCommnet } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router'
import React, { useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from './../../layout/UserLayout/index';
import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout';
import styles from "./index.module.css"
import { BASE_URL } from '@/config';
import { resetPostId } from '@/config/redux/reducer/postReducer';

export  default function dashboard() {
    const PostState=useSelector((state)=> state.post)
   const authState=useSelector((state)=>state.auth);
   const router=useRouter();
    const dispatch=useDispatch();
    const [commentText,setCommentText]=useState("");
  useEffect(()=>{
    if(authState.isTokenThere){
      dispatch(getAboutUser({token:localStorage.getItem('token')}));
    }
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers())
}
dispatch(getAllPosts())
},[authState.isTokenThere])
 const [postContent,setpostContent]=useState("");
 const [filecontent,setfilecontent]=useState();
 const handleUpload=()=>{
    dispatch(createPost({
    file:filecontent,
    body:postContent
}))
   setpostContent("");
   setfilecontent("");
   dispatch(getAllPosts())
 }
  if(authState.user){
    return (
   <UserLayout>
    <DashboardLayout>
    <div className={styles.scroll}>
  <div className={styles.wrapper}>
    <div className={styles.CreatePostContainer}>
      <img className={styles.userProfileImage} src={`${BASE_URL}/${authState.user.userId.profilePicture}`} alt="User Profile" />
      <textarea 
        onChange={(e) => setpostContent(e.target.value)} 
        value={postContent} 
        placeholder="What’s on your mind?" 
        className={styles.textarea} 
      />
      <label htmlFor="fileUpload">
        <div className={styles.Fab}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </label>
      <input 
        onChange={(e) => setfilecontent(e.target.files[0])} 
        type="file" 
        hidden 
        id="fileUpload" 
      />
      {postContent.length > 0 && (
        <div onClick={handleUpload} className={styles.UploadButton}>
          Post
        </div>
      )}
    </div>

    {PostState.all_posts.map((post, key) => (
  <div key={key} className={styles.singleCard}>
    <div className={styles.singleCard_profileContainer}>
      <img className={styles.userProfileImage} src={`${BASE_URL}/${post.userId.profilePicture}`} alt="User Profile" />
      <div className={styles.userInfo}>
        <div style={{display:"flex", gap:"5rem"}}>
        <p className={styles.userName}>{post.userId.name}</p>
        {
  post.userId._id === authState.user.userId._id && (
    <button 
      onClick={ async () => {
        await dispatch(deletePost(post._id)); // Pass post._id directly
        await dispatch(getAllPosts());
      }}
      className={styles.deleteButton} 
      aria-label="Delete Post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9L14.394 18m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    </button>
  )
}

        </div>
        
        <p className={styles.username}>@{post.userId.username}</p>
      </div>
     
    </div>
    <p className={styles.postContent}>{post.body}</p>
    {post.media && (
      <img className={styles.postImage} src={`${BASE_URL}/${post.media}`} alt="Post Media" />
    )}
       <div className={styles.optionContainer}>
          <div onClick={ async()=>{
             await dispatch(increamentLikes({post_id:post._id}))
             await dispatch(getAllPosts());
          }} className={styles.optionContainer_singleoptions}>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
            </svg>
            <p>{post.likes}</p>
          </div>
          <div  onClick={
            async ()=>{
              await dispatch(decreamentLikes({post_id:post._id}))
              await dispatch(getAllPosts());
            }
          }className={styles.optionContainer_singleoptions}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
</svg>
            <p>{post.dislikes}</p>

          </div>
          <div  onClick={()=>{
            dispatch(getCommnets({post_id:post._id}));
          }}className={styles.optionContainer_singleoptions}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg>

   
          </div>
  
        </div>
   
  </div>
))}

  </div>
</div>
{
  PostState.postId !="" && 
  <div
    onClick={()=>{
      dispatch(resetPostId())
    }}
  >

    <div className={styles.CommentsContainer}>
      <div onClick={(e)=>{
         e.stopPropagation()
      }} className={styles.allCommnetsContainer}>
          {PostState.comments.length===0 && <h2>No Comment</h2>}
          {PostState.comments.length!==0 && <div>
             {PostState.comments.map((Comments,index)=>{
                  return(
                      <div className={styles.singleCommnets} key={index}>
                        <div className={styles.singleCommnets_profileContainer}>
                          <img src={`${BASE_URL}/${Comments.userId.profilePicture}`} alt=''></img>
                          <div>
                            <p style={{fontWeight:"bold",fontSize:"1.2rem"}}>@{Comments.userId.username}</p>
                            <p>{Comments.userId.name}</p>
                          </div>
                        </div>
                        <p>
                          {Comments.body}
                        </p>
                      </div>





















                  )
             })

             }


          </div> }
          <div className={styles.postCommnetContaner}>
            <input type='' value={commentText} onChange={(e)=>{setCommentText(e.target.value)}} placeholder='Commnet'></input>
            <div  onClick={async()=>{
                await dispatch(postCommnet({post_id:PostState.postId,body:commentText}))
                await dispatch(getCommnets({post_id:PostState.postId}))
            }} className={styles.postCommentContaner_btn}>
              <p>Comment</p>
            </div>
          </div>
      </div>

    </div>
  </div>
}

    </DashboardLayout>
   </UserLayout>
  ) 
  }else{
     return(
      <UserLayout>
    <DashboardLayout>
      <h2>Loading ....</h2>
    </DashboardLayout>
   </UserLayout>
     )
     
  }
  
}


import React, { useState, useContext } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common';
import Context from '../context'
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole,setUserRole] = useState(role)
    const [file, setFile] = useState(null)

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value)

        console.log(e.target.value)
    }

    const context = useContext(Context)

    const updateUserRole = async() =>{
        let fetchResponse
        if (file) {
            const fd = new FormData()
            fd.append('userId', userId)
            fd.append('role', userRole)
            fd.append('name', name)
            fd.append('email', email)
            fd.append('profilePic', file)

            fetchResponse = await fetch(SummaryApi.updateUser.url, {
                method: SummaryApi.updateUser.method,
                credentials: 'include',
                body: fd
            })
        } else {
            fetchResponse = await fetch(SummaryApi.updateUser.url,{
                method : SummaryApi.updateUser.method,
                credentials : 'include',
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify({
                    userId : userId,
                    role : userRole
                })
            })
        }

        const responseData = await fetchResponse.json()

        if(responseData.success){
            toast.success(responseData.message)
            onClose()
            callFunc()
            // refresh current user details (in case admin updated their own profile pic)
            try{ context.fetchUserDetails() }catch(e){/* ignore */}
        }

        console.log("role updated",responseData)

    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50'>
       <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>

            <button className='block ml-auto' onClick={onClose}>
                <IoMdClose/>
            </button>

            <h1 className='pb-4 text-lg font-medium'>Change User Role</h1>

             <p>Name : {name}</p>   
             <p>Email : {email}</p> 

            <div className='flex items-center justify-between my-4'>
                <p>Role :</p>  
                <select className='border px-4 py-1' value={userRole} onChange={handleOnChangeSelect}>
                    {
                        Object.values(ROLE).map(el => {
                            return(
                                <option value={el} key={el}>{el}</option>
                            )
                        })
                    }
                </select>
            </div>

            <div className='my-4'>
                <label className='block mb-2'>Profile photo (optional):</label>
                <input type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])} />
            </div>


            <button className='w-fit mx-auto block  py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700' onClick={updateUserRole}>Change Role</button>
       </div>
    </div>
  )
}

export default ChangeUserRole
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios.js";
import toast from "react-hot-toast";

function Profile() {

    const[user, setUser] = useState(null);
    const[numberOfNotes, setNumberOfNotes] = useState(null);

    useEffect(()=>{


        const getUser = async()=>{
        try{
        const user = await api.get("/auth/me");
        if(!user){
            throw new Error("Error fetching data of user");
        }
        setUser(user.data.user);
        const notes = await api.get("/notes");
        if(!notes){
            throw new Error("Error fetching notes");
        }
        setNumberOfNotes(notes.data.notes.length);
        }
        catch(err){
            toast.error("Error loading Profile");
            console.error(err.message);
        }
        }



        getUser();
    }, []);

  return (
    <>
      <Navbar />

      <div className="overflow-hidden shadow rounded-lg border m-7">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-900">User Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-500">
            Info
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-500">Username</dt>
              <dd className="mt-1 text-sm text-900 sm:mt-0 sm:col-span-2">
                {user?.username}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-500">Email address</dt>
              <dd className="mt-1 text-sm text-900 sm:mt-0 sm:col-span-2">
                {user?.email}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-500">
                Number of Active Notes
              </dt>
              <dd className="mt-1 text-sm text-900 sm:mt-0 sm:col-span-2">{numberOfNotes}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}

export default Profile;

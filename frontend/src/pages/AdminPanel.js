import React, { useEffect, useContext } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import getImageUrl from "../helpers/getImageUrl";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";
import Context from "../context";

const AdminPanel = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex">
      <aside className="bg-white w-full max-w-60 shadow">
        <div className="h-32 flex flex-col justify-center items-center">
          {user?.profilePic ? (
            <img
              src={getImageUrl(user.profilePic)}
              className="w-20 h-20 rounded-full"
              alt={user?.name}
            />
          ) : (
            <FaRegCircleUser size={50} />
          )}

          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>

        <nav className="p-4 grid gap-2">
          <Link to="all-users">All Users</Link>
          <Link to="all-products">All Products</Link>
        </nav>
      </aside>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;

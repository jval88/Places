import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      image: "https://www.gstatic.com/webp/gallery/4.sm.jpg",
      name: "Joe",
      places: 3,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;

import React from "react";

const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  // Here you can implement your authentication logic

  return <div>{children}</div>;
};

export default ProtectRoute;

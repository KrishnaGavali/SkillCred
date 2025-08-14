import ProtectRoute from "@/components/ProtectRoute";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  console.log("Layout for complete profile page");

  return (
    <>
      <ProtectRoute>{children}</ProtectRoute>
    </>
  );
};

export default layout;

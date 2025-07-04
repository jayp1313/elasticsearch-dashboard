import React from "react";
import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="h-[90vh] flex justify-center items-center">
      <HashLoader color="black" size={30} />
    </div>
  );
};

export default Loader;

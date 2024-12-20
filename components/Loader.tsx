"use client";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

function Loader({ title }: { title?: string }) {
  return (
    <div className="w-full py-52 flex flex-col justify-center items-center gap-8">
      <ClimbingBoxLoader size={25} />
      {title && <p className="font-semibold">{title}</p>}
    </div>
  );
}

export default Loader;

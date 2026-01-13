import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const A = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const tl = gsap.timeline({
    // scrollTrigger: {
    //   trigger: mainRef.current,
    //   start: "top top",
    //   end: "bottom top",
    //   scrub: 1,
    // },
    repeat: -1,
    yoyo: true,
    ease: "power2.out",
  });
  useGSAP(
    () => {
      tl.to(".box1", {
        x: 200,
        duration: 1,
      });
      tl.to(".box2", {
        x: 200,
        rotate: 360,
        duration: 1,
      });
    },
    { scope: mainRef }
  );
  return (
    <div
      ref={mainRef}
      className=" h-screen container mx-auto px-4 py-10 border"
    >
      <div className="relative w-full h-80 border bg-slate-900 mb-5">
        {/* <div className="absolute top-1/2 bottom-12 left-1/2 -translate-x-1/2 -translate-y-1/2 "> */}
        <div className=" absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2  ">
          <div className="w-200 h-40 bg-red-500 hover:bg-red-600"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className=" rounded-lg h-60 bg-blue-500 hover:bg-blue-600"></div>
        <div className="rounded-lg h-60 bg-yellow-500 hover:bg-yellow-600"></div>
      </div>
      <div className="flex flex-col gap-8 mt-10">
        <div className="flex flex-col gap-2 items-center text-center">
          <h1 className="text-2xl font-bold">Explore Cities</h1>
          <p className="text-gray-500">Our Location For you</p>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div className="box1 rounded-full h-40 w-40 bg-blue-500 hover:bg-blue-600"></div>
          <div className="box2 rounded-full h-40 w-40 bg-yellow-500 hover:bg-yellow-600"></div>
          <div className="rounded-full h-40 w-40 bg-blue-500 hover:bg-blue-600"></div>
          <div className="rounded-full h-40 w-40 bg-yellow-500 hover:bg-yellow-600"></div>
          <div className="rounded-full h-40 w-40 bg-blue-500 hover:bg-blue-600"></div>
          <div className="rounded-full h-40 w-40 bg-yellow-500 hover:bg-yellow-600"></div>
        </div>
      </div>
    </div>
  );
};

export default A;

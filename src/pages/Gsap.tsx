import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { Fireworks } from "@fireworks-js/react";

const Gsap = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      console.log("Current time:", now);

      //   const nextYear = new Date("January 1, 2026 00:00:00").getTime();
      const nextYear = now.getFullYear() + 1;
      const target = new Date(`${nextYear}-01-01T00:00:00`);
      const difference = target - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        setIsCelebrating(true);
        return {};
      }
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isCelebrating) {
      const countdownElement = document.getElementById("countdown");
      if (countdownElement) {
        gsap.fromTo(
          countdownElement,
          { scale: 0.8, opacity: 0, rotation: -5 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          }
        );
      }
    } else {
      const messageElement = document.getElementById("countdown");
      if (messageElement) {
        gsap.to(messageElement, {
          scale: 1.1,
          duration: 0.4,
          ease: "bounce.out",
          yoyo: true,
          repeat: 1,
        });
      }
    }
  }, [timeLeft, isCelebrating]);

  const formatTime = (time) => time.toString().padStart(2, "0");

  return (
    <div className="flex justify-center items-center h-screen  text-white font-sans overflow-hidden relative">
      <div
        id="countdown"
        className="text-center text-8xl md:text-9xl lg:text-[15rem] font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10"
      >
        {isCelebrating ? (
          "Happy New Year!"
        ) : (
          <div className="flex space-x-2 md:space-x-4">
            <span>{formatTime(timeLeft.days || 0)}</span>:
            <span>{formatTime(timeLeft.hours || 0)}</span>:
            <span>{formatTime(timeLeft.minutes || 0)}</span>:
            <span>{formatTime(timeLeft.seconds || 0)}</span>
          </div>
        )}
      </div>
      {isCelebrating && (
        <Fireworks
          options={{
            rocketsPoint: { min: 40, max: 60 },
            hue: { min: 0, max: 360 },
            delay: { min: 15, max: 30 },
            speed: 2,
            acceleration: 1.05,
            friction: 0.95,
            gravity: 1.5,
            particles: 120,
            trace: 4,
            explosion: 10,
            autoresize: true,
            brightness: { min: 50, max: 80, decay: { min: 0.015, max: 0.03 } },
            mouse: { click: true, move: false, max: 1 },
            sound: { enabled: false },
          }}
          className="absolute top-0 left-0 w-full h-full z-0"
        />
      )}
    </div>
  );
};

export default Gsap;

"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SIGNBOARD_TYPES = [
  { 
    type: 'speed', 
    colors: [0x00ff00, 0x00cc00], 
    getMessage: (limit) => `Speed Limit: ${limit} km/h`,
    generateLimit: () => Math.floor(Math.random() * 40) + 40 // 40-80 km/h
  },
  { 
    type: 'caution', 
    colors: [0xffff00, 0xffd700], 
    getMessage: () => 'Caution Ahead!',
    generateLimit: () => 0
  },
  { 
    type: 'turn', 
    colors: [0xff6347, 0xff4500], 
    getMessage: () => 'Sharp Turn Ahead!',
    generateLimit: () => 0
  }
];

const HighwayGame = () => {
  const mountRef = useRef(null);


  useEffect(() => {
    if (typeof window === "undefined") return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();

    const createRoadBackground = () => {
      return new Promise((resolve) => {
        textureLoader.load("/link1.gif", (texture) => {
          const roadGeometry = new THREE.PlaneGeometry(50, 100);
          const roadMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
          });

          for (let i = 0; i < 100; i++) {
            const road = new THREE.Mesh(roadGeometry, roadMaterial);
            road.rotation.x = -Math.PI / 2;
            road.position.z = -20 - i * 100;
            scene.add(road);
          }

          resolve();
        });
      });
    };

    const createSignboards = () => {
      const signboards = [];
      const roadLength = 1000;
      const signboardSpacing = 100;

      for (let z = -50; z > -roadLength; z -= signboardSpacing) {
        const signboardType =
          SIGNBOARD_TYPES[
            Math.floor(Math.random() * SIGNBOARD_TYPES.length)
          ];

        const signGeometry = new THREE.PlaneGeometry(5, 3);
        const signColor =
          signboardType.colors[
            Math.floor(Math.random() * signboardType.colors.length)
          ];

        const signMaterial = new THREE.MeshBasicMaterial({
          color: signColor,
          side: THREE.DoubleSide,
        });

        const signboard = new THREE.Mesh(signGeometry, signMaterial);
        signboard.position.set(
          Math.random() > 0.5 ? -5 : 5,
          3,
          z
        );
        scene.add(signboard);

        signboards.push({
          mesh: signboard,
          type: signboardType.type,
          limit: signboardType.generateLimit(),
          getMessage: signboardType.getMessage,
        });
      }

      return signboards;
    };

    const loadCar = () => {
      return new Promise((resolve) => {
        textureLoader.load("/car.jpg", (texture) => {
          const carGeometry = new THREE.BoxGeometry(3, 2, 5);
          const carMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
          });
          const car = new THREE.Mesh(carGeometry, carMaterial);
          car.position.set(0, 1, 0);
          scene.add(car);
          resolve(car);
        });
      });
    };

    const initGame = async () => {
      await createRoadBackground();
      const car = await loadCar();
      const signboards = createSignboards();

      let carSpeed = 0;
      const maxSpeed = 2; 
      const acceleration = 0.02;
      const reverseSpeed = -1; 

      const handleKeyDown = (event) => {
        switch (event.key) {
          case "ArrowRight":
            car.position.x = Math.min(car.position.x + 1, 2);
            break;
          case "ArrowLeft":
            car.position.x = Math.max(car.position.x - 1, -2);
            break;
          case "ArrowUp":
            carSpeed = Math.min(carSpeed + acceleration, maxSpeed);
            break;
          case "ArrowDown":
            carSpeed = Math.max(carSpeed - acceleration, reverseSpeed); // Reverse support
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      const animate = () => {
        requestAnimationFrame(animate);

        car.position.z -= carSpeed;
        camera.position.z = car.position.z + 20;

        signboards.forEach(({ mesh, type, limit, getMessage }) => {
          if (Math.abs(car.position.z - mesh.position.z) < 2) {
            setGameState((prev) => ({
              ...prev,
              currentMessage: getMessage(limit),
            }));
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        mountRef.current?.removeChild(renderer.domElement);
        scene.dispose();
      };
    };

    const cleanupRef = { current: null };

    initGame().then((cleanup) => {
      cleanupRef.current = cleanup;
    });

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  return (
    <div>
      <div ref={mountRef} className="w-full h-screen" />
      <div className="absolute top-4 left-4 bg-white p-4 rounded">
      </div>
    </div>
  );
};

export default HighwayGame;

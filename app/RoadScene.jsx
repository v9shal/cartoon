"use client"

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const RoadScene = () => {
  const mountRef = useRef(null);
  const [isCarStopped, setIsCarStopped] = useState(false);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Road
    const roadGeometry = new THREE.PlaneGeometry(20, 10);
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    scene.add(road);

    // Road Markings
    const markingsGeometry = new THREE.PlaneGeometry(20, 0.1);
    const markingsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const roadMarkings = new THREE.Mesh(markingsGeometry, markingsMaterial);
    roadMarkings.rotation.x = -Math.PI / 2;
    roadMarkings.position.y = 0.01;
    scene.add(roadMarkings);

    // Trees
    const treeGeometry = new THREE.ConeGeometry(1, 3, 4);
    const treeMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });

    // Left side trees
    const leftTreePositions = [
      { x: -8, z: -2 },
      { x: -7, z: 2 },
      { x: -9, z: 5 }
    ];

    leftTreePositions.forEach(pos => {
      const tree = new THREE.Mesh(treeGeometry, treeMaterial);
      tree.position.set(pos.x, 1.5, pos.z);
      scene.add(tree);
    });

    // Stop Sign
    const stopSignGeometry = new THREE.PlaneGeometry(2, 2);
    const stopSignMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0000, 
      side: THREE.DoubleSide 
    });
    const stopSign = new THREE.Mesh(stopSignGeometry, stopSignMaterial);
    stopSign.position.set(0, 2, 5); // Positioned in the road view
    scene.add(stopSign);

    // Car
    const carGeometry = new THREE.BoxGeometry(2, 1, 1);
    const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const car = new THREE.Mesh(carGeometry, carMaterial);
    scene.add(car);

    // Car movement variables
    let carPosition = -10;
    let isMoving = true;
    let carSpeed = 0.1;

    // Keyboard controls
    const keyState = {};
    
    const onKeyDown = (event) => {
      keyState[event.key] = true;
    };

    const onKeyUp = (event) => {
      keyState[event.key] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Check if car is near stop sign
      const distanceToStopSign = Math.abs(carPosition - stopSign.position.z);
      
      // Car movement logic
      if (isMoving && distanceToStopSign < 1) {
        isMoving = false;
        setIsCarStopped(true);
      }

      // Arrow key controls
      if (isMoving) {
        carPosition += carSpeed;
        if (carPosition > 10) carPosition = -10;
      } else {
        // When stopped, allow movement with arrow keys
        if (keyState['ArrowLeft']) carPosition += carSpeed;
        if (keyState['ArrowDown']) carPosition -= carSpeed;
        if (keyState['ArrowUp']) car.position.x -= 0.1;
        if (keyState['ArrowRight']) car.position.x += 0.1;
      }

      // Update car position
      car.position.set(car.position.x, 0.5, carPosition);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      mountRef.current.removeChild(renderer.domElement);
      scene.dispose();
    };
  }, []);

  return (
    <div>
      <div ref={mountRef} className="w-full h-screen" />
      {isCarStopped && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded">
          Stop Sign Reached! Use Arrow Keys to Move
        </div>
      )}
    </div>
  );
};

export default RoadScene;
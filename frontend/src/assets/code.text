// App.jsx – COMPLETE ENVIRONMENT & FOG FIX
import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FaCog, FaMusic, FaCity, FaPause, FaPlay } from 'react-icons/fa';

// ==================== ENHANCED SCENERY (FIXED: Infinite Looping & Visibility) ====================
const SceneryGroup = memo(({ worldOffset, showScenery, dayCycle, settings }) => {
  if (!showScenery) return null;
  const isDarkTime = dayCycle > 0.62 || dayCycle < 0.12; 

  // গেমের স্পিডের সাথে সিনারিকে অবিরত লুপ করার ম্যাজিক ক্যালকুলেশন (Z-axis wrapping)
  const viewDistance = 120; // সর্বোচ্চ দূরত্ব

  return (
    <group>
      {/* 🏔️ Mountains (endless loop) */}
      {[
        [-45,1,-80,16,14,'#4a6741'], [-28,0.5,-110,14,17,'#3d5a35'],
        [-15,1,-60,15,12,'#5a7a50'], [12,0.5,-90,13,16,'#4a6741'],
        [28,1,-70,17,13,'#3d5a35'], [45,0.5,-105,12,15,'#5a7a50']
      ].map(([x, y, baseZ, w, h, c], i) => {
        // পাহাড়গুলো ক্যামেরা পার হলে আবার পেছনে ফিরে যাবে
        let z = baseZ + (worldOffset * 8);
        z = ((z + 120) % 160) - 130;
        return (
          <group key={`mnt-${i}`} position={[x, y, z]}>
            <mesh castShadow><coneGeometry args={[w, h, 4, 4]} /><meshStandardMaterial color={c} roughness={0.8} /></mesh>
            <mesh position={[0, h/2, 0]}><coneGeometry args={[2, 2.5, 4, 4]} /><meshStandardMaterial color="#fff" roughness={0.3} /></mesh>
          </group>
        );
      })}

      {/* 🌊 Rivers */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[-42,-1.4,-50]}><planeGeometry args={[6, 200]}/><meshStandardMaterial color="#3498db" transparent opacity={0.6} metalness={0.4}/></mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[42,-1.4,-50]}><planeGeometry args={[6, 200]}/><meshStandardMaterial color="#3498db" transparent opacity={0.6} metalness={0.4}/></mesh>

      {/* 🌳 Trees (Endless Streaming) */}
      {[...Array(30)].map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1; 
        const x = side * (13 + (i % 4) * 2); 
        const baseZ = -i * 4;
        let z = baseZ + (worldOffset * 10);
        z = ((z + 80) % 100) - 80; // Endless wrap between -80 and 20

        return (
          <group key={`tree-${i}`} position={[x, 0, z]}>
            <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.2, 0.3, 2.4, 8]} /><meshStandardMaterial color="#8B4513" roughness={0.9} /></mesh>
            <mesh position={[0, 3.2, 0]} castShadow><coneGeometry args={[1.5, 3, 8, 4]} /><meshStandardMaterial color="#228B22" roughness={0.7} /></mesh>
            <mesh position={[0, 4.5, 0]} castShadow><coneGeometry args={[1, 2, 8, 4]} /><meshStandardMaterial color="#2ecc71" roughness={0.7} /></mesh>
          </group>
        );
      })}

      {/* 🏙️ City Buildings (Fixed 3D Depth & Looping) */}
      {settings.showCity && [...Array(settings.buildingCount)].map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1; 
        const x = side * (24 + (i % 3) * 4); 
        const baseZ = -i * 12;
        let z = baseZ + (worldOffset * 10);
        z = ((z + 100) % 120) - 100;

        const height = 16 + (i % 5) * 4; 
        const width = 6;
        const depth = 6;

        return (
          <group key={`city-${i}`} position={[x, 0, z]}>
            {/* Real 3D Building Box */}
            <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color="#2c3e50" roughness={0.6} metalness={0.4} />
            </mesh>
            {/* Windows aligned correctly on the front face */}
            {Array.from({ length: Math.floor(height / 3.5) }, (_, wy) => (
              <mesh key={wy} position={[0, wy * 3.5 + 2.5, depth / 2 + 0.02]}>
                <boxGeometry args={[width * 0.7, 0.9, 0.05]} />
                <meshBasicMaterial color={isDarkTime ? settings.windowGlowColor : '#1a1a1a'} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* 💡 Street Lamps */}
      {settings.showStreetLights && [...Array(12)].map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1; 
        const x = side * 5.4; 
        const baseZ = -i * 10;
        let z = baseZ + (worldOffset * 10);
        z = ((z + 80) % 100) - 80;

        return (
          <group key={`lamp-${i}`} position={[x, 0, z]}>
            <mesh position={[0, 2.5, 0]} castShadow><cylinderGeometry args={[0.08, 0.12, 5, 8]} /><meshStandardMaterial color="#333" roughness={0.5} /></mesh>
            <mesh position={[side * 0.3, 5, 0]}><boxGeometry args={[0.8, 0.15, 0.4]} /><meshStandardMaterial color="#222" /></mesh>
            <pointLight position={[side * 0.3, 4.7, 0]} intensity={isDarkTime ? settings.streetLightIntensity : 0} color="#ffea88" distance={12} castShadow />
          </group>
        );
      })}
    </group>
  );
});

// ==================== DYNAMIC DAY/NIGHT SYSTEM ====================
const DayNightSystem = memo(({ settings, onDayUpdate }) => {
  const sunRef = useRef(); 
  const moonRef = useRef();
  const mainLightRef = useRef();
  const { scene } = useThree();
  const timeRef = useRef(0.2); 

  useFrame((_, delta) => {
    if (settings.isPaused) return;
    
    timeRef.current += delta * settings.daySpeed;
    if (timeRef.current > 1) timeRef.current = 0;
    const t = timeRef.current;
    
    const angle = t * Math.PI * 2 + Math.PI; 
    const radiusX = 60; 
    const radiusY = 35; 
    
    const sx = Math.cos(angle) * radiusX;
    const sy = Math.sin(angle) * radiusY;

    if (sunRef.current) sunRef.current.position.set(-sx, sy, -100);
    if (moonRef.current) moonRef.current.position.set(sx, -sy, -100);

    let skyColor, fogColor, ambientInt, mainLightInt;
    let isNight = false;

    if (t >= 0.0 && t < 0.12) { 
      skyColor = '#ff7e5f'; fogColor = '#ff9e7d'; ambientInt = 0.4; mainLightInt = 0.5;
    } else if (t >= 0.12 && t < 0.5) { 
      skyColor = '#7ec0ee'; fogColor = '#b8d4e3'; ambientInt = 0.7; mainLightInt = settings.sunIntensity;
    } else if (t >= 0.5 && t < 0.62) { 
      skyColor = '#fca55d'; fogColor = '#f39c12'; ambientInt = 0.5; mainLightInt = settings.sunIntensity * 0.6;
    } else if (t >= 0.62 && t < 0.75) { 
      skyColor = '#4a4e69'; fogColor = '#3d3a4e'; ambientInt = 0.3; mainLightInt = 0.2;
    } else { 
      skyColor = '#0b091a'; fogColor = '#050510'; ambientInt = 0.15; mainLightInt = settings.moonIntensity;
      isNight = true;
    }

    scene.background = new THREE.Color(skyColor);
    if (mainLightRef.current) {
      mainLightRef.current.intensity = mainLightInt;
      mainLightRef.current.position.set(-sx, sy, 20);
      mainLightRef.current.color.set(isNight ? '#c0c0ff' : '#fffbc8');
    }

    onDayUpdate?.(t, isNight, ambientInt, fogColor);
  });

  const starArray = useMemo(() => {
    return Array.from({ length: settings.starCount }, () => ({
      x: (Math.random() - 0.5) * 160, y: Math.random() * 30 + 15, z: -90 - Math.random() * 20, size: Math.random() * 0.1 + 0.05
    }));
  }, [settings.starCount]);

  return (
    <>
      <directionalLight ref={mainLightRef} castShadow shadow-mapSize-width={512} shadow-mapSize-height={512} />
      <mesh ref={sunRef}>
        <sphereGeometry args={[settings.sunSize, 32, 32]} />
        <meshBasicMaterial color={settings.sunColor} />
      </mesh>
      <mesh ref={moonRef}>
        <sphereGeometry args={[settings.moonSize, 32, 32]} />
        <meshBasicMaterial color={settings.moonColor} />
      </mesh>
      {timeRef.current > 0.62 || timeRef.current < 0.12 ? starArray.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}><sphereGeometry args={[s.size, 4, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>
      )) : null}
    </>
  );
});

// ==================== 3D CAR MODEL ====================
const CarModel = memo(({ position, color = '#00ff88', isPlayer = false, speed = 0, isNight, isPaused }) => {
  const ref = useRef(); const wheelRefs = useRef([]); const bodyRef = useRef();
  useFrame((_, delta) => {
    if (isPaused) return;
    if (ref.current && !isPlayer) {
      ref.current.position.z += speed * delta * 12;
      if (ref.current.position.z > 25) { ref.current.position.z = -25; ref.current.position.x = (Math.random() - 0.5) * 6; }
    }
    wheelRefs.current.forEach(w => { if (w) w.rotation.x += delta * 8; });
    if (isPlayer && bodyRef.current) {
      bodyRef.current.position.y = Math.sin(Date.now() * 0.008) * 0.04;
      bodyRef.current.rotation.z = Math.sin(Date.now() * 0.004) * 0.04;
    }
  });
  return (
    <group ref={ref} position={position}>
      <group ref={bodyRef}>
        <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2, 4]} /><meshBasicMaterial color="black" transparent opacity={0.3} /></mesh>
        <mesh castShadow position={[0, 0.25, 0]}><boxGeometry args={[1.8, 0.4, 3.5]} /><meshStandardMaterial color={color} metalness={0.7} roughness={0.3} /></mesh>
        <mesh castShadow position={[0, 0.7, -0.2]}><boxGeometry args={[1.4, 0.35, 1.8]} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.4} /></mesh>
        <mesh position={[0, 0.75, 0.6]} rotation={[0.3, 0, 0]}><boxGeometry args={[1.1, 0.25, 0.05]} /><meshPhysicalMaterial color="#1a1a3e" roughness={0.1} /></mesh>
        {[[-1, -0.1, 1.1], [1, -0.1, 1.1], [-1, -0.1, -1.1], [1, -0.1, -1.1]].map((pos, i) => (
          <group key={i} position={pos}>
            <mesh ref={el => wheelRefs.current[i] = el} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.25, 0.25, 0.15, 12]} /><meshStandardMaterial color="#111" /></mesh>
          </group>
        ))}
        <mesh position={[-0.4, 0.4, 1.8]}><boxGeometry args={[0.25, 0.12, 0.08]} /><meshBasicMaterial color="#ffeb3b" /></mesh>
        <mesh position={[0.4, 0.4, 1.8]}><boxGeometry args={[0.25, 0.12, 0.08]} /><meshBasicMaterial color="#ffeb3b" /></mesh>
        {isPlayer && isNight && (
          <>
            <spotLight position={[-0.4, 0.35, 2]} angle={0.45} penumbra={0.6} intensity={4} color="#ffffd0" target-position={[-0.4, -1, 15]} />
            <spotLight position={[0.4, 0.35, 2]} angle={0.45} penumbra={0.6} intensity={4} color="#ffffd0" target-position={[0.4, -1, 15]} />
          </>
        )}
      </group>
    </group>
  );
});

// ==================== ANIMATED ROAD ====================
const AnimatedRoad = memo(({ worldOffset }) => (
  <group position={[0, 0, worldOffset % 2.5]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow><planeGeometry args={[9, 120]} /><meshStandardMaterial color="#3a3a3a" roughness={0.8} /></mesh>
    {Array.from({ length: 50 }, (_, i) => (<mesh key={i} position={[0, -0.39, i * 2.5 - 50]}><boxGeometry args={[0.15, 0.01, 1.3]} /><meshBasicMaterial color="#ffd700" /></mesh>))}
    <mesh position={[-4.5, -0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.15, 120]} /><meshBasicMaterial color="#fff" /></mesh>
    <mesh position={[4.5, -0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.15, 120]} /><meshBasicMaterial color="#fff" /></mesh>
  </group>
));

// ==================== SETTINGS PANEL ====================
const SettingsPanel = memo(({ settings, onSettingsChange, onClose }) => (
  <div className="absolute top-20 right-4 bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl border border-gray-600 z-30 w-72 max-h-96 overflow-y-auto shadow-2xl text-white">
    <div className="flex justify-between mb-3"><h3 className="font-bold text-sm"><FaCog className="inline text-blue-400"/> Game Settings</h3><button onClick={onClose} className="text-gray-400 text-lg">✕</button></div>
    <div className="mb-2"><label className="text-xs text-gray-300">Game Speed</label><input type="range" min="0.5" max="2" step="0.1" value={settings.speed} onChange={e => onSettingsChange('speed', parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-600 rounded-lg accent-green-500" /></div>
    <div className="mb-2"><label className="text-xs text-gray-300">Day/Night Speed</label><input type="range" min="0.002" max="0.03" step="0.001" value={settings.daySpeed} onChange={e => onSettingsChange('daySpeed', parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-600 rounded-lg accent-yellow-500" /></div>
    <div className="mb-2 flex items-center justify-between"><span className="text-xs text-gray-300"><FaCity className="inline mr-1"/> Show City</span><button onClick={() => onSettingsChange('showCity', !settings.showCity)} className={`w-10 h-5 rounded-full ${settings.showCity ? 'bg-green-500' : 'bg-gray-600'} relative`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${settings.showCity ? 'left-5' : 'left-0.5'}`} /></button></div>
    {settings.showCity && <div className="mb-2"><label className="text-xs text-gray-300">Buildings</label><input type="range" min="5" max="25" step="1" value={settings.buildingCount} onChange={e => onSettingsChange('buildingCount', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-600 rounded-lg accent-purple-500" /></div>}
    <div className="mb-2 flex items-center justify-between"><span className="text-xs text-gray-300">🏞️ Nature Environment</span><button onClick={() => onSettingsChange('scenery', !settings.scenery)} className={`w-10 h-5 rounded-full ${settings.scenery ? 'bg-green-500' : 'bg-gray-600'} relative`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${settings.scenery ? 'left-5' : 'left-0.5'}`} /></button></div>
    <div className="mb-2 flex items-center justify-between"><span className="text-xs text-gray-300"><FaMusic className="inline text-pink-400"/> Music</span><button onClick={() => onSettingsChange('music', !settings.music)} className={`w-10 h-5 rounded-full ${settings.music ? 'bg-green-500' : 'bg-gray-600'} relative`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${settings.music ? 'left-5' : 'left-0.5'}`} /></button></div>
  </div>
));

// ==================== MAIN CAR GAME component ====================
const CarGame3D = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false); 
  const [level, setLevel] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    speed: 1, music: false, scenery: true, difficulty: 'Normal',
    daySpeed: 0.005, fogDensity: 0.2, starCount: 80, 
    sunSize: 3.5, sunIntensity: 2.2, moonSize: 2.2, moonIntensity: 0.4,
    sunColor: '#ffea88', moonColor: '#f5f5dc',
    showCity: true, buildingCount: 12, windowGlowColor: '#ffea88',
    showStreetLights: true, streetLightIntensity: 1.5
  });
  
  const [dayCycle, setDayCycle] = useState(0.2); 
  const [isNightTime, setIsNightTime] = useState(false);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.5);
  const [currentFogColor, setCurrentFogColor] = useState('#b8d4e3');

  const playerPos = useRef({ x: 0 });
  const keys = useRef({});
  const enemies = useRef([]);
  const enemyRefs = useRef([]);
  const bgMusic = useRef(null);
  const worldOffset = useRef(0);
  const worldSpeed = useRef(0.12);

  useEffect(() => { bgMusic.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); bgMusic.current.loop = true; bgMusic.current.volume = 0.25; return () => bgMusic.current?.pause(); }, []);
  
  useEffect(() => { 
    if (settings.music && !isPaused && !gameOver) bgMusic.current?.play().catch(() => { }); 
    else bgMusic.current?.pause(); 
  }, [settings.music, isPaused, gameOver]);

  const initEnemies = useCallback((count, diffMult) => {
    const colors = ['#e74c3c','#3498db','#f1c40f','#2ecc71','#9b59b6','#e67e22'];
    enemies.current = Array.from({ length: count }, (_, i) => ({
      id: i, x: (Math.random() - 0.5) * 6, z: -i * 14 - Math.random() * 12,
      speed: (Math.random() * 0.35 + 0.12) * diffMult, color: colors[i % colors.length]
    }));
  }, []);

  useEffect(() => { const dm = settings.difficulty === 'Easy' ? 0.25 : settings.difficulty === 'Hard' ? 1.1 : 0.7; initEnemies(3, dm); }, [settings.difficulty, initEnemies]);

  useEffect(() => {
    const down = e => { 
      if (e.key === ' ') { e.preventDefault(); setIsPaused(p => !p); } 
      if (e.key === 'a' || e.key === 'ArrowLeft') keys.current.left = true; 
      if (e.key === 'd' || e.key === 'ArrowRight') keys.current.right = true; 
      if ((e.key === 'r' || e.key === 'Enter') && gameOver) restartGame(); 
    };
    const up = e => { 
      if (e.key === 'a' || e.key === 'ArrowLeft') keys.current.left = false; 
      if (e.key === 'd' || e.key === 'ArrowRight') keys.current.right = false; 
    };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    const interval = setInterval(() => {
      setScore(s => {
        const ns = s + 1;
        if (ns % 500 === 0 && level < 11) {
          setLevel(l => {
            const nl = l + 1; worldSpeed.current += 0.015;
            const nc = Math.min(3 + nl, 12);
            const dm = settings.difficulty === 'Easy' ? 0.25 : settings.difficulty === 'Hard' ? 1.1 : 0.7;
            initEnemies(nc, dm);
            return nl;
          });
        }
        return ns;
      });
      worldOffset.current += worldSpeed.current * settings.speed;
      if (keys.current.left) playerPos.current.x -= 0.18;
      if (keys.current.right) playerPos.current.x += 0.18;
      playerPos.current.x = Math.max(-3.5, Math.min(3.5, playerPos.current.x));
      const sm = settings.speed * (settings.difficulty === 'Easy' ? 0.25 : settings.difficulty === 'Hard' ? 1.2 : 0.7);
      const cz = settings.difficulty === 'Easy' ? 0.7 : settings.difficulty === 'Hard' ? 1.4 : 1.1;
      const cx = settings.difficulty === 'Easy' ? 0.35 : settings.difficulty === 'Hard' ? 0.8 : 0.55;
      enemies.current.forEach((enemy, i) => {
        enemy.z += (enemy.speed * 0.08 + worldSpeed.current * 0.5) * sm;
        if (enemy.z > 15) { enemy.z = -25 - Math.random() * 18; enemy.x = (Math.random() - 0.5) * 6; enemy.speed = Math.random() * 0.35 + 0.12 + level * 0.012; }
        if (enemyRefs.current[i]) { enemyRefs.current[i].position.x = enemy.x; enemyRefs.current[i].position.z = enemy.z; }
        if (Math.abs(enemy.z - 7) < cz && Math.abs(enemy.x - playerPos.current.x) < cx) setGameOver(true);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [gameOver, isPaused, level, settings.speed, settings.difficulty, initEnemies]);

  const restartGame = () => { setGameOver(false); setIsPaused(false); setScore(0); setLevel(1); worldSpeed.current = 0.12; worldOffset.current = 0; playerPos.current.x = 0; const dm = settings.difficulty === 'Easy' ? 0.25 : settings.difficulty === 'Hard' ? 1.1 : 0.7; initEnemies(3, dm); };

  const handleDayUpdate = useCallback((t, isNight, ambientInt, fColor) => {
    setDayCycle(t);
    setIsNightTime(isNight);
    setAmbientLightIntensity(ambientInt);
    setCurrentFogColor(fColor);
  }, []);

  const combinedSettings = useMemo(() => ({ ...settings, isPaused }), [settings, isPaused]);

  // CRITICAL FIX: args এর বদলে ডিরেক্ট প্রোপার্টি ব্যবহার করা হয়েছে যাতে ফগ ক্র্যাশ না করে
  const fogNear = 45;
  const fogFar = 130;

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden select-none">
      <Canvas shadows camera={{ position: [0, 4.5, 11], fov: 65 }}>
        <DayNightSystem settings={combinedSettings} onDayUpdate={handleDayUpdate} />
        <SceneryGroup worldOffset={worldOffset.current} showScenery={settings.scenery} dayCycle={dayCycle} settings={settings} />
        
        {/* 🌫️ Fixed Fog Property Tag */}
        <fog attach="fog" color={currentFogColor} near={fogNear} far={fogFar} />
        
        <ambientLight intensity={ambientLightIntensity} />
        <hemisphereLight args={['#ffffff', '#234a18', 0.3]} />
        
        <AnimatedRoad worldOffset={worldOffset.current} />
        
        <group position={[playerPos.current.x, 0.5, 7]}>
          <CarModel position={[0, 0, 0]} color="#00ff88" isPlayer={true} isNight={isNightTime} isPaused={isPaused} />
        </group>
        
        {enemies.current.map((enemy, i) => (
          <group key={i} ref={el => enemyRefs.current[i] = el} position={[enemy.x, 0.5, enemy.z]}>
            <CarModel position={[0, 0, 0]} color={enemy.color} speed={enemy.speed} isNight={isNightTime} isPaused={isPaused} />
          </group>
        ))}
        
        {/* 🟩 Base Ground (Grass) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]} receiveShadow>
          <planeGeometry args={[120, 300]} />
          <meshStandardMaterial color="#27ae60" roughness={0.9} />
        </mesh>
      </Canvas>

      {/* Control Buttons & Panels */}
      <button onClick={() => setShowSettings(!showSettings)} className="absolute top-4 right-4 z-30 bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full shadow-xl"><FaCog className="text-2xl" /></button>
      {showSettings && <SettingsPanel settings={settings} onSettingsChange={(k, v) => setSettings(p => ({ ...p, [k]: v }))} onClose={() => setShowSettings(false)} />}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 px-5 py-2 rounded-full font-bold text-white shadow-xl text-sm">⭐ {score}</span>
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full font-bold text-white shadow-xl text-sm">🎯 Lv {level}/11</span>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6">
        <button onMouseDown={() => keys.current.left = true} onMouseUp={() => keys.current.left = false} onTouchStart={() => keys.current.left = true} onTouchEnd={() => keys.current.left = false} className="bg-blue-500/80 hover:bg-blue-400 text-white p-4 rounded-2xl text-3xl font-bold shadow-xl active:scale-90 transition-all">⬅️</button>
        
        <button onClick={() => setIsPaused(p => !p)} className="bg-amber-500/90 hover:bg-amber-400 text-white px-5 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl text-sm active:scale-90 transition-all">
          {isPaused ? <FaPlay /> : <FaPause />} {isPaused ? "RESUME" : "PAUSE"}
        </button>

        <button onMouseDown={() => keys.current.right = true} onMouseUp={() => keys.current.right = false} onTouchStart={() => keys.current.right = true} onTouchEnd={() => keys.current.right = false} className="bg-blue-500/80 hover:bg-blue-400 text-white p-4 rounded-2xl text-3xl font-bold shadow-xl active:scale-90 transition-all">➡️</button>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/50 text-xs z-10 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">Space to Pause | A/D or ←→</div>

      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="text-center bg-gray-900/90 p-8 rounded-3xl border border-amber-500/40 shadow-2xl">
            <h2 className="text-4xl font-bold text-amber-400 mb-4 animate-pulse">⏸️ GAME PAUSED</h2>
            <button onClick={() => setIsPaused(false)} className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-3 rounded-full text-lg font-bold transition-all shadow-lg active:scale-95">▶️ Resume Game</button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-20">
          <div className="text-center bg-gray-900/80 p-10 rounded-3xl border border-red-500/30">
            <h2 className="text-5xl font-bold text-red-500 mb-2">💥 Crash!</h2>
            <p className="text-yellow-400 text-3xl font-bold mb-2">⭐ {score}</p>
            <p className="text-purple-400 text-lg mb-6">Level {level}/11</p>
            <button onClick={restartGame} className="bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-full text-xl font-bold transition-all shadow-xl">🔄 Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarGame3D;
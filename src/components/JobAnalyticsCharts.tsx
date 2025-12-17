import React, { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox, Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { format, parse } from 'date-fns';
import * as THREE from 'three';

interface JobData {
  date: string;
  role: string;
  term: string;
  duties: string;
  requiredExperience: string;
  requiredSkills: string;
  additionalRequirements: string;
  comments: string;
  workType: string;
  company: string;
  recruiterEmail: string;
  recruiterPhone: string;
  strategy: string;
  earningEstimate: string;
  location: string;
}

interface JobAnalyticsChartsProps {
  data: JobData[];
  onRoleFilterClick: (role: string) => void;
  onCountryFilterClick: (country: string) => void;
  onDateRangeClick: (startDate: Date, endDate: Date) => void;
}

// Parse date helper
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const formats = ['yyyy-MM-dd', 'yyyy-M-d', 'MM/dd/yyyy', 'M/d/yyyy'];
  for (const fmt of formats) {
    try {
      const parsed = parse(dateStr, fmt, new Date());
      if (!isNaN(parsed.getTime())) return parsed;
    } catch {
      continue;
    }
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

// Auto-categorize role
const categorizeRole = (role: string): string => {
  const roleLower = role.toLowerCase();
  if (roleLower.includes('fintech') || roleLower.includes('finance') || roleLower.includes('financial')) {
    return 'FinTech';
  }
  if (roleLower.includes('bi') || roleLower.includes('business intelligence') || roleLower.includes('data') || roleLower.includes('analytics')) {
    return 'BI/Data';
  }
  if (roleLower.includes('ai') || roleLower.includes('artificial') || roleLower.includes('machine learning') || roleLower.includes('ml')) {
    return 'AI/ML';
  }
  if (roleLower.includes('pm') || roleLower.includes('project manager') || roleLower.includes('product manager') || roleLower.includes('program')) {
    return 'PM';
  }
  return 'Other';
};

// Extract country from location
const extractCountry = (location: string): string => {
  if (!location) return 'Unknown';
  const loc = location.toUpperCase();
  if (loc.includes('CANADA') || loc.includes(', CA') || loc.endsWith(' CA')) {
    return 'Canada';
  }
  if (loc.includes('USA') || loc.includes('UNITED STATES') || loc.includes(', US') || loc.endsWith(' US')) {
    return 'USA';
  }
  return 'Other';
};

const chartColors = {
  pm: '#FFDD40',
  bi: '#00d4ff',
  fintech: '#8b5cf6',
  ai: '#22c55e',
  other: '#9ca3af',
  canada: '#dc2626',
  usa: '#3b82f6',
};

// 3D Bar Component with animation
function Bar3D({ 
  position, 
  height, 
  color, 
  label, 
  value, 
  onClick,
  index 
}: { 
  position: [number, number, number]; 
  height: number; 
  color: string; 
  label: string; 
  value: number;
  onClick: () => void;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      // Animate height on mount
      if (animatedHeight < height) {
        setAnimatedHeight(prev => Math.min(prev + 0.05, height));
      }
      // Hover effect
      meshRef.current.scale.x = hovered ? 1.1 : 1;
      meshRef.current.scale.z = hovered ? 1.1 : 1;
      // Subtle floating animation
      meshRef.current.position.y = animatedHeight / 2 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <RoundedBox args={[0.6, animatedHeight || 0.01, 0.6]} radius={0.05} smoothness={4}>
          <meshStandardMaterial
            color={color}
            metalness={0.3}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={hovered ? 0.4 : 0.1}
          />
        </RoundedBox>
      </mesh>
      {/* Glow effect */}
      <mesh position={[0, animatedHeight / 2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.15 : 0.05} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.18}
        color="white"
        anchorX="center"
        anchorY="top"
      >
        {label}
      </Text>
      {/* Value */}
      <Text
        position={[0, animatedHeight + 0.2, 0]}
        fontSize={0.22}
        color={color}
        anchorX="center"
        anchorY="bottom"
        fontWeight="bold"
      >
        {value.toString()}
      </Text>
    </group>
  );
}

// 3D Pie Slice Component
function PieSlice3D({
  startAngle,
  endAngle,
  color,
  label,
  value,
  onClick,
  index,
  total,
}: {
  startAngle: number;
  endAngle: number;
  color: string;
  label: string;
  value: number;
  onClick: () => void;
  index: number;
  total: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [animatedAngle, setAnimatedAngle] = useState(startAngle);

  useFrame((state) => {
    if (meshRef.current) {
      // Animate slice expansion
      if (animatedAngle < endAngle) {
        setAnimatedAngle(prev => Math.min(prev + 0.05, endAngle));
      }
      // Hover effect - pop out
      const targetZ = hovered ? 0.3 : 0;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
      // Rotation
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const radius = 1.2;
    s.moveTo(0, 0);
    s.absarc(0, 0, radius, startAngle, animatedAngle, false);
    s.lineTo(0, 0);
    return s;
  }, [startAngle, animatedAngle]);

  const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
  };

  // Calculate label position
  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = 1.6;
  const labelX = Math.cos(midAngle) * labelRadius;
  const labelY = Math.sin(midAngle) * labelRadius;

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.15}
        />
      </mesh>
      {/* Label */}
      <Text
        position={[labelX, 0.3, labelY]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {label}
      </Text>
      <Text
        position={[labelX, 0.5, labelY]}
        fontSize={0.18}
        color={color}
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
        fontWeight="bold"
      >
        {value.toString()}
      </Text>
    </group>
  );
}

// 3D Line Chart Point
function LinePoint3D({
  position,
  color,
  value,
  label,
  index,
}: {
  position: [number, number, number];
  color: string;
  value: number;
  label: string;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3 + index * 0.5) * 0.03;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh
          ref={meshRef}
          position={[0, position[1], 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <sphereGeometry args={[0.12, 32, 32]} />
          <MeshDistortMaterial
            color={color}
            speed={2}
            distort={hovered ? 0.3 : 0.1}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
      </Float>
      {/* Vertical line to base */}
      <mesh position={[0, position[1] / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, position[1], 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        rotation={[-Math.PI / 4, 0, 0]}
      >
        {label}
      </Text>
      {hovered && (
        <Text
          position={[0, position[1] + 0.3, 0]}
          fontSize={0.15}
          color="#FFDD40"
          anchorX="center"
        >
          {value.toString()}
        </Text>
      )}
    </group>
  );
}

// 3D Line connecting points using tube geometry
function Line3D({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const tubeGeometry = useMemo(() => {
    if (points.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 64, 0.03, 8, false);
  }, [points]);

  if (!tubeGeometry) return null;

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial 
        color={color} 
        metalness={0.5} 
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Scene Components
function RoleChart({ roleData, onClick }: { roleData: Record<string, number>; onClick: (role: string) => void }) {
  const entries = Object.entries(roleData).filter(([, v]) => v > 0);
  const maxValue = Math.max(...entries.map(([, v]) => v), 1);
  const colors = [chartColors.pm, chartColors.bi, chartColors.fintech, chartColors.ai, chartColors.other];

  return (
    <group position={[0, 0, 0]}>
      {entries.map(([label, value], i) => (
        <Bar3D
          key={label}
          position={[(i - (entries.length - 1) / 2) * 1, 0, 0]}
          height={(value / maxValue) * 2 + 0.2}
          color={colors[i % colors.length]}
          label={label}
          value={value}
          onClick={() => onClick(label)}
          index={i}
        />
      ))}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.25}
        color="#FFDD40"
        anchorX="center"
        fontWeight="bold"
      >
        Jobs by Role Type
      </Text>
    </group>
  );
}

function CountryChart({ countryData, onClick }: { countryData: Record<string, number>; onClick: (country: string) => void }) {
  const entries = Object.entries(countryData).filter(([, v]) => v > 0);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  const colors = [chartColors.canada, chartColors.usa, chartColors.other];

  let currentAngle = 0;
  const slices = entries.map(([label, value], i) => {
    const angle = (value / total) * Math.PI * 2;
    const slice = {
      label,
      value,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: colors[i % colors.length],
    };
    currentAngle += angle;
    return slice;
  });

  return (
    <group position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
      {slices.map((slice, i) => (
        <PieSlice3D
          key={slice.label}
          startAngle={slice.startAngle}
          endAngle={slice.endAngle}
          color={slice.color}
          label={slice.label}
          value={slice.value}
          onClick={() => onClick(slice.label)}
          index={i}
          total={total}
        />
      ))}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color="#FFDD40"
        anchorX="center"
        fontWeight="bold"
      >
        Jobs by Country
      </Text>
    </group>
  );
}

function TimelineChart({ 
  timelineData, 
  onClick 
}: { 
  timelineData: { labels: string[]; counts: number[] }; 
  onClick: (label: string) => void;
}) {
  const maxValue = Math.max(...timelineData.counts, 1);
  const points: THREE.Vector3[] = timelineData.counts.map((count, i) => 
    new THREE.Vector3(
      (i - (timelineData.counts.length - 1) / 2) * 0.8,
      (count / maxValue) * 1.5 + 0.1,
      0
    )
  );

  return (
    <group position={[0, 0, 0]}>
      <Line3D points={points} color="#00d4ff" />
      {timelineData.labels.map((label, i) => (
        <LinePoint3D
          key={label}
          position={[
            (i - (timelineData.labels.length - 1) / 2) * 0.8,
            (timelineData.counts[i] / maxValue) * 1.5 + 0.1,
            0,
          ]}
          color="#FFDD40"
          value={timelineData.counts[i]}
          label={label}
          index={i}
        />
      ))}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.2}
        color="#FFDD40"
        anchorX="center"
        fontWeight="bold"
      >
        Jobs Over Time
      </Text>
      {/* Base line */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, timelineData.labels.length * 0.8, 8]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Floating particles background
function Particles() {
  const count = 50;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ],
        scale: Math.random() * 0.05 + 0.02,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      particles.forEach((particle, i) => {
        const matrix = new THREE.Matrix4();
        const y = particle.position[1] + Math.sin(state.clock.elapsedTime + i) * 0.5;
        matrix.setPosition(particle.position[0], y, particle.position[2]);
        matrix.scale(new THREE.Vector3(particle.scale, particle.scale, particle.scale));
        mesh.current!.setMatrixAt(i, matrix);
      });
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
    </instancedMesh>
  );
}

const JobAnalyticsCharts: React.FC<JobAnalyticsChartsProps> = ({
  data,
  onRoleFilterClick,
  onCountryFilterClick,
  onDateRangeClick,
}) => {
  const [activeChart, setActiveChart] = useState<'roles' | 'country' | 'timeline'>('roles');

  // Role Type distribution
  const roleData = useMemo(() => {
    const categories: Record<string, number> = { PM: 0, 'BI/Data': 0, FinTech: 0, 'AI/ML': 0, Other: 0 };
    data.forEach(job => {
      const category = categorizeRole(job.role);
      categories[category]++;
    });
    return categories;
  }, [data]);

  // Country distribution
  const countryData = useMemo(() => {
    const countries: Record<string, number> = { Canada: 0, USA: 0, Other: 0 };
    data.forEach(job => {
      const country = extractCountry(job.location);
      countries[country]++;
    });
    return countries;
  }, [data]);

  // Jobs over time
  const timelineData = useMemo(() => {
    const monthCounts: Record<string, number> = {};
    data.forEach(job => {
      const date = parseDate(job.date);
      if (date) {
        const monthKey = format(date, 'MMM yyyy');
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      }
    });
    
    const sortedEntries = Object.entries(monthCounts).sort((a, b) => {
      const dateA = parse(a[0], 'MMM yyyy', new Date());
      const dateB = parse(b[0], 'MMM yyyy', new Date());
      return dateA.getTime() - dateB.getTime();
    });
    
    return {
      labels: sortedEntries.map(([label]) => label),
      counts: sortedEntries.map(([, count]) => count),
    };
  }, [data]);

  const handleTimelineClick = (label: string) => {
    const date = parse(label, 'MMM yyyy', new Date());
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    onDateRangeClick(startOfMonth, endOfMonth);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="volumetric-glass rounded-3xl p-4 md:p-6 mb-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#FFDD40' }}>
        Job Analytics
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Click charts to filter • Drag to rotate • Scroll to zoom
      </p>

      {/* Chart Selection Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'roles', label: 'By Role' },
          { key: 'country', label: 'By Country' },
          { key: 'timeline', label: 'Timeline' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveChart(key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeChart === key
                ? 'bg-[#FFDD40] text-black shadow-lg shadow-[#FFDD40]/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="h-[300px] md:h-[350px] rounded-2xl overflow-hidden bg-gradient-to-b from-black/40 to-black/20 border border-white/10">
        <Canvas
          camera={{ position: [0, 2, 5], fov: 50 }}
          shadows
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
            <spotLight
              position={[0, 10, 0]}
              angle={0.3}
              penumbra={1}
              intensity={1}
              castShadow
              shadow-mapSize={1024}
            />
            
            <Particles />
            
            {activeChart === 'roles' && (
              <RoleChart roleData={roleData} onClick={onRoleFilterClick} />
            )}
            {activeChart === 'country' && (
              <CountryChart countryData={countryData} onClick={onCountryFilterClick} />
            )}
            {activeChart === 'timeline' && (
              <TimelineChart timelineData={timelineData} onClick={handleTimelineClick} />
            )}
            
            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={10}
              autoRotate
              autoRotateSpeed={0.5}
            />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:border-[#FFDD40]/30 transition-all">
          <div className="text-2xl font-bold" style={{ color: '#FFDD40' }}>{data.length}</div>
          <div className="text-xs text-muted-foreground">Total Jobs</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:border-[#dc2626]/30 transition-all">
          <div className="text-2xl font-bold" style={{ color: '#dc2626' }}>{countryData.Canada}</div>
          <div className="text-xs text-muted-foreground">Canada</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:border-[#3b82f6]/30 transition-all">
          <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{countryData.USA}</div>
          <div className="text-xs text-muted-foreground">USA</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:border-[#8b5cf6]/30 transition-all">
          <div className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{Object.keys(roleData).filter(k => roleData[k] > 0).length}</div>
          <div className="text-xs text-muted-foreground">Role Types</div>
        </div>
      </div>
    </div>
  );
};

export default JobAnalyticsCharts;

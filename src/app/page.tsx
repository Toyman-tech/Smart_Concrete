'use client';

import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import styles from './page.module.css';
import MetricCard from '@/components/MetricCard';
import PumpControl from '@/components/PumpControl';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

interface SensorData {
  ambient_humidity: number;
  ambient_temperature: number;
  internal_temperature: number;
  pump_status: boolean;
  web_mode: 'AUTO' | 'ON' | 'OFF';
}

export default function Home() {
  const [data, setData] = useState<SensorData | null>(null);
  const [controlWebMode, setControlWebMode] = useState<'AUTO' | 'ON' | 'OFF'>('AUTO');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // We assume the data exists at 'block_monitoring_system/data'
    const dataRef = ref(database, 'block_monitoring_system/data');
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
        setError(null);
      } else {
        setError("No data found at 'block_monitoring_system/data'");
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("Error connecting to Firebase. Check your configuration.");
      setLoading(false);
    });

    const controlRef = ref(database, 'block_monitoring_system/control/web_mode');
    const unsubscribeControl = onValue(controlRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setControlWebMode(val);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeControl();
    };
  }, []);

  const handleToggleMode = () => {
    let nextMode: 'AUTO' | 'ON' | 'OFF' = 'AUTO';
    
    if (controlWebMode === 'AUTO') {
      nextMode = 'ON';
    } else if (controlWebMode === 'ON') {
      nextMode = 'OFF';
    } else if (controlWebMode === 'OFF') {
      nextMode = 'AUTO';
    }

    const webModeRef = ref(database, 'block_monitoring_system/control/web_mode');
    set(webModeRef, nextMode).catch(err => {
      console.error("Failed to update web_mode", err);
      alert("Failed to update mode.");
    });
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className="layout-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
          <h2>Loading Dashboard...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className="layout-container">
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Smart Concrete</h1>
              <p className={styles.subtitle}>Real-time monitoring & pump control</p>
            </div>
            
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={styles.themeToggle}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            )}
          </div>
        </header>

        {error && (
          <div style={{ padding: '1rem', background: 'var(--danger-color)', color: '#fff', borderRadius: '8px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {data && (
          <>
            <div className={styles.dashboardGrid}>
              <MetricCard 
                title="Ambient Humidity" 
                value={data.ambient_humidity} 
                unit="%" 
                accentColor="var(--accent-color)"
              />
              <MetricCard 
                title="Ambient Temperature" 
                value={data.ambient_temperature} 
                unit="°C" 
                accentColor="var(--danger-color)"
              />
              <MetricCard 
                title="Internal Temperature" 
                value={data.internal_temperature} 
                unit="°C" 
                accentColor="var(--warning-color)"
              />
              <MetricCard 
                title="Pump Status" 
                value={data.pump_status ? 'ON' : 'OFF'} 
                isStatus={true}
                statusActive={data.pump_status}
              />
            </div>

            <div className={styles.controlSection}>
              <PumpControl 
                webMode={controlWebMode} 
                currentMode={data.web_mode}
                onToggleMode={handleToggleMode} 
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

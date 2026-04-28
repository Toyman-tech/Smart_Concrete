import React from 'react';
import styles from './PumpControl.module.css';

interface PumpControlProps {
  webMode: 'AUTO' | 'ON' | 'OFF';
  currentMode: 'AUTO' | 'ON' | 'OFF';
  onToggleMode: () => void;
}

export default function PumpControl({ webMode, currentMode, onToggleMode }: PumpControlProps) {
  const getBadgeClass = () => {
    switch (currentMode) {
      case 'ON': return styles.modeOn;
      case 'OFF': return styles.modeOff;
      default: return styles.modeAuto;
    }
  };

  const getButtonText = () => {
    switch (webMode) {
      case 'AUTO': return 'Turn Manual ON';
      case 'ON': return 'Turn Manual OFF';
      case 'OFF': return 'Set to AUTO';
      default: return 'Set to AUTO';
    }
  };

  const getButtonClass = () => {
    switch (webMode) {
      case 'AUTO': return styles.buttonOn;
      case 'ON': return styles.buttonOff;
      case 'OFF': return styles.buttonAuto;
      default: return styles.buttonAuto;
    }
  };

  return (
    <div className={`glass-panel ${styles.controlContainer}`}>
      <h2 className={styles.title}>Pump Control Override</h2>
      
      <div className={`${styles.modeBadge} ${getBadgeClass()}`}>
        Current Mode: {currentMode}
      </div>

      <button 
        className={`${styles.button} ${getButtonClass()}`}
        onClick={onToggleMode}
      >
        {getButtonText()}
      </button>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
        In AUTO mode, the hardware decides when to water the concrete based on sensor values.
      </p>
    </div>
  );
}

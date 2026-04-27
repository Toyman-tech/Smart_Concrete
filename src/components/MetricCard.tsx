import React from 'react';
import styles from './MetricCard.module.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  isStatus?: boolean;
  statusActive?: boolean;
  accentColor?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  unit, 
  isStatus = false, 
  statusActive = false,
  accentColor
}: MetricCardProps) {
  const cardStyle = accentColor ? { '--accent-color': accentColor } as React.CSSProperties : {};

  return (
    <div className={`glass-panel ${styles.card}`} style={cardStyle}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.valueContainer}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {isStatus && (
        <div className={`${styles.statusIndicator} ${statusActive ? styles.statusActive : styles.statusInactive}`}>
          {statusActive ? 'ACTIVE' : 'INACTIVE'}
        </div>
      )}
    </div>
  );
}

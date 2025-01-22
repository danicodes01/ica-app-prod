import styles from './station.module.css'
export function PixelClerk() {
    return (
      <svg viewBox="0 0 32 32" className={styles.pixelClerk}>
        {/* Base head */}
        <rect x="12" y="4" width="8" height="8" fill="#FFE0BD" />
        
        {/* Hair */}
        <rect x="11" y="3" width="10" height="3" fill="#4A4A4A" />
        <rect x="10" y="4" width="2" height="4" fill="#4A4A4A" />
        
        {/* Face Features */}
        <rect x="14" y="7" width="2" height="1" fill="#000000" /> {/* Eye */}
        <rect x="17" y="7" width="2" height="1" fill="#000000" /> {/* Eye */}
        <rect x="15" y="9" width="3" height="1" fill="#000000" /> {/* Mouth */}
        
        {/* Body/Uniform */}
        <rect x="11" y="12" width="10" height="12" fill="#36454F" /> {/* Shirt */}
        <rect x="11" y="12" width="10" height="2" fill="#FF0000" /> {/* Collar */}
        <rect x="13" y="13" width="6" height="1" fill="#FFFFFF" /> {/* Name Tag */}
        
        {/* Arms */}
        <rect x="9" y="12" width="2" height="8" fill="#FFE0BD" />
        <rect x="21" y="12" width="2" height="8" fill="#FFE0BD" />
        
        {/* Optional animation keyframes */}
        <animate
          attributeName="y"
          values="0;1;0"
          dur="2s"
          repeatCount="indefinite"
          begin="0s"
        />
      </svg>
    );
  }
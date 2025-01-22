import styles from './station.module.css';
import { IDBStation } from '@/types/models/planet';

interface StationClerkProps {
  station: IDBStation;
}

export function StationClerk({ station }: StationClerkProps) {
  return (
    <div className={styles.clerkDialogue}>
      <div className={styles.pixelClerkContainer}>
        {/* Bob the Space Trucker */}
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
        </svg>
        <div className={styles.nameTag}>BOB</div>
      </div>

      <div className={styles.dialogueContent}>
        <div className={styles.dialogueTitle}>* BOB the Space Trucker *</div>
        
        <div className={styles.dialogueText}>
          &quot;Hey there space cowboy... *sips coffee*
          <br />
          Lemme tell ya what needs fixin&apos; around here...&quot;
        </div>

        <div className={styles.taskSection}>
          <div className={styles.taskTitle}>TODAY`S TASK:</div>
          <div className={styles.taskDescription}>
            {station.description} 
            {station.challenge.instructions}
          </div>
        </div>

        <div className={styles.testSection}>
          <div className={styles.testTitle}>TEST REQUIREMENTS</div>
          <div className={styles.testCase}>
            <div className={styles.testInput}>
              Input: <span className={styles.codeText}>null</span>
            </div>
            <div className={styles.testExpected}>
              Expected: <span className={styles.codeText}>
                {"{"}&quot;planetsVisited&quot;: {"{"}&quot;type&quot;:&quot;array&quot;,&quot;length&quot;:3,&quot;elementType&quot;:&quot;string&quot;{"}"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
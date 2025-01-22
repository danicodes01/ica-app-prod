import { IDBStation } from "@/types/models/planet";
import styles from './station.module.css';
import { PixelClerk } from './pixel-clerk';

export function StationInstructions({ station }: { station: IDBStation }) {
  return (
    <div className={styles.instructionsPanel}>
      {/* Clerk Section */}
      <div className={styles.clerkScene}>
        <div className={styles.pixelClerkWrapper}>
          <PixelClerk />
          <div className={styles.nameTag}>BOB</div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.dialogContent}>
        <h1 className={styles.stationTitle}>
          BOB the Space Trucker
        </h1>
        
        <p className={styles.stationDescription}>
          &quot;Hey there space cowboy... *sips coffee*
          Lemme tell ya what needs fixin` around here...&quot;
        </p>

        <div className={styles.taskBox}>
          <h2 className="font-bold text-red-600 mb-2 underline">TODAY`S TASK:</h2>
          <div className="leading-7 text-xs">
            {station.challenge.instructions}
          </div>
        </div>

        {station.challenge.testCases.length > 0 && (
          <div className={styles.testCaseContainer}>
            <h3 className={styles.testCaseHeader}>TEST REQUIREMENTS</h3>
            <div className="space-y-4">
              {station.challenge.testCases.map((test, index) => (
                <div key={index} className={styles.testCase}>
                  <div>Input: <code>{JSON.stringify(test.input)}</code></div>
                  <div>Expected: <code>{JSON.stringify(test.expectedOutput)}</code></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}









// import { IDBStation } from "@/types/models/planet";
// import styles from './station.module.css'

// export function StationInstructions({ station }: { station: IDBStation }) {
//     return (
//       <div className={styles.instructionsPanel}>
//         <div className="npc-dialog">
//           <div className="npc-avatar">
//             <span className="text-2xl">🤖</span>
//           </div>
//           <h1 className="text-xl font-bold mb-2">{station.name}</h1>
//           <p className="text-gray-300 text-xs">{station.description}</p>
//         </div>
  
//         <div className="mb-6">
//           <h2 className="text-1xl font-semibold mb-4">Challenge</h2>
//           <div className="text-gray-300 text-xs">
//             {station.challenge.instructions}
//           </div>
//         </div>
  
//         {station.challenge.testCases.length > 0 && (
//           <div className="mb-8">
//             <h3 className="text-1xl font-semibold mb-4">Test Cases</h3>
//             <div className="space-y-4 text-xs">
//               {station.challenge.testCases.map((test, index) => (
//                 <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
//                   <div className="font-mono text-white text-sm bg-gray-700">Input: {JSON.stringify(test.input)}</div>
//                   <div className="font-mono text-white text-sm">Expected: {JSON.stringify(test.expectedOutput)}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
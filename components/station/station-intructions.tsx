import { IDBStation } from "@/types/models/planet";
import styles from './station.module.css'

export function StationInstructions({ station }: { station: IDBStation }) {
    return (
      <div className={styles.instructionsPanel}>
        <div className="npc-dialog">
          <div className="npc-avatar">
            <span className="text-2xl">🤖</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{station.name}</h1>
          <p className="text-gray-300">{station.description}</p>
        </div>
  
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Challenge</h2>
          <div className="text-gray-300">
            {station.challenge.instructions}
          </div>
        </div>
  
        {station.challenge.testCases.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Test Cases</h3>
            <div className="space-y-4">
              {station.challenge.testCases.map((test, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="font-mono text-sm">Input: {JSON.stringify(test.input)}</div>
                  <div className="font-mono text-sm">Expected: {JSON.stringify(test.expectedOutput)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
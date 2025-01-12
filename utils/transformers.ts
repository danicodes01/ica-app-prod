import { Planet as CanvasPlanet, PlanetPosition } from "@/types/game/canvas";
import { IDBPlanet } from "@/types/models/planet";

export const transformPlanetToCanvas = (
    dbPlanet: IDBPlanet, 
    position: PlanetPosition,
    userXP: number
): CanvasPlanet => ({
    id: dbPlanet._id.toString(),
    name: dbPlanet.name,
    type: dbPlanet.type,
    description: dbPlanet.description,
    position,
    isUnlocked: userXP >= dbPlanet.requiredXP,
    requiredXP: dbPlanet.requiredXP
});
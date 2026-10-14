/** Prüft ohne Build-Warnung, ob eine Sammlung Einträge hat. */
const stimmen = import.meta.glob('/src/content/stimmen/[!_]*.md');
export const hasStimmen = Object.keys(stimmen).length > 0;

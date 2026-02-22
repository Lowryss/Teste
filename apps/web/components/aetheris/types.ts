export interface AetherisTheme {
  id: string
  label: string
  subtitle?: string
  accentColor: string        // hex principal
  accentColorLight: string   // hex claro
  accentColorDark: string    // hex escuro
  glowColor: string          // hex para box-shadow glow
  symbol: string             // Unicode symbol
  cardCount: number
  costLabel: string
  oracleLabel: string
  oracleStatus: string       // texto no core, ex: "CALIBRATING DESTINY"
}

export type ReadingPhase = 'intro' | 'selection' | 'shuffling' | 'reading' | 'result'

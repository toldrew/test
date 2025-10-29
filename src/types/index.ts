export enum TournamentType {
  GROUPS = 'groups',
  PLAYOFF = 'playoff'
}

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Team {
  id: string
  name: string
  logo?: string
  stats?: {
    wins: number
    losses: number
    draws: number
    goalsFor: number
    goalsAgainst: number
    points: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface MatchResult {
  homeScore: number
  awayScore: number
  completedAt: Date
  notes?: string
}

export interface Match {
  id: string
  roundId: string
  groupId?: string
  homeTeamId: string | null // null for bye matches
  awayTeamId: string | null // null for bye matches
  scheduledDate?: Date
  location?: string
  status: MatchStatus
  result?: MatchResult
  roundNumber: number
  createdAt: Date
  updatedAt: Date
}

export interface Round {
  id: string
  tournamentId: string
  roundNumber: number
  name?: string
  matches: Match[]
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Group {
  id: string
  tournamentId: string
  name: string
  teamIds: string[]
  standings?: {
    teamId: string
    played: number
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
    goalDifference: number
    points: number
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface Tournament {
  id: string
  userId: string
  name: string
  type: TournamentType
  description?: string
  startDate?: Date
  endDate?: Date
  teamIds: string[]
  groups?: Group[]
  rounds: Round[]
  numberOfRounds: number // for round-robin: 1 = single, 2 = double, etc.
  matchDurationMinutes?: number
  defaultLocation?: string
  createdAt: Date
  updatedAt: Date
}

export interface TournamentStoreState {
  tournaments: Record<string, Tournament[]> // keyed by userId
  teams: Record<string, Team[]> // keyed by userId
  activeTournamentId: string | null
  currentUserId: string
}

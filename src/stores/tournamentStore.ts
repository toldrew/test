import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type {
  Tournament,
  Team,
  Match,
  MatchResult,
  TournamentType,
  TournamentStoreState
} from '@/types'
import {
  generateRoundRobinSchedule,
  assignTeamsToGroups,
  rescheduleMatches
} from '@/services/scheduler'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'tournament-store'
const STORAGE_VERSION = 1

interface StorageData {
  version: number
  state: TournamentStoreState
}

/**
 * Tournament Store
 * 
 * Manages tournaments, teams, and match schedules with localStorage persistence.
 * All data is keyed by userId (defaults to 'guest' until authentication is implemented).
 * 
 * Key Features:
 * - CRUD operations for tournaments and teams
 * - Round-robin schedule generation with configurable rounds
 * - Match result recording with automatic stats updates
 * - Automatic persistence to localStorage with debouncing
 * - Schema migration support for future updates
 * 
 * Usage:
 * ```typescript
 * const store = useTournamentStore()
 * 
 * // Create a tournament
 * const tournament = store.createTournament({
 *   name: 'Summer League',
 *   type: TournamentType.GROUPS,
 *   numberOfRounds: 2
 * })
 * 
 * // Add teams and generate schedule
 * const team = store.createTeam({ name: 'Team A' })
 * store.assignTeamsToTournament(tournament.id, [team.id])
 * 
 * // Record match results
 * store.recordMatchResult(matchId, { homeScore: 2, awayScore: 1 })
 * ```
 */
export const useTournamentStore = defineStore('tournament', () => {
  // State
  const tournaments = ref<Record<string, Tournament[]>>({})
  const teams = ref<Record<string, Team[]>>({})
  const activeTournamentId = ref<string | null>(null)
  const currentUserId = ref<string>('guest')

  // Debounce timer for localStorage saves
  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  // Load initial state from localStorage
  loadFromStorage()

  // Watch for state changes and persist to localStorage
  watch(
    [tournaments, teams, activeTournamentId, currentUserId],
    () => {
      debouncedSave()
    },
    { deep: true }
  )

  // Getters
  const currentUserTournaments = computed(() => {
    return tournaments.value[currentUserId.value] || []
  })

  const currentUserTeams = computed(() => {
    return teams.value[currentUserId.value] || []
  })

  const activeTournament = computed(() => {
    if (!activeTournamentId.value) return null
    return currentUserTournaments.value.find(t => t.id === activeTournamentId.value) || null
  })

  const getTournamentById = computed(() => {
    return (id: string): Tournament | undefined => {
      return currentUserTournaments.value.find(t => t.id === id)
    }
  })

  const getTeamById = computed(() => {
    return (id: string): Team | undefined => {
      return currentUserTeams.value.find(t => t.id === id)
    }
  })

  const getMatchById = computed(() => {
    return (matchId: string): { tournament: Tournament; match: Match } | null => {
      for (const tournament of currentUserTournaments.value) {
        for (const round of tournament.rounds) {
          const match = round.matches.find(m => m.id === matchId)
          if (match) {
            return { tournament, match }
          }
        }
      }
      return null
    }
  })

  const getTournamentStats = computed(() => {
    return (tournamentId: string) => {
      const tournament = getTournamentById.value(tournamentId)
      if (!tournament) return null

      const totalMatches = tournament.rounds.reduce((sum, r) => sum + r.matches.length, 0)
      const completedMatches = tournament.rounds.reduce(
        (sum, r) => sum + r.matches.filter(m => m.status === 'completed').length,
        0
      )

      return {
        totalTeams: tournament.teamIds.length,
        totalMatches,
        completedMatches,
        upcomingMatches: totalMatches - completedMatches,
        progress: totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0
      }
    }
  })

  // Actions

  /**
   * Creates a new tournament
   */
  function createTournament(data: {
    name: string
    type: TournamentType
    description?: string
    numberOfRounds?: number
    startDate?: Date
    matchDurationMinutes?: number
    defaultLocation?: string
  }): Tournament {
    const tournament: Tournament = {
      id: uuidv4(),
      userId: currentUserId.value,
      name: data.name,
      type: data.type,
      description: data.description,
      startDate: data.startDate,
      numberOfRounds: data.numberOfRounds || 1,
      matchDurationMinutes: data.matchDurationMinutes,
      defaultLocation: data.defaultLocation,
      teamIds: [],
      rounds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (!tournaments.value[currentUserId.value]) {
      tournaments.value[currentUserId.value] = []
    }

    tournaments.value[currentUserId.value].push(tournament)
    return tournament
  }

  /**
   * Updates tournament metadata (name, dates, etc.)
   */
  function updateTournamentMeta(
    tournamentId: string,
    updates: Partial<Pick<Tournament, 'name' | 'description' | 'startDate' | 'endDate' | 'defaultLocation'>>
  ): void {
    const tournament = getTournamentById.value(tournamentId)
    if (!tournament) return

    Object.assign(tournament, updates, { updatedAt: new Date() })
  }

  /**
   * Deletes a tournament
   */
  function deleteTournament(tournamentId: string): void {
    const userTournaments = tournaments.value[currentUserId.value]
    if (!userTournaments) return

    const index = userTournaments.findIndex(t => t.id === tournamentId)
    if (index !== -1) {
      userTournaments.splice(index, 1)
    }

    if (activeTournamentId.value === tournamentId) {
      activeTournamentId.value = null
    }
  }

  /**
   * Creates a new team
   */
  function createTeam(data: { name: string; logo?: string }): Team {
    const team: Team = {
      id: uuidv4(),
      name: data.name,
      logo: data.logo,
      stats: {
        wins: 0,
        losses: 0,
        draws: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (!teams.value[currentUserId.value]) {
      teams.value[currentUserId.value] = []
    }

    teams.value[currentUserId.value].push(team)
    return team
  }

  /**
   * Updates a team
   */
  function updateTeam(teamId: string, updates: Partial<Pick<Team, 'name' | 'logo'>>): void {
    const team = getTeamById.value(teamId)
    if (!team) return

    Object.assign(team, updates, { updatedAt: new Date() })
  }

  /**
   * Deletes a team
   */
  function deleteTeam(teamId: string): void {
    const userTeams = teams.value[currentUserId.value]
    if (!userTeams) return

    const index = userTeams.findIndex(t => t.id === teamId)
    if (index !== -1) {
      userTeams.splice(index, 1)
    }

    // Remove team from all tournaments
    for (const tournament of currentUserTournaments.value) {
      const teamIndex = tournament.teamIds.indexOf(teamId)
      if (teamIndex !== -1) {
        tournament.teamIds.splice(teamIndex, 1)
        // Regenerate schedule if teams changed
        if (tournament.rounds.length > 0) {
          regenerateTournamentSchedule(tournament.id)
        }
      }
    }
  }

  /**
   * Assigns teams to a tournament and generates the schedule
   */
  function assignTeamsToTournament(tournamentId: string, teamIds: string[]): void {
    const tournament = getTournamentById.value(tournamentId)
    if (!tournament) return

    tournament.teamIds = [...teamIds]
    tournament.updatedAt = new Date()

    // Generate schedule
    regenerateTournamentSchedule(tournamentId)
  }

  /**
   * Regenerates the match schedule for a tournament
   */
  function regenerateTournamentSchedule(tournamentId: string): void {
    const tournament = getTournamentById.value(tournamentId)
    if (!tournament || tournament.teamIds.length < 2) return

    const tournamentTeams = tournament.teamIds
      .map(id => getTeamById.value(id))
      .filter((t): t is Team => t !== undefined)

    const schedule = generateRoundRobinSchedule({
      tournamentId: tournament.id,
      teams: tournamentTeams,
      numberOfRounds: tournament.numberOfRounds,
      startDate: tournament.startDate,
      matchDurationMinutes: tournament.matchDurationMinutes,
      defaultLocation: tournament.defaultLocation
    })

    tournament.rounds = schedule.rounds
    tournament.updatedAt = new Date()
  }

  /**
   * Updates match schedule (reschedule matches)
   */
  function updateMatchSchedule(
    tournamentId: string,
    newStartDate: Date,
    matchDurationMinutes?: number
  ): void {
    const tournament = getTournamentById.value(tournamentId)
    if (!tournament) return

    tournament.rounds = rescheduleMatches(
      tournament.rounds,
      newStartDate,
      matchDurationMinutes || tournament.matchDurationMinutes
    )
    tournament.startDate = newStartDate
    tournament.updatedAt = new Date()
  }

  /**
   * Updates match details (date, time, location)
   */
  function updateMatch(
    matchId: string,
    updates: Partial<Pick<Match, 'scheduledDate' | 'location'>>
  ): void {
    const matchData = getMatchById.value(matchId)
    if (!matchData) return

    const { tournament, match } = matchData

    Object.assign(match, updates, { updatedAt: new Date() })
    tournament.updatedAt = new Date()
  }

  /**
   * Records a match result and updates team stats
   */
  function recordMatchResult(matchId: string, result: Omit<MatchResult, 'completedAt'>): void {
    const matchData = getMatchById.value(matchId)
    if (!matchData) return

    const { tournament, match } = matchData

    // Update match with result
    match.result = {
      ...result,
      completedAt: new Date()
    }
    match.status = 'completed'
    match.updatedAt = new Date()

    // Update team stats
    if (match.homeTeamId && match.awayTeamId) {
      updateTeamStats(match.homeTeamId, match.awayTeamId, result.homeScore, result.awayScore)
    }

    tournament.updatedAt = new Date()
  }

  /**
   * Updates stats for both teams based on match result
   */
  function updateTeamStats(
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number
  ): void {
    const homeTeam = getTeamById.value(homeTeamId)
    const awayTeam = getTeamById.value(awayTeamId)

    if (!homeTeam?.stats || !awayTeam?.stats) return

    // Update goals
    homeTeam.stats.goalsFor += homeScore
    homeTeam.stats.goalsAgainst += awayScore
    awayTeam.stats.goalsFor += awayScore
    awayTeam.stats.goalsAgainst += homeScore

    // Determine winner and update records
    if (homeScore > awayScore) {
      homeTeam.stats.wins += 1
      homeTeam.stats.points += 3
      awayTeam.stats.losses += 1
    } else if (awayScore > homeScore) {
      awayTeam.stats.wins += 1
      awayTeam.stats.points += 3
      homeTeam.stats.losses += 1
    } else {
      homeTeam.stats.draws += 1
      homeTeam.stats.points += 1
      awayTeam.stats.draws += 1
      awayTeam.stats.points += 1
    }

    homeTeam.updatedAt = new Date()
    awayTeam.updatedAt = new Date()
  }

  /**
   * Sets the active tournament
   */
  function setActiveTournament(tournamentId: string | null): void {
    activeTournamentId.value = tournamentId
  }

  /**
   * Creates groups for a tournament and assigns teams
   */
  function createTournamentGroups(tournamentId: string, numberOfGroups: number): void {
    const tournament = getTournamentById.value(tournamentId)
    if (!tournament || tournament.teamIds.length === 0) return

    const tournamentTeams = tournament.teamIds
      .map(id => getTeamById.value(id))
      .filter((t): t is Team => t !== undefined)

    tournament.groups = assignTeamsToGroups(tournamentTeams, numberOfGroups, tournamentId)
    tournament.updatedAt = new Date()
  }

  /**
   * Loads state from localStorage
   */
  function loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const data: StorageData = JSON.parse(raw, (key, value) => {
        // Convert ISO date strings back to Date objects
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value)
        }
        return value
      })

      // Check version and migrate if needed
      if (data.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, migration may be needed')
        // Future: implement migration logic here
      }

      tournaments.value = data.state.tournaments || {}
      teams.value = data.state.teams || {}
      activeTournamentId.value = data.state.activeTournamentId || null
      currentUserId.value = data.state.currentUserId || 'guest'
    } catch (error) {
      console.error('Failed to load tournament store from localStorage:', error)
    }
  }

  /**
   * Saves state to localStorage with debouncing
   */
  function debouncedSave(): void {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    saveTimeout = setTimeout(() => {
      saveToStorage()
    }, 500) // 500ms debounce
  }

  /**
   * Saves state to localStorage immediately
   */
  function saveToStorage(): void {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        state: {
          tournaments: tournaments.value,
          teams: teams.value,
          activeTournamentId: activeTournamentId.value,
          currentUserId: currentUserId.value
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save tournament store to localStorage:', error)
    }
  }

  /**
   * Clears all data (useful for testing or reset)
   */
  function clearAllData(): void {
    tournaments.value = {}
    teams.value = {}
    activeTournamentId.value = null
    currentUserId.value = 'guest'
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    // State
    tournaments,
    teams,
    activeTournamentId,
    currentUserId,

    // Getters
    currentUserTournaments,
    currentUserTeams,
    activeTournament,
    getTournamentById,
    getTeamById,
    getMatchById,
    getTournamentStats,

    // Actions
    createTournament,
    updateTournamentMeta,
    deleteTournament,
    createTeam,
    updateTeam,
    deleteTeam,
    assignTeamsToTournament,
    regenerateTournamentSchedule,
    updateMatchSchedule,
    updateMatch,
    recordMatchResult,
    setActiveTournament,
    createTournamentGroups,
    clearAllData
  }
})

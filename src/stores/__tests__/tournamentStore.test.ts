import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTournamentStore } from '../tournamentStore'
import { TournamentType } from '@/types'

describe('Tournament Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Team Management', () => {
    it('should create a team', () => {
      const store = useTournamentStore()
      const team = store.createTeam({ name: 'Team A' })

      expect(team.id).toBeDefined()
      expect(team.name).toBe('Team A')
      expect(team.stats).toBeDefined()
      expect(team.stats?.wins).toBe(0)
      expect(store.currentUserTeams).toHaveLength(1)
    })

    it('should update a team', () => {
      const store = useTournamentStore()
      const team = store.createTeam({ name: 'Team A' })

      store.updateTeam(team.id, { name: 'Team B' })
      
      const updatedTeam = store.getTeamById(team.id)
      expect(updatedTeam?.name).toBe('Team B')
    })

    it('should delete a team', () => {
      const store = useTournamentStore()
      const team = store.createTeam({ name: 'Team A' })

      expect(store.currentUserTeams).toHaveLength(1)
      
      store.deleteTeam(team.id)
      
      expect(store.currentUserTeams).toHaveLength(0)
      expect(store.getTeamById(team.id)).toBeUndefined()
    })
  })

  describe('Tournament Management', () => {
    it('should create a tournament', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS,
        numberOfRounds: 2
      })

      expect(tournament.id).toBeDefined()
      expect(tournament.name).toBe('Summer League')
      expect(tournament.type).toBe(TournamentType.GROUPS)
      expect(tournament.numberOfRounds).toBe(2)
      expect(store.currentUserTournaments).toHaveLength(1)
    })

    it('should update tournament metadata', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS
      })

      store.updateTournamentMeta(tournament.id, { name: 'Winter League' })
      
      const updated = store.getTournamentById(tournament.id)
      expect(updated?.name).toBe('Winter League')
    })

    it('should delete a tournament', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS
      })

      store.deleteTournament(tournament.id)
      
      expect(store.currentUserTournaments).toHaveLength(0)
      expect(store.getTournamentById(tournament.id)).toBeUndefined()
    })

    it('should set active tournament', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS
      })

      store.setActiveTournament(tournament.id)
      
      expect(store.activeTournament?.id).toBe(tournament.id)
      expect(store.activeTournament?.name).toBe('Summer League')
    })
  })

  describe('Schedule Generation', () => {
    it('should generate schedule when assigning teams', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS,
        numberOfRounds: 1
      })

      const team1 = store.createTeam({ name: 'Team A' })
      const team2 = store.createTeam({ name: 'Team B' })
      const team3 = store.createTeam({ name: 'Team C' })
      const team4 = store.createTeam({ name: 'Team D' })

      store.assignTeamsToTournament(tournament.id, [team1.id, team2.id, team3.id, team4.id])

      const updated = store.getTournamentById(tournament.id)
      expect(updated?.teamIds).toHaveLength(4)
      expect(updated?.rounds).toHaveLength(3) // 4 teams = 3 rounds in single round-robin
      
      const totalMatches = updated?.rounds.reduce((sum, r) => sum + r.matches.length, 0) || 0
      expect(totalMatches).toBe(6) // 4 teams = 6 matches total
    })

    it('should regenerate schedule when teams change', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS,
        numberOfRounds: 1
      })

      const team1 = store.createTeam({ name: 'Team A' })
      const team2 = store.createTeam({ name: 'Team B' })

      store.assignTeamsToTournament(tournament.id, [team1.id, team2.id])

      let updated = store.getTournamentById(tournament.id)
      expect(updated?.rounds).toHaveLength(1)

      const team3 = store.createTeam({ name: 'Team C' })
      store.assignTeamsToTournament(tournament.id, [team1.id, team2.id, team3.id])

      updated = store.getTournamentById(tournament.id)
      expect(updated?.rounds).toHaveLength(3) // 3 teams = 3 rounds
    })

    it('should update match schedule dates', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS,
        numberOfRounds: 1,
        startDate: new Date('2024-01-01')
      })

      const team1 = store.createTeam({ name: 'Team A' })
      const team2 = store.createTeam({ name: 'Team B' })

      store.assignTeamsToTournament(tournament.id, [team1.id, team2.id])

      const newStartDate = new Date('2024-02-01')
      store.updateMatchSchedule(tournament.id, newStartDate)

      const updated = store.getTournamentById(tournament.id)
      expect(updated?.startDate).toEqual(newStartDate)
      expect(updated?.rounds[0].matches[0].scheduledDate).toEqual(newStartDate)
    })
  })

  describe('Match Results', () => {
    it('should record match result and update team stats', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS,
        numberOfRounds: 1
      })

      const team1 = store.createTeam({ name: 'Team A' })
      const team2 = store.createTeam({ name: 'Team B' })

      store.assignTeamsToTournament(tournament.id, [team1.id, team2.id])

      const updated = store.getTournamentById(tournament.id)
      const match = updated?.rounds[0].matches[0]
      
      if (match) {
        store.recordMatchResult(match.id, {
          homeScore: 2,
          awayScore: 1,
          notes: 'Great game!'
        })

        const homeTeam = store.getTeamById(match.homeTeamId!)
        const awayTeam = store.getTeamById(match.awayTeamId!)

        expect(homeTeam?.stats?.wins).toBe(1)
        expect(homeTeam?.stats?.goalsFor).toBe(2)
        expect(homeTeam?.stats?.goalsAgainst).toBe(1)
        expect(homeTeam?.stats?.points).toBe(3)

        expect(awayTeam?.stats?.losses).toBe(1)
        expect(awayTeam?.stats?.goalsFor).toBe(1)
        expect(awayTeam?.stats?.goalsAgainst).toBe(2)
        expect(awayTeam?.stats?.points).toBe(0)

        expect(match.status).toBe('completed')
        expect(match.result?.homeScore).toBe(2)
        expect(match.result?.awayScore).toBe(1)
      }
    })

    it('should handle draw results correctly', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS,
        numberOfRounds: 1
      })

      const team1 = store.createTeam({ name: 'Team A' })
      const team2 = store.createTeam({ name: 'Team B' })

      store.assignTeamsToTournament(tournament.id, [team1.id, team2.id])

      const updated = store.getTournamentById(tournament.id)
      const match = updated?.rounds[0].matches[0]
      
      if (match) {
        store.recordMatchResult(match.id, { homeScore: 1, awayScore: 1 })

        const homeTeam = store.getTeamById(match.homeTeamId!)
        const awayTeam = store.getTeamById(match.awayTeamId!)

        expect(homeTeam?.stats?.draws).toBe(1)
        expect(homeTeam?.stats?.points).toBe(1)

        expect(awayTeam?.stats?.draws).toBe(1)
        expect(awayTeam?.stats?.points).toBe(1)
      }
    })
  })

  describe('Tournament Stats', () => {
    it('should calculate tournament statistics', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS,
        numberOfRounds: 1
      })

      const team1 = store.createTeam({ name: 'Team A' })
      const team2 = store.createTeam({ name: 'Team B' })
      const team3 = store.createTeam({ name: 'Team C' })
      const team4 = store.createTeam({ name: 'Team D' })

      store.assignTeamsToTournament(tournament.id, [team1.id, team2.id, team3.id, team4.id])

      const stats = store.getTournamentStats(tournament.id)
      
      expect(stats?.totalTeams).toBe(4)
      expect(stats?.totalMatches).toBe(6)
      expect(stats?.completedMatches).toBe(0)
      expect(stats?.upcomingMatches).toBe(6)
      expect(stats?.progress).toBe(0)
    })

    it('should update progress as matches are completed', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS,
        numberOfRounds: 1
      })

      const team1 = store.createTeam({ name: 'Team A' })
      const team2 = store.createTeam({ name: 'Team B' })

      store.assignTeamsToTournament(tournament.id, [team1.id, team2.id])

      const updated = store.getTournamentById(tournament.id)
      const match = updated?.rounds[0].matches[0]
      
      if (match) {
        store.recordMatchResult(match.id, { homeScore: 2, awayScore: 1 })

        const stats = store.getTournamentStats(tournament.id)
        expect(stats?.completedMatches).toBe(1)
        expect(stats?.upcomingMatches).toBe(0)
        expect(stats?.progress).toBe(100)
      }
    })
  })

  describe('Groups', () => {
    it('should create tournament groups', () => {
      const store = useTournamentStore()
      const tournament = store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS,
        numberOfRounds: 1
      })

      const teams = Array.from({ length: 8 }, (_, i) => 
        store.createTeam({ name: `Team ${i + 1}` })
      )

      store.assignTeamsToTournament(tournament.id, teams.map(t => t.id))
      store.createTournamentGroups(tournament.id, 2)

      const updated = store.getTournamentById(tournament.id)
      expect(updated?.groups).toHaveLength(2)
      expect(updated?.groups?.[0].name).toBe('Group A')
      expect(updated?.groups?.[1].name).toBe('Group B')
      
      const totalTeamsInGroups = (updated?.groups?.[0].teamIds.length || 0) + 
                                  (updated?.groups?.[1].teamIds.length || 0)
      expect(totalTeamsInGroups).toBe(8)
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should persist data to localStorage', () => {
      const store = useTournamentStore()
      store.createTeam({ name: 'Team A' })
      store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS
      })

      // Wait for debounced save
      return new Promise(resolve => {
        setTimeout(() => {
          const data = localStorage.getItem('tournament-store')
          expect(data).toBeTruthy()
          
          const parsed = JSON.parse(data!)
          expect(parsed.version).toBe(1)
          expect(parsed.state.teams.guest).toHaveLength(1)
          expect(parsed.state.tournaments.guest).toHaveLength(1)
          
          resolve(undefined)
        }, 600) // Wait longer than the 500ms debounce
      })
    })

    it('should load data from localStorage on init', () => {
      // First store instance
      const store1 = useTournamentStore()
      store1.createTeam({ name: 'Team A' })
      
      // Wait for save
      return new Promise(resolve => {
        setTimeout(() => {
          // Create a new store instance (simulating page reload)
          const store2 = useTournamentStore()
          
          expect(store2.currentUserTeams).toHaveLength(1)
          expect(store2.currentUserTeams[0].name).toBe('Team A')
          
          resolve(undefined)
        }, 600)
      })
    })

    it('should clear all data', () => {
      const store = useTournamentStore()
      store.createTeam({ name: 'Team A' })
      store.createTournament({
        name: 'Summer League',
        type: TournamentType.GROUPS
      })

      store.clearAllData()

      expect(store.currentUserTeams).toHaveLength(0)
      expect(store.currentUserTournaments).toHaveLength(0)
      expect(localStorage.getItem('tournament-store')).toBeNull()
    })
  })

  describe('User Isolation', () => {
    it('should keep data separate per user', () => {
      const store = useTournamentStore()
      
      // Create data for guest user
      store.createTeam({ name: 'Guest Team' })
      store.createTournament({
        name: 'Guest Tournament',
        type: TournamentType.GROUPS
      })

      expect(store.currentUserTeams).toHaveLength(1)
      expect(store.currentUserTournaments).toHaveLength(1)

      // Switch user
      store.currentUserId = 'user-123'

      expect(store.currentUserTeams).toHaveLength(0)
      expect(store.currentUserTournaments).toHaveLength(0)

      // Create data for new user
      store.createTeam({ name: 'User Team' })

      // Switch back to guest
      store.currentUserId = 'guest'

      expect(store.currentUserTeams).toHaveLength(1)
      expect(store.currentUserTeams[0].name).toBe('Guest Team')
    })
  })
})

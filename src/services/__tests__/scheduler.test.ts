import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateRoundRobinSchedule,
  assignTeamsToGroups,
  validateSchedule,
  rescheduleMatches
} from '../scheduler'
import type { Team } from '@/types'

describe('Scheduler Service', () => {
  let mockTeams: Team[]

  beforeEach(() => {
    mockTeams = Array.from({ length: 4 }, (_, i) => ({
      id: `team-${i + 1}`,
      name: `Team ${i + 1}`,
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
    }))
  })

  describe('generateRoundRobinSchedule', () => {
    it('should generate correct number of rounds for even teams', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1
      })

      // With 4 teams, we should have 3 rounds (n-1 where n is number of teams)
      expect(result.rounds).toHaveLength(3)
    })

    it('should generate correct number of matches per round for even teams', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1
      })

      // With 4 teams, each round should have 2 matches (n/2)
      result.rounds.forEach(round => {
        expect(round.matches).toHaveLength(2)
      })
    })

    it('should handle odd number of teams with byes', () => {
      const oddTeams = mockTeams.slice(0, 3) // 3 teams

      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: oddTeams,
        numberOfRounds: 1
      })

      // With 3 teams, we should have 3 rounds (n teams treated as n+1 with bye)
      expect(result.rounds).toHaveLength(3)

      // Total number of matches should be 3 (each team plays every other team once)
      const totalMatches = result.rounds.reduce((sum, r) => sum + r.matches.length, 0)
      expect(totalMatches).toBe(3)

      // Verify no BYE teams in actual matches
      result.rounds.forEach(round => {
        round.matches.forEach(match => {
          expect(match.homeTeamId).not.toBe('BYE')
          expect(match.awayTeamId).not.toBe('BYE')
        })
      })
    })

    it('should generate double round-robin schedule', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 2
      })

      // With 4 teams and 2 cycles, we should have 6 rounds (3 * 2)
      expect(result.rounds).toHaveLength(6)

      // Total matches should be 12 (each team plays every other team twice)
      const totalMatches = result.rounds.reduce((sum, r) => sum + r.matches.length, 0)
      expect(totalMatches).toBe(12)
    })

    it('should ensure each team plays every other team once per cycle', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1
      })

      const pairings = new Set<string>()

      result.rounds.forEach(round => {
        round.matches.forEach(match => {
          if (match.homeTeamId && match.awayTeamId) {
            const pair = [match.homeTeamId, match.awayTeamId].sort().join('-')
            pairings.add(pair)
          }
        })
      })

      // With 4 teams, we should have 6 unique pairings (n * (n-1) / 2)
      expect(pairings.size).toBe(6)
    })

    it('should not have duplicate matches in the same round', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1
      })

      expect(validateSchedule(result.rounds)).toBe(true)
    })

    it('should schedule matches with proper dates', () => {
      const startDate = new Date('2024-01-01T10:00:00')

      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1,
        startDate,
        matchDurationMinutes: 90
      })

      // First match should start at the specified time
      expect(result.rounds[0].matches[0].scheduledDate).toEqual(startDate)

      // Matches should be spaced out
      const firstRoundMatches = result.rounds[0].matches
      if (firstRoundMatches.length > 1) {
        const firstMatchTime = firstRoundMatches[0].scheduledDate!.getTime()
        const secondMatchTime = firstRoundMatches[1].scheduledDate!.getTime()
        const diff = secondMatchTime - firstMatchTime

        // Should be at least 90 minutes apart
        expect(diff).toBeGreaterThanOrEqual(90 * 60 * 1000)
      }
    })

    it('should set correct round numbers', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 2
      })

      result.rounds.forEach((round, index) => {
        expect(round.roundNumber).toBe(index + 1)
        round.matches.forEach(match => {
          expect(match.roundNumber).toBe(index + 1)
        })
      })
    })

    it('should return empty rounds for less than 2 teams', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: [mockTeams[0]],
        numberOfRounds: 1
      })

      expect(result.rounds).toHaveLength(0)
    })

    it('should handle 2 teams correctly', () => {
      const twoTeams = mockTeams.slice(0, 2)

      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: twoTeams,
        numberOfRounds: 1
      })

      // With 2 teams, we should have 1 round with 1 match
      expect(result.rounds).toHaveLength(1)
      expect(result.rounds[0].matches).toHaveLength(1)

      const match = result.rounds[0].matches[0]
      expect(match.homeTeamId).toBe(twoTeams[0].id)
      expect(match.awayTeamId).toBe(twoTeams[1].id)
    })

    it('should apply default location to all matches', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1,
        defaultLocation: 'Main Stadium'
      })

      result.rounds.forEach(round => {
        round.matches.forEach(match => {
          expect(match.location).toBe('Main Stadium')
        })
      })
    })
  })

  describe('assignTeamsToGroups', () => {
    it('should distribute teams evenly across groups', () => {
      const teams = Array.from({ length: 8 }, (_, i) => ({
        id: `team-${i + 1}`,
        name: `Team ${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as Team[]

      const groups = assignTeamsToGroups(teams, 2, 'tournament-1')

      expect(groups).toHaveLength(2)
      expect(groups[0].teamIds).toHaveLength(4)
      expect(groups[1].teamIds).toHaveLength(4)
    })

    it('should handle uneven distribution', () => {
      const teams = Array.from({ length: 7 }, (_, i) => ({
        id: `team-${i + 1}`,
        name: `Team ${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as Team[]

      const groups = assignTeamsToGroups(teams, 3, 'tournament-1')

      expect(groups).toHaveLength(3)

      const totalTeams = groups.reduce((sum, g) => sum + g.teamIds.length, 0)
      expect(totalTeams).toBe(7)

      // First groups should have more teams if uneven
      expect(groups[0].teamIds.length).toBeGreaterThanOrEqual(groups[2].teamIds.length)
    })

    it('should name groups with letters', () => {
      const groups = assignTeamsToGroups(mockTeams, 2, 'tournament-1')

      expect(groups[0].name).toBe('Group A')
      expect(groups[1].name).toBe('Group B')
    })

    it('should initialize standings for each team', () => {
      const groups = assignTeamsToGroups(mockTeams, 2, 'tournament-1')

      groups.forEach(group => {
        expect(group.standings).toBeDefined()
        group.teamIds.forEach(teamId => {
          const standing = group.standings!.find(s => s.teamId === teamId)
          expect(standing).toBeDefined()
          expect(standing!.played).toBe(0)
          expect(standing!.wins).toBe(0)
          expect(standing!.points).toBe(0)
        })
      })
    })

    it('should return empty array for invalid inputs', () => {
      expect(assignTeamsToGroups([], 2, 'tournament-1')).toHaveLength(0)
      expect(assignTeamsToGroups(mockTeams, 0, 'tournament-1')).toHaveLength(0)
      expect(assignTeamsToGroups(mockTeams, -1, 'tournament-1')).toHaveLength(0)
    })
  })

  describe('validateSchedule', () => {
    it('should validate a correct schedule', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1
      })

      expect(validateSchedule(result.rounds)).toBe(true)
    })

    it('should detect duplicate matches in same round', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1
      })

      // Duplicate the first match in the first round
      if (result.rounds.length > 0 && result.rounds[0].matches.length > 0) {
        result.rounds[0].matches.push({ ...result.rounds[0].matches[0] })
        expect(validateSchedule(result.rounds)).toBe(false)
      }
    })
  })

  describe('rescheduleMatches', () => {
    it('should update all match dates', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1,
        startDate: new Date('2024-01-01')
      })

      const newStartDate = new Date('2024-02-01')
      const rescheduled = rescheduleMatches(result.rounds, newStartDate)

      expect(rescheduled[0].matches[0].scheduledDate).toEqual(newStartDate)
    })

    it('should maintain match spacing', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1
      })

      const newStartDate = new Date('2024-02-01T10:00:00')
      const rescheduled = rescheduleMatches(result.rounds, newStartDate, 90)

      if (rescheduled[0].matches.length > 1) {
        const firstTime = rescheduled[0].matches[0].scheduledDate!.getTime()
        const secondTime = rescheduled[0].matches[1].scheduledDate!.getTime()
        expect(secondTime - firstTime).toBe(90 * 60 * 1000)
      }
    })

    it('should update round start and end dates', () => {
      const result = generateRoundRobinSchedule({
        tournamentId: 'tournament-1',
        teams: mockTeams,
        numberOfRounds: 1
      })

      const newStartDate = new Date('2024-02-01T10:00:00')
      const rescheduled = rescheduleMatches(result.rounds, newStartDate)

      rescheduled.forEach(round => {
        expect(round.startDate).toBeDefined()
        expect(round.endDate).toBeDefined()
        if (round.startDate && round.endDate) {
          expect(round.endDate.getTime()).toBeGreaterThanOrEqual(round.startDate.getTime())
        }
      })
    })
  })
})

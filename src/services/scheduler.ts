import type { Team, Match, Round, Group, MatchStatus } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export interface ScheduleConfig {
  tournamentId: string
  teams: Team[]
  numberOfRounds: number
  startDate?: Date
  matchDurationMinutes?: number
  defaultLocation?: string
  groupSize?: number // for group-based tournaments
}

export interface ScheduleResult {
  rounds: Round[]
  groups?: Group[]
}

/**
 * Generates a round-robin schedule for teams
 * Supports multiple rounds (e.g., numberOfRounds=2 for double round-robin)
 * Handles odd number of teams by assigning byes
 */
export function generateRoundRobinSchedule(config: ScheduleConfig): ScheduleResult {
  const {
    tournamentId,
    teams,
    numberOfRounds,
    startDate = new Date(),
    matchDurationMinutes = 90,
    defaultLocation = 'TBD'
  } = config

  if (teams.length < 2) {
    return { rounds: [] }
  }

  const rounds: Round[] = []
  let currentDate = new Date(startDate)

  // For round-robin, each team plays every other team once per cycle
  const teamsArray = [...teams]
  const hasOddTeams = teamsArray.length % 2 !== 0

  // Add a dummy team for bye if odd number of teams
  if (hasOddTeams) {
    teamsArray.push({
      id: 'BYE',
      name: 'BYE',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  const numTeams = teamsArray.length
  const matchesPerRound = numTeams / 2
  const totalRoundsInCycle = numTeams - 1

  // Generate all rounds for all cycles
  for (let cycle = 0; cycle < numberOfRounds; cycle++) {
    const reverseFixtures = cycle % 2 === 1 // alternate home/away in even cycles

    for (let roundNum = 0; roundNum < totalRoundsInCycle; roundNum++) {
      const absoluteRoundNumber = cycle * totalRoundsInCycle + roundNum + 1
      const roundId = uuidv4()
      const matches: Match[] = []

      // Generate matches for this round using the circle method
      for (let matchIndex = 0; matchIndex < matchesPerRound; matchIndex++) {
        let homeIndex: number
        let awayIndex: number

        if (matchIndex === 0) {
          // First match: fixed team vs rotating team
          homeIndex = 0
          awayIndex = numTeams - 1 - roundNum
        } else {
          // Other matches: clockwise from the fixed position
          homeIndex = (roundNum + matchIndex) % (numTeams - 1) + 1
          awayIndex = (roundNum - matchIndex + numTeams - 1) % (numTeams - 1) + 1
        }

        // Adjust indices to be within bounds
        if (awayIndex === 0) awayIndex = numTeams - 1

        const homeTeam = teamsArray[homeIndex]
        const awayTeam = teamsArray[awayIndex]

        // Skip bye matches
        if (homeTeam.id === 'BYE' || awayTeam.id === 'BYE') {
          continue
        }

        // Reverse home/away for alternating cycles
        const [finalHome, finalAway] = reverseFixtures
          ? [awayTeam, homeTeam]
          : [homeTeam, awayTeam]

        const matchDate = new Date(currentDate)
        
        const match: Match = {
          id: uuidv4(),
          roundId,
          homeTeamId: finalHome.id,
          awayTeamId: finalAway.id,
          scheduledDate: matchDate,
          location: defaultLocation,
          status: 'scheduled' as MatchStatus,
          roundNumber: absoluteRoundNumber,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        matches.push(match)
        
        // Increment date for next match (spacing out matches)
        currentDate = new Date(currentDate.getTime() + matchDurationMinutes * 60 * 1000)
      }

      const round: Round = {
        id: roundId,
        tournamentId,
        roundNumber: absoluteRoundNumber,
        name: `Round ${absoluteRoundNumber}`,
        matches,
        startDate: matches.length > 0 ? matches[0].scheduledDate : currentDate,
        endDate: matches.length > 0 ? matches[matches.length - 1].scheduledDate : currentDate,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      rounds.push(round)

      // Add some spacing between rounds
      currentDate = new Date(currentDate.getTime() + 60 * 60 * 1000) // 1 hour gap
    }
  }

  return { rounds }
}

/**
 * Assigns teams to groups with even distribution
 * Useful for group stage tournaments
 */
export function assignTeamsToGroups(teams: Team[], numberOfGroups: number, tournamentId: string): Group[] {
  if (numberOfGroups <= 0 || teams.length === 0) {
    return []
  }

  const groups: Group[] = []
  const teamsPerGroup = Math.floor(teams.length / numberOfGroups)
  const remainderTeams = teams.length % numberOfGroups

  let teamIndex = 0

  for (let i = 0; i < numberOfGroups; i++) {
    const groupSize = teamsPerGroup + (i < remainderTeams ? 1 : 0)
    const groupTeams = teams.slice(teamIndex, teamIndex + groupSize)
    
    const group: Group = {
      id: uuidv4(),
      tournamentId,
      name: `Group ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
      teamIds: groupTeams.map(t => t.id),
      standings: groupTeams.map(t => ({
        teamId: t.id,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    groups.push(group)
    teamIndex += groupSize
  }

  return groups
}

/**
 * Validates a schedule to ensure no duplicate match pairings within the same round
 */
export function validateSchedule(rounds: Round[]): boolean {
  for (const round of rounds) {
    const pairings = new Set<string>()
    
    for (const match of round.matches) {
      if (!match.homeTeamId || !match.awayTeamId) continue
      
      // Create a consistent pairing key (sorted to catch reverse duplicates)
      const pair = [match.homeTeamId, match.awayTeamId].sort().join('-')
      
      if (pairings.has(pair)) {
        return false // Duplicate found in same round
      }
      
      pairings.add(pair)
    }
  }
  
  return true
}

/**
 * Updates match dates when schedule needs adjustment
 */
export function rescheduleMatches(
  rounds: Round[],
  newStartDate: Date,
  matchDurationMinutes: number = 90
): Round[] {
  let currentDate = new Date(newStartDate)

  return rounds.map(round => {
    const updatedMatches = round.matches.map(match => {
      const matchDate = new Date(currentDate)
      // Increment date for next match
      currentDate = new Date(currentDate.getTime() + matchDurationMinutes * 60 * 1000)
      
      return {
        ...match,
        scheduledDate: matchDate,
        updatedAt: new Date()
      }
    })

    return {
      ...round,
      matches: updatedMatches,
      startDate: updatedMatches.length > 0 ? updatedMatches[0].scheduledDate : currentDate,
      endDate: updatedMatches.length > 0 
        ? updatedMatches[updatedMatches.length - 1].scheduledDate 
        : currentDate,
      updatedAt: new Date()
    }
  })
}

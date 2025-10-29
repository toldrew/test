# Tournament Store Usage Guide

This document provides examples of how to use the tournament store in your components.

## Setup

```typescript
import { useTournamentStore } from '@/stores/tournamentStore'
import { TournamentType } from '@/types'

// In your component setup
const tournamentStore = useTournamentStore()
```

## Creating and Managing Teams

```typescript
// Create a team
const team = tournamentStore.createTeam({
  name: 'Barcelona FC',
  logo: '/logos/barcelona.png' // optional
})

// Update a team
tournamentStore.updateTeam(team.id, {
  name: 'FC Barcelona'
})

// Delete a team
tournamentStore.deleteTeam(team.id)

// Get all teams for current user
const teams = tournamentStore.currentUserTeams

// Get specific team
const specificTeam = tournamentStore.getTeamById(teamId)
```

## Creating and Managing Tournaments

```typescript
// Create a tournament
const tournament = tournamentStore.createTournament({
  name: 'Summer Championship 2024',
  type: TournamentType.GROUPS,
  description: 'Annual summer tournament',
  numberOfRounds: 2, // double round-robin
  startDate: new Date('2024-06-01'),
  matchDurationMinutes: 90,
  defaultLocation: 'Main Stadium'
})

// Update tournament metadata
tournamentStore.updateTournamentMeta(tournament.id, {
  name: 'Summer Championship 2024 - Updated',
  description: 'New description'
})

// Delete a tournament
tournamentStore.deleteTournament(tournament.id)

// Get all tournaments for current user
const tournaments = tournamentStore.currentUserTournaments

// Get specific tournament
const specificTournament = tournamentStore.getTournamentById(tournamentId)

// Set active tournament (for focused view)
tournamentStore.setActiveTournament(tournament.id)
const activeTournament = tournamentStore.activeTournament
```

## Generating Schedules

```typescript
// Assign teams to tournament (automatically generates schedule)
const teamIds = [team1.id, team2.id, team3.id, team4.id]
tournamentStore.assignTeamsToTournament(tournament.id, teamIds)

// Regenerate schedule after team changes
tournamentStore.regenerateTournamentSchedule(tournament.id)

// Reschedule matches to new dates
const newStartDate = new Date('2024-07-01')
tournamentStore.updateMatchSchedule(tournament.id, newStartDate, 90)
```

## Working with Groups

```typescript
// Create groups for a tournament (e.g., Group A, Group B)
tournamentStore.createTournamentGroups(tournament.id, 2) // 2 groups

// Access groups
const tournament = tournamentStore.getTournamentById(tournamentId)
const groups = tournament?.groups
```

## Recording Match Results

```typescript
// Get a match
const match = tournamentStore.getMatchById(matchId)

// Record match result
tournamentStore.recordMatchResult(matchId, {
  homeScore: 3,
  awayScore: 1,
  notes: 'Excellent performance by home team'
})

// Team stats are automatically updated after recording results
const homeTeam = tournamentStore.getTeamById(match.match.homeTeamId!)
console.log(homeTeam?.stats) // { wins: 1, points: 3, goalsFor: 3, ... }
```

## Tournament Statistics

```typescript
// Get tournament statistics
const stats = tournamentStore.getTournamentStats(tournament.id)

console.log(stats)
// {
//   totalTeams: 8,
//   totalMatches: 28,
//   completedMatches: 10,
//   upcomingMatches: 18,
//   progress: 35.7 (percentage)
// }
```

## Accessing Matches and Rounds

```typescript
const tournament = tournamentStore.getTournamentById(tournamentId)

// Iterate through rounds
tournament?.rounds.forEach(round => {
  console.log(`Round ${round.roundNumber}: ${round.name}`)
  
  // Access matches in this round
  round.matches.forEach(match => {
    const homeTeam = tournamentStore.getTeamById(match.homeTeamId!)
    const awayTeam = tournamentStore.getTeamById(match.awayTeamId!)
    
    console.log(`${homeTeam?.name} vs ${awayTeam?.name}`)
    console.log(`Status: ${match.status}`)
    console.log(`Date: ${match.scheduledDate}`)
    
    if (match.result) {
      console.log(`Result: ${match.result.homeScore} - ${match.result.awayScore}`)
    }
  })
})
```

## Data Persistence

The store automatically persists all data to localStorage:

```typescript
// Data is automatically saved 500ms after any change
// Data is automatically loaded on page refresh
// No manual save/load needed

// Clear all data (useful for logout or reset)
tournamentStore.clearAllData()
```

## Multi-User Support

```typescript
// Switch users (for future auth integration)
tournamentStore.currentUserId = 'user-123'

// Each user has isolated data
// Default userId is 'guest'
```

## Reactive Computed Properties

All store properties are reactive and can be used in templates or watched:

```typescript
import { watch } from 'vue'

// Watch for changes to tournaments
watch(
  () => tournamentStore.currentUserTournaments,
  (newTournaments) => {
    console.log('Tournaments updated:', newTournaments)
  },
  { deep: true }
)

// Use in template
<template>
  <div v-for="tournament in tournamentStore.currentUserTournaments" :key="tournament.id">
    {{ tournament.name }}
  </div>
</template>
```

## Example: Complete Tournament Setup

```typescript
import { useTournamentStore } from '@/stores/tournamentStore'
import { TournamentType } from '@/types'

const store = useTournamentStore()

// 1. Create teams
const teams = [
  store.createTeam({ name: 'Team A' }),
  store.createTeam({ name: 'Team B' }),
  store.createTeam({ name: 'Team C' }),
  store.createTeam({ name: 'Team D' })
]

// 2. Create tournament
const tournament = store.createTournament({
  name: 'Spring League',
  type: TournamentType.GROUPS,
  numberOfRounds: 2,
  startDate: new Date(),
  matchDurationMinutes: 90,
  defaultLocation: 'Central Stadium'
})

// 3. Assign teams and generate schedule
store.assignTeamsToTournament(
  tournament.id,
  teams.map(t => t.id)
)

// 4. Set as active
store.setActiveTournament(tournament.id)

// 5. View the schedule
const updatedTournament = store.getTournamentById(tournament.id)
console.log(`Generated ${updatedTournament?.rounds.length} rounds`)

// 6. Record results for first match
const firstMatch = updatedTournament?.rounds[0].matches[0]
if (firstMatch) {
  store.recordMatchResult(firstMatch.id, {
    homeScore: 2,
    awayScore: 1
  })
}

// 7. Check tournament progress
const stats = store.getTournamentStats(tournament.id)
console.log(`Progress: ${stats?.progress}%`)
```

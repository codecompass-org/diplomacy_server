## Logical Flow

This doc is a work in progress. It will describe the logical flow of the backend.

### Overview

The backend will be done either with Firebase or Supabase. The idea is that we will primarily interact
with the data, and use functions to do the heavy lifting. The functions will be triggered by events in
the database, and will be written in Typescript.

### Game Rules

The game rules follow standard Diplomacy rules. 

1. Between 1 and 7 human players
2. rest of the slots will be filled with AIs
3. once all human players lock in, AIs will generate their moves, then adjudication begins
    1. some kind of timer as well, custom in game settings

- messages get delivered each hour on the hour
- some randomness for the AIs
    - for each toPlayer, a 15% chance they send a message
    - if they received a message from a player, that goes up to 45% to respond
- messages are passed through a filter prior to sending to normalize the tones to make it difficult to tell who is human and who is AI

### Database

The database will be a relational database. The database will have the following tables:

- Users
- Games
- Moves
- Messages
- Players
- GameSettings
- UserSettings


The Users table will have the following columns:

- id
- name
- email
- isVerified


The Games table will have the following columns:

- id
- name
- gameState
- gameTurn
- gamePhase
- gameYear
- submitDeadline
- currentTerritories
- currentUnits

The Players table will have the following columns:

- id
- gameId
- userId # null if AI
- country
- isReady
- isEliminated
- isWinner
- isDraw
- isAbandoned


The Moves table will have the following columns:

- id
- gameId
- playerId
- turnId
- moveData

The Messages table will have the following columns:

- id
- gameId
- fromPlayerId
- toPlayerId
- messageText
- createdTimestamp
- sentTimestamp
- readTimestamp

The GameSettings table will have the following columns:

- id
- gameId
- settingName
- settingValue

The UserSettings table will have the following columns:

- id
- userId
- settingName
- settingValue

#### GameSettings

The GameSettings table will have the following rows:

- turnLength
- retreatLength
- buildLength
- startYear
- startSeason
- startPhase
- victoryCondition

#### UserSettings

The UserSettings table will have the following rows:

- defaultGameSettings
- defaultGameName
- defaultGamePassword
- defaultGamePlayers
- defaultGameMap
- defaultGameIsPrivate

### Functions

The functions will be written in Typescript. The functions will be triggered by events in the database.
The functions will be responsible for the following:

- starting a game
- adjudicating a game
- sending messages
- generating moves for AIs

#### Functions - Starting a Game

Starting a game will be done by a function. The function will be triggered when the user who created the game clicks the start button. The function will do the following:

- check to see if the game is full
- check to see if the game is ready
- check to see if the game is in the right state
- create AI players if needed
- set the game state to started
- set the game turn to 1
- set the game phase to spring
- set the game year to 1901
- set the submit deadline to now + turnLength

#### Functions - Adjudicating a Game

Adjudicating a game will be done by a function. The function will be triggered when the submit deadline is reached. The function will do the following:

- check to see if all remaining players have voted to end the game
- check to see if all players have submitted moves
- check to see if the game is in the right state
- run the adjudicator
- update the game state
- set the game state to ended if the game reached an end state
  - only 1 active player remaining
  - all active players voted to end the game

#### Functions - Sending Messages

Sending messages will be done by a function. The function will be triggered on a schedule. The function will do the following:

- check to see if the game is in the right state
- check to see if there are any messages to send
- run the AI message generator
- run the messages through a normalizer
- send the messages

#### Functions - Generating Moves for AIs

Generating moves for AIs will be done by a function. The function will be triggered on a schedule. The function will do the following:

- check to see if the game is in the right state
- check to see if there are any moves to generate
- run the AI move generator

### API

The API will be done by Firebase or Supabase SDK. The API will be responsible for the following:

- creating a user
- logging in a user
- logging out a user
- creating a game
- joining a game
- leaving a game
- getting a list of games
- getting a list of players in a game
- getting a list of messages in a game
- getting a list of moves in a game
- getting a list of games a user is in
- getting a list of messages a user has sent
- getting a list of messages a user has received
- getting a list of moves a user has made
- getting a list of moves a user has received
- getting a list of games a user has won
- getting a list of games a user has lost
- getting a list of games a user has drawn
- getting a list of games a user has abandoned
- getting a list of games a user has timed out
- getting a list of games a user has been eliminated from

### Authentication

Authentication will be done by Firebase or Supabase.

### Authorization

Authorization will be done by Firebase or Supabase.

### Security

Security will be done by Firebase or Supabase.

### Testing

Testing will be done by Firebase or Supabase.

### Deployment

Deployment will be done by Firebase or Supabase.

### Monitoring

Monitoring will be done by Firebase or Supabase.

### Logging

Logging will be done by Firebase or Supabase.

### Analytics

Analytics will be done by Firebase or Supabase.

### Error Reporting

Error reporting will be done by Firebase or Supabase.

### Crash Reporting

Crash reporting will be done by Firebase or Supabase.

### Performance Monitoring

Performance monitoring will be done by Firebase or Supabase.
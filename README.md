# RankedWarAssistant

A Torn Discord bot that assists in ranked wars.

## Installation

To invite the bot over to your discord server
click [here](https://discord.com/api/oauth2/authorize?client_id=932550905713270836&permissions=8&scope=bot%20applications.commands).
\
At this moment the bot needs to be an Administrator, but do
not worry our [repository](https://github.com/ibramsterdam/RankedWarAssistant) is open
sorce so you can see what we are up to :-).

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`BOT_TOKEN`
`CLIENT_ID`
`PUBLIC_KEY`
`BOT_OWNER`
`TORN_FACTION_ID`
`TORN_API_KEY`
`TORN_API_URL`

## Commands

### Available

**War Countdown**
\
Command: `/warCountdown`
\
Description: command calls the torn rankedwars api and gives
information about the upcomming war.

### Unavailable

**Set Opponent** _Essential!_
\
Command: `/setOpponent [ENEMY_FACTION_ID]`
\
Description: Defines enemy faction ID.

**Spy enemy faction**
\
Command: `/spyEnemyFaction on`
\
Command: `/spyEnemyFaction off`
\
Description: Turn on or turn off listener that retrieves new information
about faction every 6 seconds.
\
This includes: Change online/offline status,
change state (Traveling, Hospital, Torn, Okay).

**Incomming from flight**
\
Command: `/incommingFlight`
\
Description: List of enemy faction members that are flying
to Torn.

**Hospital timers**
\
Command: `/timerHospital`
\
Description: List of enemy faction members that are in
hospital with timers.

**Hospital timers**
\
Command: `/timerJail`
\
Description: List of enemy faction members that are in
jail with timers.

**Players below 30% Health**
\
Command: `/enemyHealth`
\
Description: List of enemy faction members that have health
below 30% of their max health.

**Track enemy chain**
\
Command: `/chainEnemy`
\
Description: Status updates about enemy chain.

**Track faction chain**
\
Command: `/chainFaction`
\
Description: Status updates about own chain.

**Track faction chain**
\
Command: `/giveMeTarget`
\
Description: List of targets that can be attacked sorted from easiest -> harders to kill.
This is based on age, xanax, refills, level.

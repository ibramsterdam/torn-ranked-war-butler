# RankedWarAssistant

Torn Discord bot that assists in ranked wars.
![A Torn Discord bot that assists in ranked wars.](/AdmiralProfile.png)

## Installation

To invite the bot over to your discord server
click [here](https://discord.com/api/oauth2/authorize?client_id=932550905713270836&permissions=8&scope=bot%20applications.commands).
\
At this moment the bot needs to be an Administrator, but do
not worry our [repository](https://github.com/ibramsterdam/RankedWarAssistant) is open
source so you can see what we are up to :-).

## Database

We use mongoDB and connect to mongoDB with mongoose.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`BOT_TOKEN`
`CLIENT_ID`
`PUBLIC_KEY`
`BOT_OWNER`
`TORN_FACTION_ID`
`TORN_API_KEY`
`TORN_API_URL`

## Commands for war

### Available

**Set Opponent** _Essential!_
\
Command: `/setopponent [ENEMY_FACTION_ID]`
\
Description: Defines enemy faction ID.
Note: Using jsonStorage, at later date will be connected to a server

**War Status**
\
Command: `/warstatus [FACTION_ID]`
\
Description: Command calls the torn rankedwars api and gives
information about the (upcomming) war. if no faction ID is given then it searches on own faction.
Note: Can only be called every 10 seconds

**Hospital timers**
\
Command: `/hospitalstatus [FACTION_ID]`
\
Description: List of enemy faction members that are in
hospital with timers sorted by remaining time in hospital.
Note: Can only be called every 10 seconds

### In Development

**Track faction chain**
\
Command: `/chainfaction`
\
Description: Status updates about own chain.

### Unavailable

**Spy enemy faction**
\
Command: `/spyenemyfaction on`
\
Command: `/spyenemyfaction off`
\
Description: Turn on or turn off listener that retrieves new information
about faction every 6 seconds.
\
This includes: Change online/offline status,
change state (Traveling, Hospital, Torn, Okay).

**Incomming from flight**
\
Command: `/incommingflight`
\
Description: List of enemy faction members that are flying
to Torn.

**Jail timers**
\
Command: `/timerjail`
\
Description: List of enemy faction members that are in
jail with timers.

**Players below 30% Health**
\
Command: `/enemyhealth`
\
Description: List of enemy faction members that have health
below 30% of their max health.

**Track enemy chain**
\
Command: `/chainenemy`
\
Description: Status updates about enemy chain.

**Track faction chain**
\
Command: `/givemetarget`
\
Description: List of targets that can be attacked sorted from easiest -> harders to kill.
This is based on age, xanax, refills, level.

## Other Commands

### Available

**Clear Messages**
\
Command: `/clear [target]`
\
Description: Ability to clear chatbox.

**Command List**
\
Command: `/information`
\
Description: List of commands available.
\
Note: Can only be called every 10 seconds.

### In Development

### Unavailable

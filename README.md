# No Longer in development

# RankedWarButler

Torn Discord Bot that assists in ranked wars.
\
![A Torn Discord bot that assists in ranked wars.](/AdmiralProfile.png)

## Installation

To invite the bot over to your discord server
click [here](https://discord.com/api/oauth2/authorize?client_id=932550905713270836&permissions=2147510288&scope=bot%20applications.commands).

DEVELOP BOT = [here](https://discord.com/api/oauth2/authorize?client_id=1068813614829539338&permissions=2147510288&scope=bot%20applications.commands).

\
At this moment the bot needs 5 rights
\

- `Manage Channels`
- `Send Messages`
- `Manage Messages`
- `Use Application Commands`
- `Embed Links`

## Database

We use postgresql

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`BOT_TOKEN`
`DATABASE_URL`

## Commands for war

### Available

**Setup Butler** _Essential!_
\
Command: `/setup`
\
Description: Creates the RankedWar Butler Category and butler-dashboard
Note: Using jsonStorage, at later date will be connected to a server

**Create Dashboard** _Essential!_
\
Command: `/dashboard`
\
Description: Command calls the torn rankedwars api and gives
information about the (upcomming) war. if no faction ID is given then it searches on own faction.
Note: Can only be called every 10 seconds

## Functionalities

### Done

**Track faction chain**
\
Command: `/chainfaction`
\
Description: Status updates about own chain.

### Development

**Track faction chain**
\
Command: `/chainfaction`
\
Description: Status updates about own chain.

## Ideas

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

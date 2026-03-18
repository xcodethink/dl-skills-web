> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Multimedia & Other

---
name: raffle-winner-picker
description: Picks random winners from lists, spreadsheets, or Google Sheets for giveaways, raffles, and contests with fair, transparent, cryptographically secure selection.
---

# Raffle Winner Picker

## Overview

This skill randomly selects winners from lists, spreadsheets, or Google Sheets for giveaways and contests. It uses cryptographically secure random selection to ensure fair, unbiased results, supports multiple winners with duplicate prevention, and provides transparent documentation of the selection process including timestamps and method details.

## When to Use

- Running social media giveaways
- Picking raffle winners at events
- Randomly selecting participants for surveys or tests
- Choosing winners from contest submissions
- Fair distribution of limited spots or resources
- Random team assignments

## What It Does

1. **Random Selection** -- Cryptographically secure random picks
2. **Multiple Sources** -- Works with CSV, Excel, Google Sheets, or plain lists
3. **Multiple Winners** -- Can pick one or many winners
4. **Duplicate Prevention** -- Same person cannot win twice
5. **Transparent Results** -- Shows selection process clearly with timestamps
6. **Winner Details** -- Displays all relevant information about winners

## How to Use

### From Google Sheets

```
Pick a random row from this Google Sheet to select a winner
for a giveaway: [Sheet URL]
```

### From Local File

```
Pick 3 random winners from entries.csv
```

### From a List

```
Pick a random winner from this list:
- Alice (alice@email.com)
- Bob (bob@email.com)
- Carol (carol@email.com)
```

### Multiple Winners

```
Pick 5 random winners from contest-entries.xlsx,
make sure no duplicates
```

## Example Output

```
Accessing Google Sheet...
Total entries found: 247

Randomly selecting winner...

WINNER SELECTED!

Row #142
Name: Sarah Johnson
Email: sarah.j@email.com
Entry Date: March 10, 2024
Comment: "Love your newsletter!"

Selection method: Cryptographically random
Timestamp: 2024-03-15 14:32:18 UTC

Would you like to:
- Pick another winner (excluding Sarah)?
- Export winner details?
- Pick runner-ups?
```

## Features

### Fair Selection
- Secure random number generation
- No bias or patterns
- Transparent process
- Repeatable with seed (for verification)

### Exclusions

```
Pick a random winner excluding previous winners:
Alice, Bob, Carol
```

### Weighted Selection

```
Pick a winner with weighted probability based on
the "entries" column (1 entry = 1 ticket)
```

### Runner-ups

```
Pick 1 winner and 3 runner-ups from the list
```

## Common Workflows

### Social Media Giveaway
1. Export entries from Google Form to Sheets
2. "Pick a random winner from [Sheet URL]"
3. Verify winner details
4. Announce publicly with timestamp

### Event Raffle
1. Create CSV of attendee names and emails
2. "Pick 10 random winners from attendees.csv"
3. Export winner list
4. Email winners directly

### Team Assignment
1. Have list of participants
2. "Randomly split this list into 4 equal teams"
3. Review assignments
4. Share team rosters

## Privacy and Fairness

- Uses cryptographically secure randomness
- No manipulation possible
- Timestamp recorded for verification
- Can provide seed for third-party verification
- Respects data privacy

## Tips

1. **Document the process** -- Save the timestamp and method
2. **Public announcement** -- Share selection details for transparency
3. **Check eligibility** -- Verify winner meets contest rules
4. **Have backups** -- Pick runner-ups in case winner is ineligible
5. **Export results** -- Save winner list for records

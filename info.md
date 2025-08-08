# Kids Tasks Card

Lovelace cards for the Kids Tasks Manager integration.

## Requirements

- Home Assistant 2024.1.0 or later
- [Kids Tasks Manager](https://github.com/astrayel/kids-tasks-ha) integration installed

## Installation

### Via HACS (Recommended)

1. Add this repository to HACS as a custom repository:
   - Go to HACS > Frontend
   - Click the 3 dots menu > Custom repositories  
   - Add `https://github.com/astrayel/kids-tasks-card` as a "Lovelace" repository
2. Install "Kids Tasks Card" 
3. Restart Home Assistant
4. Add the resource to your Lovelace configuration (if not done automatically)

### Manual Installation

1. Download `kids-tasks-card.js` from the latest release
2. Copy to `/config/www/community/kids-tasks-card/`
3. Add to Lovelace resources:
   ```yaml
   resources:
     - url: /hacsfiles/kids-tasks-card/kids-tasks-card.js
       type: module
   ```

## Usage

Add the card to your Lovelace dashboard:

```yaml
type: custom:kids-tasks-card
title: "Kids Tasks"
# Additional configuration options...
```

## Features

- View all children and their progress
- Complete tasks directly from the dashboard
- Track points and levels
- Claim rewards
- Parental validation interface

## Support

For issues related to this card, please report them at:
https://github.com/astrayel/kids-tasks-card/issues

For issues with the integration itself, report at:
https://github.com/astrayel/kids-tasks-ha/issues
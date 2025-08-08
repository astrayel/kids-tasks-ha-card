# Kids Tasks Card

[![HACS Custom][hacs-shield]](https://github.com/custom-components/hacs)
[![GitHub Release][release-shield]](https://github.com/astrayel/kids-tasks-card/releases)
[![License][license-shield]](LICENSE)

Custom Lovelace cards for the [Kids Tasks Manager](https://github.com/astrayel/kids-tasks-ha) Home Assistant integration.

## Screenshots

_Screenshots will be added here_

## Installation

### HACS (Recommended)

1. Add this repository as a custom HACS repository:
   - HACS > Frontend > ⋮ > Custom repositories
   - Repository: `https://github.com/astrayel/kids-tasks-card`
   - Category: `Lovelace`
2. Install "Kids Tasks Card"
3. Restart Home Assistant
4. Add the resource (usually automatic)

### Manual

1. Download `kids-tasks-card.js` from [latest release](https://github.com/astrayel/kids-tasks-card/releases)
2. Copy to `/config/www/community/kids-tasks-card/kids-tasks-card.js`
3. Add to Lovelace resources in Configuration > Lovelace Dashboards > Resources

## Usage

### Basic Card

```yaml
type: custom:kids-tasks-card
title: "Kids Tasks Dashboard"
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | optional | Card title |
| `show_completed` | boolean | `true` | Show completed tasks |
| `show_rewards` | boolean | `true` | Show rewards section |
| `child_filter` | array | optional | Filter to specific children |

## Cards Available

- **kids-tasks-card**: Main dashboard with all children and tasks
- **kids-tasks-manager**: Administrative interface for parents
- **kids-tasks-forms**: Task and reward creation forms
- **kids-tasks-complete**: Task completion interface
- **kids-tasks-data**: Data visualization and statistics

## Requirements

- [Kids Tasks Manager Integration](https://github.com/astrayel/kids-tasks-ha) must be installed and configured
- Home Assistant 2024.1.0 or later

## Support

Report issues at: https://github.com/astrayel/kids-tasks-card/issues

For integration issues, use: https://github.com/astrayel/kids-tasks-ha/issues

## License

MIT License - see [LICENSE](LICENSE) file

[hacs-shield]: https://img.shields.io/badge/HACS-Custom-orange.svg
[release-shield]: https://img.shields.io/github/v/release/astrayel/kids-tasks-card.svg
[license-shield]: https://img.shields.io/github/license/astrayel/kids-tasks-card.svg
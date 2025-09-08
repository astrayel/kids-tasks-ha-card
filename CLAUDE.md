# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **kids-tasks-card** project - a Home Assistant Lovelace custom card for the Kids Tasks Manager integration. It provides interactive frontend components for managing children's tasks, rewards, and progress tracking.

## Project Structure

```
kids-tasks-card/
├── kids-tasks-card.js          # Main Lovelace card implementation (309KB)
├── package.json                # Project metadata and configuration
├── README.md                   # User documentation
├── info.md                     # HACS integration info
├── hacs.json                   # HACS configuration
├── LICENSE                     # MIT license
└── .github/                    # GitHub workflows and templates
```

## Architecture Overview

### Main Components

**kids-tasks-card.js** (kids-tasks-card.js:1-8000+) - Comprehensive Lovelace card implementation:

- **KidsTasksStyleManager** - Global CSS injection and theming system
- **Multiple Card Types**:
  - `custom:kids-tasks-card` - Main dashboard
  - `custom:kids-tasks-manager` - Administrative interface
  - `custom:kids-tasks-forms` - Task/reward creation
  - `custom:kids-tasks-complete` - Task completion interface
  - `custom:kids-tasks-data` - Statistics and visualization

### Key Features

1. **Task Management**: Complete, validate, and track task progress
2. **Reward System**: Points, levels, and reward claiming
3. **Child Profiles**: Individual progress tracking with avatars
4. **Parental Controls**: Administrative functions and validation
5. **Real-time Updates**: WebSocket integration with Home Assistant
6. **Responsive Design**: Mobile-friendly interface
7. **Theming**: CSS custom properties integration

## Technical Details

### Dependencies
- **Runtime**: Home Assistant Lovelace environment
- **No Build Process**: Direct JavaScript deployment
- **Integration**: Requires [Kids Tasks Manager](https://github.com/astrayel/kids-tasks-ha) custom component

### CSS Architecture
- Global style injection system via `KidsTasksStyleManager`
- CSS custom properties for theming (`--kt-*` variables)
- Status-based color coding (`--kt-status-*`)
- Responsive grid layouts

### Home Assistant Integration
- Entity state management through `this.hass`
- Service calls for task operations
- Event listening for real-time updates
- Configuration schema validation

## Development Guidelines

### Code Style
- ES6+ JavaScript with class-based components
- Lit-HTML for templating
- CSS-in-JS for styling
- Modular card architecture

### File Organization
- Single-file deployment model
- Self-contained with embedded styles
- No external dependencies
- HACS-compatible structure

## Installation & Deployment

### HACS Installation (Recommended)
```yaml
# hacs.json configuration
{
  "name": "Kids Tasks Card",
  "render_readme": true,
  "filename": "kids-tasks-card.js"
}
```

### Manual Installation
1. Copy `kids-tasks-card.js` to `/config/www/community/kids-tasks-card/`
2. Add to Lovelace resources:
```yaml
resources:
  - url: /hacsfiles/kids-tasks-card/kids-tasks-card.js
    type: module
```

### Usage Example
```yaml
type: custom:kids-tasks-card
title: "Kids Tasks Dashboard"
show_completed: true
show_rewards: true
child_filter: ["child1", "child2"]
```

## Testing & Validation

**No Automated Testing**: Direct browser testing in Home Assistant environment

### Manual Testing Checklist
- [ ] Card loads without errors in Lovelace
- [ ] All card types render correctly
- [ ] Task operations work (complete, validate, etc.)
- [ ] Reward system functions properly
- [ ] Responsive design on mobile
- [ ] Integration with Kids Tasks Manager component

## Common Operations

### Adding New Card Types
1. Extend main class with new card type handler
2. Add to `getCardSize()` method
3. Implement rendering logic
4. Update configuration schema

### Styling Updates
1. Modify `KidsTasksStyleManager.getGlobalStyles()`
2. Use CSS custom properties for theming
3. Ensure responsive behavior
4. Test across different HA themes

### Service Integration
1. Use `this.hass.callService()` for operations
2. Listen for state changes via `this.hass.states`
3. Handle error states gracefully
4. Provide user feedback for actions

## Important Notes

- **No Build Process**: Files are used directly in Home Assistant
- **Single File**: All functionality contained in one JavaScript file
- **Home Assistant Specific**: Designed exclusively for HA Lovelace
- **Integration Dependent**: Requires Kids Tasks Manager component
- **Version Compatibility**: Requires HA 2024.1.0 or later

## Troubleshooting

### Common Issues
- **Card Not Loading**: Check resource configuration and file path
- **Service Calls Failing**: Verify Kids Tasks Manager integration is installed
- **Styling Issues**: Check CSS custom property conflicts
- **Mobile Display**: Test responsive breakpoints

### Debug Information
- Browser console for JavaScript errors
- Home Assistant logs for service call issues
- Check entity states in Developer Tools
- Verify integration configuration
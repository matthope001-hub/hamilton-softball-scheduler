# Hamilton Classic Co-Ed Softball League Scheduler

A professional web application for generating softball league schedules with specific requirements for the Hamilton Classic Co-Ed Softball League at Turner Park.

## Features

### 🏟 Core Functionality
- **Dynamic Team Configuration**: Support for 9 or 10 teams
- **Smart Diamond Management**: Automatic scheduling across 5 diamonds with lighting constraints
- **Double Header Support**: Optional double headers on lit diamonds only
- **Time Management**: 6:30 PM first games, 8:15 PM second games
- **Schedule Validation**: Ensures each team plays correct number of games
- **CSV Export**: Download schedules for distribution

### 🏆 League Rules Implemented
- **9 Teams**: 23 regular season games per team
- **10 Teams**: 21 regular season games per team
- **Tuesday Night Games**: All games scheduled for Tuesdays
- **Diamond Constraints**:
  - Diamond 5, 9, 12: Full lighting (single + double headers)
  - Diamond 13, 14: No lighting (single games only)
- **Home/Away Balance**: Teams evenly designated as home and away
- **Flexible Double Headers**: Teams can play double headers but not required

### 💻 Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Bootstrap 5 with custom styling
- **Loading States**: Professional loading animations
- **Error Handling**: Comprehensive input validation
- **Data Export**: CSV format for easy sharing

## Quick Start

1. **Open `index.html` in your web browser**
2. **Configure League Settings**:
   - Choose number of teams (9 or 10)
   - Set season start date
   - Enter team names (comma-separated)
3. **Generate Schedule**: Click "Generate Schedule" button
4. **Export Results**: Download as CSV for distribution

## File Structure

```
hamilton-softball-scheduler/
├── index.html          # Main web interface
├── scheduler.js         # Core scheduling logic
└── README.md           # This documentation
```

## Scheduling Algorithm

The scheduler uses a **round-robin approach** with intelligent diamond allocation:

1. **Matchup Generation**: Creates all team combinations
2. **Diamond Assignment**: Prioritizes lit diamonds for evening games
3. **Time Slot Management**: Balances 6:30 PM and 8:15 PM slots
4. **Double Header Logic**: Optional double headers on available lit diamonds
5. **Constraint Validation**: Ensures lighting rules are followed

## Diamond Information

| Diamond | Lighting | Game Types | Notes |
|----------|-----------|-------------|---------|
| 5        | ✅ Yes   | Single + Double |
| 9        | ✅ Yes   | Single + Double |
| 12       | ✅ Yes   | Single + Double |
| 13       | ❌ No    | Single Only |
| 14       | ❌ No    | Single Only |

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Support

For questions or issues with the scheduler, please refer to the inline documentation in `scheduler.js` or check the browser console for debugging information.

---

**Hamilton Classic Co-Ed Softball League**  
*Turner Park • Tuesday Nights• Since 2026*

// Hamilton Classic Co-Ed Softball League Scheduler
class SoftballScheduler {
    constructor() {
        this.teams = [];
        this.diamonds = [
            { id: 5, name: 'Diamond 5', hasLights: true },
            { id: 9, name: 'Diamond 9', hasLights: true },
            { id: 12, name: 'Diamond 12', hasLights: true },
            { id: 13, name: 'Diamond 13', hasLights: false },
            { id: 14, name: 'Diamond 14', hasLights: false }
        ];
        this.schedule = [];
        this.numTeams = 10;
        this.gamesPerTeam = 21; // 10 teams = 21 games, 9 teams = 23 games
    }

    // Parse team names from input
    parseTeamNames(teamInput) {
        return teamInput.split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .slice(0, 10); // Maximum 10 teams
    }

    // Generate complete schedule
    generateSchedule(teamNames, seasonStart) {
        this.teams = teamNames;
        this.numTeams = this.teams.length;
        this.gamesPerTeam = this.numTeams === 9 ? 23 : 21;
        
        this.schedule = [];
        const startDate = new Date(seasonStart);
        
        // Generate round-robin schedule
        const matchups = this.generateRoundRobinMatchups();
        const scheduledGames = this.scheduleGames(matchups, startDate);
        
        return scheduledGames;
    }

    // Generate all team matchups (round-robin)
    generateRoundRobinMatchups() {
        const matchups = [];
        
        for (let i = 0; i < this.teams.length; i++) {
            for (let j = i + 1; j < this.teams.length; j++) {
                matchups.push({
                    home: this.teams[i],
                    away: this.teams[j],
                    week: null,
                    date: null,
                    diamond: null
                });
            }
        }
        
        return matchups;
    }

    // Schedule games on specific dates and diamonds
    scheduleGames(matchups, startDate) {
        const scheduledGames = [];
        let currentWeek = 1;
        let currentDate = new Date(startDate);
        
        // Shuffle matchups for variety
        const shuffledMatchups = this.shuffleArray([...matchups]);
        
        while (shuffledMatchups.length > 0) {
            const weekGames = [];
            const availableDiamonds = this.diamonds.filter(d => d.hasLights);
            const teamsPlayingThisWeek = new Set();
            
            // Schedule games for current week
            for (let i = 0; i < Math.floor(this.numTeams / 2) && shuffledMatchups.length > 0; i++) {
                const game = shuffledMatchups.shift();
                
                // Check if either team is already playing this week
                if (teamsPlayingThisWeek.has(game.home) || teamsPlayingThisWeek.has(game.away)) {
                    // Put this matchup back and try next one
                    shuffledMatchups.push(game);
                    continue;
                }
                
                // Find available diamond
                const diamond = this.selectDiamond(availableDiamonds, weekGames);
                
                // Determine game time
                const gameTime = i === 0 ? '18:30' : '20:15';
                
                const scheduledGame = {
                    week: currentWeek,
                    date: new Date(currentDate),
                    time: gameTime,
                    diamond: diamond,
                    home: game.home,
                    away: game.away,
                    gameType: 'Single'
                };
                
                // Mark teams as playing this week
                teamsPlayingThisWeek.add(game.home);
                teamsPlayingThisWeek.add(game.away);
                
                weekGames.push(scheduledGame);
                scheduledGames.push(scheduledGame);
            }
            
            // Move to next week
            currentDate.setDate(currentDate.getDate() + 7);
            currentWeek++;
        }
        
        return scheduledGames.sort((a, b) => {
            if (a.week !== b.week) return a.week - b.week;
            if (a.date !== b.date) return a.date - b.date;
            return a.time.localeCompare(b.time);
        });
    }

    // Select best available diamond for a game
    selectDiamond(availableDiamonds, weekGames) {
        const usedDiamonds = weekGames.map(g => g.diamond.id);
        const available = availableDiamonds.filter(d => !usedDiamonds.includes(d.id));
        
        if (available.length === 0) {
            // Fallback to any available diamond
            return this.diamonds.find(d => !usedDiamonds.includes(d.id)) || availableDiamonds[0];
        }
        
        // Prefer less-used diamonds
        return available.reduce((best, current) => {
            const bestUsage = this.countDiamondUsage(best.id, weekGames);
            const currentUsage = this.countDiamondUsage(current.id, weekGames);
            return currentUsage < bestUsage ? current : best;
        });
    }

    // Count how many times a diamond has been used
    countDiamondUsage(diamondId, weekGames) {
        return weekGames.filter(g => g.diamond.id === diamondId).length;
    }

    // Utility function to shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Export schedule to CSV
    exportToCSV(schedule) {
        const headers = ['Week', 'Date', 'Time', 'Diamond', 'Home Team', 'Away Team', 'Game Type'];
        const rows = schedule.map(game => [
            game.week,
            game.date.toLocaleDateString(),
            game.time,
            `${game.diamond.name} (${game.diamond.id})`,
            game.home,
            game.away,
            game.gameType
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.join(','))
            .join('\n');
        
        return csvContent;
    }

    // Validate schedule completeness
    validateSchedule(schedule) {
        const teamGames = {};
        this.teams.forEach(team => {
            teamGames[team] = 0;
        });
        
        schedule.forEach(game => {
            teamGames[game.home]++;
            teamGames[game.away]++;
        });
        
        const expectedGames = this.gamesPerTeam;
        const issues = [];
        
        Object.entries(teamGames).forEach(([team, games]) => {
            if (games !== expectedGames) {
                issues.push(`${team}: ${games} games (expected ${expectedGames})`);
            }
        });
        
        return issues;
    }
}

// Global functions for UI interaction
let scheduler = null;
let currentSchedule = [];
let editingGameIndex = null;

// Ensure scheduler is always available
function ensureScheduler() {
    console.log('ensureScheduler called, current scheduler:', scheduler);
    if (!scheduler) {
        console.log('Creating new scheduler instance');
        scheduler = new SoftballScheduler();
        console.log('New scheduler created:', scheduler);
    } else {
        console.log('Using existing scheduler instance');
    }
    return scheduler;
}

function generateSchedule() {
    console.log('Generate schedule button clicked');
    
    try {
        // Check if SoftballScheduler class exists
        if (typeof SoftballScheduler === 'undefined') {
            console.error('SoftballScheduler class is not defined!');
            showAlert('Error: Scheduler class not loaded. Please refresh the page.', 'danger');
            return;
        }
        
        // Ensure scheduler is available
        scheduler = ensureScheduler();
        console.log('Scheduler ensured successfully:', scheduler);
        
        // Test the parseTeamNames method immediately
        if (typeof scheduler.parseTeamNames !== 'function') {
            throw new Error('parseTeamNames method not found on scheduler instance');
        }
        console.log('parseTeamNames method verified:', typeof scheduler.parseTeamNames);
        
        const teamInput = document.getElementById('teamNames').value;
        const numTeams = parseInt(document.getElementById('numTeams').value);
        const seasonStart = document.getElementById('seasonStart').value;
        
        console.log('Input values:', { teamInput, numTeams, seasonStart });
        
        // Validate input
        if (!teamInput || teamInput.trim().length === 0) {
            showAlert('Please enter team names', 'warning');
            return;
        }
        
        // Double-check scheduler is still valid
        if (!scheduler) {
            console.error('Scheduler became null before parseTeamNames call');
            showAlert('Error: Scheduler was reset. Please refresh the page.', 'danger');
            return;
        }
        
        console.log('About to call parseTeamNames, scheduler:', scheduler);
        console.log('parseTeamNames method exists:', typeof scheduler.parseTeamNames);
        const teamNames = scheduler.parseTeamNames(teamInput);
        console.log('Parsed team names:', teamNames);
        
        if (teamNames.length < 2) {
            showAlert('Please enter at least 2 team names', 'warning');
            return;
        }
        
        if (teamNames.length !== numTeams) {
            showAlert(`Number of teams (${teamNames.length}) doesn't match selected option (${numTeams})`, 'warning');
            return;
        }
        
        // Show loading
        document.getElementById('setupSection').style.display = 'none';
        document.getElementById('loadingSpinner').style.display = 'block';
        
        // Generate schedule with delay for UI feedback
        setTimeout(() => {
            try {
                console.log('Generating schedule...');
                currentSchedule = scheduler.generateSchedule(teamNames, seasonStart);
                console.log('Schedule generated:', currentSchedule.length, 'games');
                
                // Validate schedule
                const issues = scheduler.validateSchedule(currentSchedule);
                if (issues.length > 0) {
                    console.warn('Schedule validation issues:', issues);
                }
                
                // Display schedule
                displaySchedule(currentSchedule);
                
                // Hide loading, show results
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('scheduleResults').style.display = 'block';
                
                showAlert(`Schedule generated successfully! ${currentSchedule.length} games scheduled.`, 'success');
                
            } catch (error) {
                console.error('Error generating schedule:', error);
                showAlert('Error generating schedule. Please try again.', 'danger');
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('setupSection').style.display = 'block';
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error in generateSchedule:', error);
        showAlert('Error initializing scheduler. Please refresh the page.', 'danger');
    }
}

function displaySchedule(schedule) {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';
    
    // Track team conflicts for visual indicators
    const teamConflicts = {};
    
    schedule.forEach(game => {
        const row = document.createElement('tr');
        
        const diamondClass = !game.diamond.hasLights ? 'no-lights' : '';
        const homeTeamClass = 'team-home';
        const awayTeamClass = 'team-away';
        const gameTypeClass = game.gameType === 'Double Header' ? 'double-header' : '';
        
        // Check for team conflicts
        const homeConflict = teamConflicts[game.home] || 0;
        const awayConflict = teamConflicts[game.away] || 0;
        const hasConflict = homeConflict > 0 || awayConflict > 0;
        
        // Add conflict styling
        const homeClass = hasConflict ? `${homeTeamClass} bg-warning text-dark` : homeTeamClass;
        const awayClass = hasConflict ? `${awayTeamClass} bg-warning text-dark` : awayTeamClass;
        
        row.innerHTML = `
            <td class="week-header">${game.week}</td>
            <td>${game.date.toLocaleDateString()}</td>
            <td><span class="game-time">${game.time}</span></td>
            <td>
                <span class="diamond-info ${diamondClass}">
                    ${game.diamond.name}
                    ${!game.diamond.hasLights ? '<i class="fas fa-moon-slash ms-1"></i>' : ''}
                </span>
            </td>
            <td><span class="${homeClass}" title="${hasConflict ? 'Team has scheduling conflict' : ''}">${game.home}</span></td>
            <td><span class="${awayClass}" title="${hasConflict ? 'Team has scheduling conflict' : ''}">${game.away}</span></td>
            <td><span class="${gameTypeClass}">${game.gameType}</span></td>
        `;
        
        tbody.appendChild(row);
        
        // Update conflict tracking
        teamConflicts[game.home] = (teamConflicts[game.home] || 0) + 1;
        teamConflicts[game.away] = (teamConflicts[game.away] || 0) + 1;
    });
}

function exportSchedule() {
    if (!scheduler || !currentSchedule) {
        showAlert('No schedule to export', 'warning');
        return;
    }
    
    const csvContent = scheduler.exportToCSV(currentSchedule);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `hamilton-softball-schedule-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showAlert('Schedule exported to CSV!', 'success');
}

function resetSchedule() {
    document.getElementById('scheduleResults').style.display = 'none';
    document.getElementById('setupSection').style.display = 'block';
    document.getElementById('scheduleBody').innerHTML = '';
    // Don't set scheduler to null - keep the instance for reuse
    currentSchedule = [];
    console.log('Schedule reset, keeping scheduler instance');
}

function showAlert(message, type) {
    // Create alert container if it doesn't exist
    let alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alertContainer';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.right = '20px';
        alertContainer.style.zIndex = '9999';
        alertContainer.style.maxWidth = '400px';
        document.body.appendChild(alertContainer);
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Initialize sample team names
document.addEventListener('DOMContentLoaded', function() {
    const actualTeams = [
        'JAFT', 'Kibosh', 'One Hit Wonders', 'Landon Longballers', 
        'Foul Poles', 'Wayco', 'Steel City Sluggers', 
        'Pitch Don\'t Kill My Vibe', 'Basic Pitches', 'Alcoballics'
    ];
    
    document.getElementById('teamNames').value = actualTeams.join(', ');
});

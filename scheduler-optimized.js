// Hamilton Classic Co-Ed Softball League Scheduler - Optimized Logic Blueprint
class SoftballScheduler {
    constructor() {
        this.teams = [];
        this.diamonds = [
            { id: 5, name: 'Diamond 5', hasLights: true, slots: 2 },
            { id: 9, name: 'Diamond 9', hasLights: true, slots: 2 },
            { id: 12, name: 'Diamond 12', hasLights: true, slots: 2 },
            { id: 13, name: 'Diamond 13', hasLights: false, slots: 1 },
            { id: 14, name: 'Diamond 14', hasLights: false, slots: 1 }
        ];
        this.schedule = [];
        this.numTeams = 10;
        this.gamesPerTeam = 21; // 10 teams = 21 games
    }

    // Parse team names from input
    parseTeamNames(teamInput) {
        return teamInput.split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .slice(0, 10);
    }

    // Generate complete schedule following the Logic Blueprint
    generateSchedule(teamNames, seasonStart) {
        this.teams = teamNames;
        this.numTeams = this.teams.length;
        this.gamesPerTeam = this.numTeams === 9 ? 23 : 21;
        
        this.schedule = [];
        const startDate = new Date(seasonStart);
        
        // Step 1: Generate Round Robin Berger Table
        const bergerMatchups = this.generateBergerRoundRobin();
        
        // Step 2: Map games to diamond slots using Modulo rotation
        const scheduledGames = this.mapToDiamondSlots(bergerMatchups, startDate);
        
        // Step 3: Apply fairness constraints
        const optimizedSchedule = this.applyFairnessConstraints(scheduledGames);
        
        return optimizedSchedule;
    }

    // Generate Round Robin Berger Table for even number of teams
    generateBergerRoundRobin() {
        const matchups = [];
        const teams = [...this.teams];
        const rounds = this.teams.length - 1; // For 10 teams, 9 rounds
        const gamesPerRound = this.teams.length / 2; // 5 games per round
        
        // Berger Tables algorithm
        for (let round = 0; round < rounds; round++) {
            const roundMatchups = [];
            
            for (let i = 0; i < gamesPerRound; i++) {
                const homeIndex = i;
                const awayIndex = (teams.length - 1 - i) % teams.length;
                
                roundMatchups.push({
                    home: teams[homeIndex],
                    away: teams[awayIndex],
                    round: round,
                    game: i
                });
            }
            
            // Rotate teams (except first one) for next round
            const rotated = [teams[0]];
            for (let i = 2; i < teams.length; i++) {
                rotated.push(teams[i]);
            }
            rotated.push(teams[1]);
            teams.length = 0;
            teams.push(...rotated);
            
            matchups.push(...roundMatchups);
        }
        
        // For 10 teams, we need 2 full rounds to get 21 games per team
        if (this.numTeams === 10) {
            const secondRound = matchups.map(m => ({
                home: m.away,
                away: m.home,
                round: m.round + rounds,
                game: m.game
            }));
            matchups.push(...secondRound);
        }
        
        return matchups;
    }

    // Map games to diamond slots using Modulo rotation
    mapToDiamondSlots(matchups, startDate) {
        const scheduledGames = [];
        const allSlots = this.generateAllTimeSlots();
        
        matchups.forEach((matchup, index) => {
            const week = Math.floor(index / 5) + 1; // 5 games per week
            const gameIndexInWeek = index % 5;
            
            // Modulo rotation for diamond assignment
            const slotIndex = (week - 1 + gameIndexInWeek) % allSlots.length;
            const slot = allSlots[slotIndex];
            
            const gameDate = this.calculateGameDate(startDate, week);
            
            scheduledGames.push({
                week: week,
                date: gameDate,
                time: slot.time,
                diamond: slot.diamond,
                home: matchup.home,
                away: matchup.away,
                isDoubleHeader: slot.isDoubleHeader,
                slotType: slot.type // 'early' or 'late'
            });
        });
        
        return scheduledGames;
    }

    // Generate all available time slots
    generateAllTimeSlots() {
        const slots = [];
        
        // Lit diamonds (D5, D9, D12) - 2 slots each
        [5, 9, 12].forEach(diamond => {
            slots.push({ diamond, time: '6:30 PM', type: 'early', isDoubleHeader: false });
            slots.push({ diamond, time: '8:15 PM', type: 'late', isDoubleHeader: true });
        });
        
        // Non-lit diamonds (D13, D14) - 1 slot each
        [13, 14].forEach(diamond => {
            slots.push({ diamond, time: '6:30 PM', type: 'early', isDoubleHeader: false });
        });
        
        return slots; // Total: 8 slots (but we only use 5 per night)
    }

    // Apply fairness constraints
    applyFairnessConstraints(scheduledGames) {
        // Group games by week
        const weeks = {};
        scheduledGames.forEach(game => {
            if (!weeks[game.week]) {
                weeks[game.week] = [];
            }
            weeks[game.week].push(game);
        });
        
        // For each week, select optimal 5 games from available slots
        const optimizedSchedule = [];
        const teamStats = this.initializeTeamStats();
        
        Object.keys(weeks).sort((a, b) => a - b).forEach(week => {
            const weekGames = weeks[week];
            const selectedGames = this.selectOptimalGames(weekGames, teamStats);
            optimizedSchedule.push(...selectedGames);
        });
        
        return optimizedSchedule;
    }

    // Initialize team statistics for fairness tracking
    initializeTeamStats() {
        const stats = {};
        this.teams.forEach(team => {
            stats[team] = {
                d13Count: 0,
                d14Count: 0,
                earlyGames: 0,
                lateGames: 0,
                totalGames: 0
            };
        });
        return stats;
    }

    // Select optimal 5 games for a week based on fairness constraints
    selectOptimalGames(weekGames, teamStats) {
        // Sort games by fairness priority
        const sortedGames = weekGames.sort((a, b) => {
            // Priority 1: Balance D13/D14 appearances
            const aD13D14Balance = this.calculateD13D14Balance(a, teamStats);
            const bD13D14Balance = this.calculateD13D14Balance(b, teamStats);
            
            if (aD13D14Balance !== bD13D14Balance) {
                return aD13D14Balance - bD13D14Balance;
            }
            
            // Priority 2: Balance early/late games
            const aEarlyLateBalance = this.calculateEarlyLateBalance(a, teamStats);
            const bEarlyLateBalance = this.calculateEarlyLateBalance(b, teamStats);
            
            return aEarlyLateBalance - bEarlyLateBalance;
        });
        
        // Select first 5 games (the "5-Game Night" constraint)
        return sortedGames.slice(0, 5);
    }

    // Calculate D13/D14 balance score
    calculateD13D14Balance(game, teamStats) {
        const homeD13D14 = (game.diamond === 13 || game.diamond === 14) ? 
            Math.min(teamStats[game.home].d13Count, teamStats[game.home].d14Count) : 0;
        const awayD13D14 = (game.diamond === 13 || game.diamond === 14) ? 
            Math.min(teamStats[game.away].d13Count, teamStats[game.away].d14Count) : 0;
        
        return homeD13D14 + awayD13D14;
    }

    // Calculate early/late game balance score
    calculateEarlyLateBalance(game, teamStats) {
        const homeBalance = Math.abs(teamStats[game.home].earlyGames - teamStats[game.home].lateGames);
        const awayBalance = Math.abs(teamStats[game.away].earlyGames - teamStats[game.away].lateGames);
        
        return homeBalance + awayBalance;
    }

    // Calculate game date based on week number
    calculateGameDate(startDate, week) {
        const date = new Date(startDate);
        // Add (week - 1) weeks to start date
        date.setDate(date.getDate() + (week - 1) * 7);
        
        // Format as YYYY-MM-DD
        return date.toISOString().split('T')[0];
    }

    // Export schedule to JSON format
    exportToJSON() {
        return JSON.stringify(this.schedule, null, 2);
    }

    // Export schedule to CSV format
    exportToCSV() {
        const headers = ['Week', 'Diamond', 'Time', 'Home_Team', 'Away_Team', 'Game_Type'];
        const rows = this.schedule.map(game => [
            game.week,
            game.diamond,
            game.time,
            game.home,
            game.away,
            game.isDoubleHeader ? 'Double Header' : 'Single Game'
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Validate schedule meets all constraints
    validateSchedule() {
        const validation = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Check each team plays correct number of games
        const teamGameCounts = {};
        this.teams.forEach(team => {
            teamGameCounts[team] = 0;
        });

        this.schedule.forEach(game => {
            teamGameCounts[game.home]++;
            teamGameCounts[game.away]++;
        });

        this.teams.forEach(team => {
            if (teamGameCounts[team] !== this.gamesPerTeam) {
                validation.errors.push(`${team} plays ${teamGameCounts[team]} games, should be ${this.gamesPerTeam}`);
                validation.isValid = false;
            }
        });

        // Check 5-game night constraint
        const weekGameCounts = {};
        this.schedule.forEach(game => {
            weekGameCounts[game.week] = (weekGameCounts[game.week] || 0) + 1;
        });

        Object.keys(weekGameCounts).forEach(week => {
            if (weekGameCounts[week] !== 5) {
                validation.errors.push(`Week ${week} has ${weekGameCounts[week]} games, should be 5`);
                validation.isValid = false;
            }
        });

        return validation;
    }
}

// Global functions for UI interaction
let scheduler = null;
let currentSchedule = [];

function ensureScheduler() {
    if (!scheduler) {
        scheduler = new SoftballScheduler();
    }
    return scheduler;
}

function generateSchedule() {
    try {
        const schedulerInstance = ensureScheduler();
        
        const numTeams = parseInt(document.getElementById('numTeams').value);
        const seasonStart = document.getElementById('seasonStart').value;
        const teamNamesInput = document.getElementById('teamNames').value;
        
        if (!teamNamesInput.trim()) {
            alert('Please enter team names');
            return;
        }
        
        const teamNames = schedulerInstance.parseTeamNames(teamNamesInput);
        
        if (teamNames.length !== numTeams) {
            alert(`Please enter exactly ${numTeams} team names`);
            return;
        }
        
        // Show loading spinner
        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('setupSection').style.display = 'none';
        
        // Generate schedule
        const schedule = schedulerInstance.generateSchedule(teamNames, seasonStart);
        
        // Validate schedule
        const validation = schedulerInstance.validateSchedule();
        if (!validation.isValid) {
            console.error('Schedule validation failed:', validation.errors);
            alert('Schedule generated with errors: ' + validation.errors.join(', '));
        }
        
        // Display results
        displaySchedule(schedule);
        
    } catch (error) {
        console.error('Error generating schedule:', error);
        alert('Error generating schedule: ' + error.message);
    }
}

function displaySchedule(schedule) {
    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = '';
    
    let currentWeek = 0;
    schedule.forEach(game => {
        if (game.week !== currentWeek) {
            currentWeek = game.week;
            const weekRow = document.createElement('tr');
            weekRow.className = 'week-header';
            weekRow.innerHTML = `<td colspan="7">Week ${currentWeek}</td>`;
            scheduleBody.appendChild(weekRow);
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${game.week}</td>
            <td>${game.date}</td>
            <td><span class="game-time">${game.time}</span></td>
            <td>${game.diamond}${game.diamond === 13 || game.diamond === 14 ? '<span class="diamond-info no-lights">No lights</span>' : ''}</td>
            <td><span class="team-home">${game.home}</span></td>
            <td><span class="team-away">${game.away}</span></td>
            <td>${game.isDoubleHeader ? '<span class="double-header">Double Header</span>' : 'Single Game'}</td>
        `;
        scheduleBody.appendChild(row);
    });
    
    // Hide loading spinner and show results
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('scheduleResults').style.display = 'block';
}

function resetSchedule() {
    document.getElementById('scheduleResults').style.display = 'none';
    document.getElementById('setupSection').style.display = 'block';
    document.getElementById('loadingSpinner').style.display = 'none';
    scheduler = null;
}

function exportSchedule() {
    if (!scheduler || !scheduler.schedule.length) {
        alert('No schedule to export');
        return;
    }
    
    const csv = scheduler.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'softball-schedule.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function enterEditMode() {
    document.getElementById('editControls').style.display = 'block';
}

function saveChanges() {
    alert('Save changes feature coming soon!');
}

function cancelEdit() {
    document.getElementById('editControls').style.display = 'none';
}

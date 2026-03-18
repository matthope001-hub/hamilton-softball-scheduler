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
            
            // Schedule double headers on lit diamonds (skip diamonds 13 & 14)
            if (currentWeek <= Math.ceil(this.gamesPerTeam / 2) && this.numTeams === 10) {
                const doubleHeaderMatchups = this.createDoubleHeaders(shuffledMatchups, availableDiamonds, teamsPlayingThisWeek);
                if (doubleHeaderMatchups.length > 0) {
                    const doubleHeaderDate = new Date(currentDate);
                    doubleHeaderMatchups.forEach((dh, index) => {
                        const dhGame = {
                            week: currentWeek,
                            date: doubleHeaderDate,
                            time: index === 0 ? '18:30' : '20:15',
                            diamond: dh.diamond,
                            home: dh.home,
                            away: dh.away,
                            gameType: 'Double Header'
                        };
                        scheduledGames.push(dhGame);
                    });
                }
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

    // Create double header matchups
    createDoubleHeaders(remainingMatchups, availableDiamonds, teamsPlayingThisWeek) {
        const doubleHeaders = [];
        
        if (remainingMatchups.length >= 2 && availableDiamonds.length >= 2) {
            // Find two teams that haven't played this week and aren't already playing
            let matchup1 = null;
            let matchup2 = null;
            
            for (let i = 0; i < remainingMatchups.length; i++) {
                const game = remainingMatchups[i];
                if (!teamsPlayingThisWeek.has(game.home) && !teamsPlayingThisWeek.has(game.away)) {
                    if (!matchup1) {
                        matchup1 = game;
                    } else if (!matchup2) {
                        matchup2 = game;
                    }
                }
            }
            
            if (matchup1 && matchup2) {
                // Remove these matchups from remaining
                const index1 = remainingMatchups.indexOf(matchup1);
                const index2 = remainingMatchups.indexOf(matchup2);
                if (index1 > -1) remainingMatchups.splice(index1, 1);
                if (index2 > -1) remainingMatchups.splice(index2, 1);
                
                doubleHeaders.push({
                    home: matchup1.home,
                    away: matchup1.away,
                    diamond: availableDiamonds[0]
                });
                
                doubleHeaders.push({
                    home: matchup2.home,
                    away: matchup2.away,
                    diamond: availableDiamonds[1]
                });
            }
        }
        
        return doubleHeaders;
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

function generateSchedule() {
    console.log('Generate schedule button clicked');
    
    // Initialize scheduler FIRST before using any methods
    scheduler = new SoftballScheduler();
    console.log('Scheduler initialized');
    
    const teamInput = document.getElementById('teamNames').value;
    const numTeams = parseInt(document.getElementById('numTeams').value);
    const seasonStart = document.getElementById('seasonStart').value;
    
    console.log('Input values:', { teamInput, numTeams, seasonStart });
    
    // Validate input
    if (!teamInput || teamInput.trim().length === 0) {
        showAlert('Please enter team names', 'warning');
        return;
    }
    
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
}

function enterEditMode() {
    if (!currentSchedule || currentSchedule.length === 0) {
        showAlert('No schedule to edit', 'warning');
        return;
    }
    
    // Show edit controls, hide schedule table
    document.getElementById('scheduleResults').style.display = 'none';
    document.getElementById('editControls').style.display = 'block';
    
    // Initialize edit panel
    updateEditPanel();
}

function cancelEdit() {
    // Show schedule, hide edit controls
    document.getElementById('editControls').style.display = 'none';
    document.getElementById('scheduleResults').style.display = 'block';
    
    // Clear editing state
    editingGameIndex = null;
}

function saveChanges() {
    if (!validateChanges()) {
        return;
    }
    
    // Apply changes to currentSchedule
    applyChanges();
    
    // Return to schedule view
    cancelEdit();
    
    // Re-display updated schedule
    displaySchedule(currentSchedule);
    
    showAlert('Changes saved successfully!', 'success');
}

function updateEditPanel() {
    const editMode = document.getElementById('editMode').value;
    const editPanel = document.getElementById('editPanel');
    
    let panelHTML = '';
    
    switch (editMode) {
        case 'game':
            panelHTML = createGameEditPanel();
            break;
        case 'team':
            panelHTML = createTeamEditPanel();
            break;
        case 'diamond':
            panelHTML = createDiamondEditPanel();
            break;
        case 'add':
            panelHTML = createAddGamePanel();
            break;
        default:
            panelHTML = '<p>Select an edit mode above</p>';
    }
    
    editPanel.innerHTML = panelHTML;
}

function createGameEditPanel() {
    const gameOptions = currentSchedule.map((game, index) => 
        `<option value="${index}">Week ${game.week}: ${game.home} vs ${game.away}</option>`
    ).join('');
    
    return `
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Select Game to Edit</label>
                <select class="form-select" id="gameSelect" onchange="selectGame()">
                    <option value="">Choose a game...</option>
                    ${gameOptions}
                </select>
            </div>
        </div>
        <div id="gameEditForm" style="display: none;">
            <!-- Game edit form will be populated when game is selected -->
        </div>
    `;
}

function createTeamEditPanel() {
    const teams = scheduler ? scheduler.teams : [];
    const teamOptions = teams.map((team, index) => 
        `<option value="${index}">${team}</option>`
    ).join('');
    
    return `
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Select Team to Edit</label>
                <select class="form-select" id="teamSelect" onchange="selectTeam()">
                    <option value="">Choose a team...</option>
                    ${teamOptions}
                </select>
            </div>
        </div>
        <div id="teamEditForm" style="display: none;">
            <!-- Team edit form will be populated when team is selected -->
        </div>
    `;
}

function createDiamondEditPanel() {
    const diamonds = scheduler ? scheduler.diamonds : [];
    const diamondOptions = diamonds.map((diamond, index) => 
        `<option value="${index}">${diamond.name} (Lights: ${diamond.hasLights ? 'Yes' : 'No'})</option>`
    ).join('');
    
    return `
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Select Diamond to Edit</label>
                <select class="form-select" id="diamondSelect" onchange="selectDiamond()">
                    <option value="">Choose a diamond...</option>
                    ${diamondOptions}
                </select>
            </div>
        </div>
        <div id="diamondEditForm" style="display: none;">
            <!-- Diamond edit form will be populated when diamond is selected -->
        </div>
    `;
}

function createAddGamePanel() {
    const teams = scheduler ? scheduler.teams : [];
    const teamOptions = teams.map((team, index) => 
        `<option value="${index}">${team}</option>`
    ).join('');
    
    const diamonds = scheduler ? scheduler.diamonds : [];
    const diamondOptions = diamonds.map((diamond, index) => 
        `<option value="${index}">${diamond.name}</option>`
    ).join('');
    
    return `
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Home Team</label>
                <select class="form-select" id="addHomeTeam">
                    <option value="">Select home team...</option>
                    ${teamOptions}
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label">Away Team</label>
                <select class="form-select" id="addAwayTeam">
                    <option value="">Select away team...</option>
                    ${teamOptions}
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-4">
                <label class="form-label">Diamond</label>
                <select class="form-select" id="addDiamond">
                    <option value="">Select diamond...</option>
                    ${diamondOptions}
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Date</label>
                <input type="date" class="form-control" id="addDate">
            </div>
            <div class="col-md-4">
                <label class="form-label">Time</label>
                <select class="form-select" id="addTime">
                    <option value="18:30">6:30 PM</option>
                    <option value="20:15">8:15 PM</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-12">
                <button class="btn btn-primary" onclick="addNewGame()">
                    <i class="fas fa-plus me-1"></i>
                    Add Game
                </button>
            </div>
        </div>
    `;
}

function selectGame() {
    const gameIndex = document.getElementById('gameSelect').value;
    if (gameIndex === '') return;
    
    editingGameIndex = parseInt(gameIndex);
    const game = currentSchedule[editingGameIndex];
    
    const formHTML = `
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Home Team</label>
                <input type="text" class="form-control" id="editHomeTeam" value="${game.home}">
            </div>
            <div class="col-md-6">
                <label class="form-label">Away Team</label>
                <input type="text" class="form-control" id="editAwayTeam" value="${game.away}">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-4">
                <label class="form-label">Diamond</label>
                <select class="form-select" id="editDiamond">
                    ${scheduler.diamonds.map(d => 
                        `<option value="${d.id}" ${game.diamond.id === d.id ? 'selected' : ''}>${d.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Date</label>
                <input type="date" class="form-control" id="editDate" value="${game.date.toISOString().split('T')[0]}">
            </div>
            <div class="col-md-4">
                <label class="form-label">Time</label>
                <select class="form-select" id="editTime">
                    <option value="18:30" ${game.time === '18:30' ? 'selected' : ''}>6:30 PM</option>
                    <option value="20:15" ${game.time === '20:15' ? 'selected' : ''}>8:15 PM</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Game Type</label>
                <select class="form-select" id="editGameType">
                    <option value="Single" ${game.gameType === 'Single' ? 'selected' : ''}>Single Game</option>
                    <option value="Double Header" ${game.gameType === 'Double Header' ? 'selected' : ''}>Double Header</option>
                </select>
            </div>
            <div class="col-md-6">
                <button class="btn btn-danger btn-sm" onclick="deleteGame(${editingGameIndex})">
                    <i class="fas fa-trash me-1"></i>
                    Delete Game
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('gameEditForm').innerHTML = formHTML;
    document.getElementById('gameEditForm').style.display = 'block';
}

function selectTeam() {
    const teamIndex = document.getElementById('teamSelect').value;
    if (teamIndex === '') return;
    
    const teamName = scheduler.teams[teamIndex];
    
    const formHTML = `
        <div class="row mb-3">
            <div class="col-md-12">
                <label class="form-label">New Team Name</label>
                <input type="text" class="form-control" id="editTeamName" value="${teamName}">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-12">
                <button class="btn btn-primary" onclick="updateTeamName(${teamIndex})">
                    <i class="fas fa-save me-1"></i>
                    Update Team Name
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('teamEditForm').innerHTML = formHTML;
    document.getElementById('teamEditForm').style.display = 'block';
}

function selectDiamond() {
    const diamondIndex = document.getElementById('diamondSelect').value;
    if (diamondIndex === '') return;
    
    const diamond = scheduler.diamonds[diamondIndex];
    
    const formHTML = `
        <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">Diamond Name</label>
                <input type="text" class="form-control" id="editDiamondName" value="${diamond.name}">
            </div>
            <div class="col-md-6">
                <label class="form-label">Lighting Available</label>
                <select class="form-select" id="editDiamondLights">
                    <option value="true" ${diamond.hasLights ? 'selected' : ''}>Yes</option>
                    <option value="false" ${!diamond.hasLights ? 'selected' : ''}>No</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-12">
                <button class="btn btn-primary" onclick="updateDiamond(${diamondIndex})">
                    <i class="fas fa-save me-1"></i>
                    Update Diamond
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('diamondEditForm').innerHTML = formHTML;
    document.getElementById('diamondEditForm').style.display = 'block';
}

function updateTeamName(teamIndex) {
    const newName = document.getElementById('editTeamName').value.trim();
    if (!newName) {
        showAlert('Team name cannot be empty', 'warning');
        return;
    }
    
    // Update team name in scheduler
    scheduler.teams[teamIndex] = newName;
    
    // Update all games with this team
    currentSchedule.forEach(game => {
        if (game.home === scheduler.teams[teamIndex]) {
            game.home = newName;
        }
        if (game.away === scheduler.teams[teamIndex]) {
            game.away = newName;
        }
    });
    
    showAlert(`Team name updated to: ${newName}`, 'success');
}

function updateDiamond(diamondIndex) {
    const name = document.getElementById('editDiamondName').value.trim();
    const hasLights = document.getElementById('editDiamondLights').value === 'true';
    
    if (!name) {
        showAlert('Diamond name cannot be empty', 'warning');
        return;
    }
    
    // Update diamond in scheduler
    scheduler.diamonds[diamondIndex] = { ...scheduler.diamonds[diamondIndex], name, hasLights };
    
    // Update all games with this diamond
    currentSchedule.forEach(game => {
        if (game.diamond.id === scheduler.diamonds[diamondIndex].id) {
            game.diamond = scheduler.diamonds[diamondIndex];
        }
    });
    
    showAlert(`Diamond updated to: ${name}`, 'success');
}

function deleteGame(gameIndex) {
    if (!confirm('Are you sure you want to delete this game?')) {
        return;
    }
    
    currentSchedule.splice(gameIndex, 1);
    editingGameIndex = null;
    
    // Clear game edit form
    document.getElementById('gameEditForm').style.display = 'none';
    document.getElementById('gameSelect').value = '';
    
    showAlert('Game deleted successfully', 'success');
}

function addNewGame() {
    const homeTeam = document.getElementById('addHomeTeam').value;
    const awayTeam = document.getElementById('addAwayTeam').value;
    const diamondIndex = document.getElementById('addDiamond').value;
    const date = document.getElementById('addDate').value;
    const time = document.getElementById('addTime').value;
    
    if (!homeTeam || !awayTeam || !diamondIndex || !date) {
        showAlert('Please fill in all game details', 'warning');
        return;
    }
    
    const diamond = scheduler.diamonds[diamondIndex];
    
    const newGame = {
        week: Math.max(...currentSchedule.map(g => g.week)) + 1,
        date: new Date(date),
        time: time,
        diamond: diamond,
        home: homeTeam,
        away: awayTeam,
        gameType: 'Single'
    };
    
    currentSchedule.push(newGame);
    
    // Clear form
    document.getElementById('addHomeTeam').value = '';
    document.getElementById('addAwayTeam').value = '';
    document.getElementById('addDiamond').value = '';
    document.getElementById('addDate').value = '';
    
    showAlert('Game added successfully', 'success');
}

function validateChanges() {
    // Basic validation - can be expanded
    return true;
}

function applyChanges() {
    // Apply changes based on current edit mode
    const editMode = document.getElementById('editMode').value;
    
    switch (editMode) {
        case 'game':
            // Game changes are applied in real-time
            break;
        case 'team':
            // Team changes are applied in real-time
            break;
        case 'diamond':
            // Diamond changes are applied in real-time
            break;
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
    if (!scheduler || !scheduler.schedule) {
        showAlert('No schedule to export', 'warning');
        return;
    }
    
    const csvContent = scheduler.exportToCSV(scheduler.schedule);
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
    scheduler = null;
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

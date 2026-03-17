// March Madness Bracket Tracker with Google Sheets Integration
class MarchMadnessBracket {
    constructor() {
        this.teams = this.initializeTeams();
        this.bracket = this.initializeBracket();
        this.currentUser = null;
        this.allBrackets = {};
        this.tournamentResults = this.initializeBracket();
        this.standardScoring = [1, 2, 4, 8, 16, 32];
        this.autoUpdateInterval = null;
        this.autoUpdateEnabled = false;
        this.apiKey = null;
        this.sheetId = null;
        this.useGoogleSheets = false;
        this.init();
    }

    initializeTeams() {
        return {
            midwest: [
                { seed: 1, name: "Purdue" }, { seed: 16, name: "Fairleigh Dickinson" },
                { seed: 8, name: "Utah State" }, { seed: 9, name: "TCU" },
                { seed: 5, name: "Kansas" }, { seed: 12, name: "Samford" },
                { seed: 4, name: "Creighton" }, { seed: 13, name: "Akron" },
                { seed: 6, name: "Texas Tech" }, { seed: 11, name: "NC State" },
                { seed: 3, name: "Kentucky" }, { seed: 14, name: "Colgate" },
                { seed: 7, name: "Michigan State" }, { seed: 10, name: "Colorado" },
                { seed: 2, name: "Marquette" }, { seed: 15, name: "Vermont" }
            ],
            west: [
                { seed: 1, name: "North Carolina" }, { seed: 16, name: "Howard" },
                { seed: 8, name: "Mississippi State" }, { seed: 9, name: "Michigan" },
                { seed: 5, name: "San Diego State" }, { seed: 12, name: "UAB" },
                { seed: 4, name: "Arizona" }, { seed: 13, name: "Long Beach State" },
                { seed: 6, name: "BYU" }, { seed: 11, name: "Duquesne" },
                { seed: 3, name: "Baylor" }, { seed: 14, name: "Yale" },
                { seed: 7, name: "Washington State" }, { seed: 10, name: "Drake" },
                { seed: 2, name: "Iowa" }, { seed: 15, name: "South Dakota State" }
            ],
            east: [
                { seed: 1, name: "Houston" }, { seed: 16, name: "Northern Kentucky" },
                { seed: 8, name: "Nebraska" }, { seed: 9, name: "Texas A&M" },
                { seed: 5, name: "Wisconsin" }, { seed: 12, name: "James Madison" },
                { seed: 4, name: "Duke" }, { seed: 13, name: "Vermont" },
                { seed: 6, name: "Illinois" }, { seed: 11, name: "Oregon" },
                { seed: 3, name: "Illinois" }, { seed: 14, name: "Morehead State" },
                { seed: 7, name: "Florida Atlantic" }, { seed: 10, name: "Northwestern" },
                { seed: 2, name: "Connecticut" }, { seed: 15, name: "Stetson" }
            ],
            south: [
                { seed: 1, name: "Alabama" }, { seed: 16, name: "Texas A&M-Corpus Christi" },
                { seed: 8, name: "Maryland" }, { seed: 9, name: "West Virginia" },
                { seed: 5, name: "Gonzaga" }, { seed: 12, name: "McNeese" },
                { seed: 4, name: "Auburn" }, { seed: 13, name: "Charleston" },
                { seed: 6, name: "Dayton" }, { seed: 11, name: "VCU" },
                { seed: 3, name: "Kansas" }, { seed: 14, name: "Samford" },
                { seed: 7, name: "Washington" }, { seed: 10, name: "Utah" },
                { seed: 2, name: "Arizona" }, { seed: 15, name: "Longwood" }
            ]
        };
    }

    initializeBracket() {
        const bracket = { round1: [], round2: [], round3: [], round4: [], round5: [], round6: [] };
        
        // Initialize Round 1
        const regions = ['midwest', 'west', 'east', 'south'];
        regions.forEach(region => {
            for (let i = 0; i < this.teams[region].length; i += 2) {
                bracket.round1.push({
                    id: `${region}_${i/2}`,
                    team1: this.teams[region][i],
                    team2: this.teams[region][i + 1],
                    winner: null
                });
            }
        });
        
        // Initialize subsequent rounds
        const rounds = [32, 16, 8, 4, 2];
        rounds.forEach((count, roundIndex) => {
            const roundNum = roundIndex + 2;
            bracket[`round${roundNum}`] = Array(count/2).fill(null).map((_, i) => ({
                id: `r${roundNum}_${i}`,
                team1: null,
                team2: null,
                winner: null
            }));
        });
        
        return bracket;
    }

    init() {
        this.loadLocalData();
        this.attachEventListeners();
        this.showUserSection();
        this.checkForGoogleSheetsConfig();
    }

    checkForGoogleSheetsConfig() {
        // Check if Google Sheets configuration exists
        this.apiKey = localStorage.getItem('googleSheetsApiKey');
        this.sheetId = localStorage.getItem('googleSheetsId');
        this.useGoogleSheets = this.apiKey && this.sheetId;
        
        if (this.useGoogleSheets) {
            this.showNotification('Google Sheets integration enabled', 'success');
            this.loadFromGoogleSheets();
        }
    }

    async loadFromGoogleSheets() {
        if (!this.useGoogleSheets) return;
        
        try {
            // Load brackets from Google Sheets
            const bracketsData = await this.fetchSheetData('Brackets');
            if (bracketsData) {
                this.processBracketsData(bracketsData);
            }
            
            // Load results from Google Sheets
            const resultsData = await this.fetchSheetData('Results');
            if (resultsData) {
                this.processResultsData(resultsData);
            }
            
            this.showNotification('Data loaded from Google Sheets', 'success');
        } catch (error) {
            console.error('Error loading from Google Sheets:', error);
            this.showNotification('Error loading from Google Sheets', 'error');
        }
    }

    async fetchSheetData(sheetName) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}?key=${this.apiKey}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.values;
        } catch (error) {
            console.error('Error fetching sheet data:', error);
            return null;
        }
    }

    processBracketsData(data) {
        if (!data || data.length < 2) return;
        
        // Skip header row
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row[0]) { // UserName exists
                this.allBrackets[row[0]] = {
                    bracket: JSON.parse(row[1] || '{}'),
                    score: parseInt(row[7] || '0'),
                    submitted: row[8] === 'TRUE',
                    timestamp: row[9] || new Date().toISOString()
                };
            }
        }
    }

    processResultsData(data) {
        if (!data || data.length < 2) return;
        
        // Process results data
        // This would need custom logic based on your sheet structure
        // For now, we'll keep the local results
    }

    async saveToGoogleSheets() {
        if (!this.useGoogleSheets) return;
        
        try {
            // Save brackets to Google Sheets
            await this.saveBracketsToSheets();
            
            // Save results to Google Sheets
            await this.saveResultsToSheets();
            
            this.showNotification('Data saved to Google Sheets', 'success');
        } catch (error) {
            console.error('Error saving to Google Sheets:', error);
            this.showNotification('Error saving to Google Sheets', 'error');
        }
    }

    async saveBracketsToSheets() {
        const rows = [['UserName', 'Round1_Picks', 'Round2_Picks', 'Round3_Picks', 'Round4_Picks', 'Round5_Picks', 'Round6_Picks', 'Score', 'Submitted', 'Timestamp']];
        
        Object.entries(this.allBrackets).forEach(([userName, data]) => {
            rows.push([
                userName,
                JSON.stringify(data.bracket.round1 || []),
                JSON.stringify(data.bracket.round2 || []),
                JSON.stringify(data.bracket.round3 || []),
                JSON.stringify(data.bracket.round4 || []),
                JSON.stringify(data.bracket.round5 || []),
                JSON.stringify(data.bracket.round6 || []),
                data.score.toString(),
                data.submitted ? 'TRUE' : 'FALSE',
                data.timestamp
            ]);
        });
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Brackets:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
        
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: rows })
        });
    }

    async saveResultsToSheets() {
        const rows = [['Round', 'MatchupID', 'Team1', 'Team2', 'Winner', 'Timestamp']];
        
        // Process all rounds
        for (let round = 1; round <= 6; round++) {
            const roundData = this.tournamentResults[`round${round}`];
            roundData.forEach((matchup, index) => {
                if (matchup.team1 && matchup.team2) {
                    rows.push([
                        round.toString(),
                        matchup.id,
                        JSON.stringify(matchup.team1),
                        JSON.stringify(matchup.team2),
                        matchup.winner ? JSON.stringify(matchup.winner) : '',
                        new Date().toISOString()
                    ]);
                }
            });
        }
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/Results:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
        
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: rows })
        });
    }

    configureGoogleSheets() {
        const apiKey = prompt('Enter your Google Sheets API Key:');
        const sheetId = prompt('Enter your Google Sheet ID:');
        
        if (apiKey && sheetId) {
            this.apiKey = apiKey;
            this.sheetId = sheetId;
            this.useGoogleSheets = true;
            
            localStorage.setItem('googleSheetsApiKey', apiKey);
            localStorage.setItem('googleSheetsId', sheetId);
            
            this.showNotification('Google Sheets configured successfully!', 'success');
            this.loadFromGoogleSheets();
        }
    }

    showUserSection() {
        document.getElementById('userSection').style.display = 'flex';
        document.getElementById('bracketSection').style.display = 'none';
    }

    showBracketSection() {
        document.getElementById('userSection').style.display = 'none';
        document.getElementById('bracketSection').style.display = 'block';
        document.getElementById('currentUser').textContent = this.currentUser;
        this.renderBracket();
        this.updateScore();
        this.updateLeaderboard();
        this.updateTournamentResults();
    }

    attachEventListeners() {
        // User registration
        document.getElementById('startBracket').addEventListener('click', () => this.startBracket());
        document.getElementById('userName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startBracket();
        });

        // User management
        document.getElementById('switchUser').addEventListener('click', () => this.switchUser());

        // Bracket controls
        document.getElementById('resetBtn').addEventListener('click', () => this.resetBracket());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveBracket());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitBracket());

        // Google Sheets controls
        document.getElementById('configureSheets')?.addEventListener('click', () => this.configureGoogleSheets());
        document.getElementById('syncSheets')?.addEventListener('click', () => this.syncWithSheets());

        // Team selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.team')) {
                const teamDiv = e.target.closest('.team');
                const matchupDiv = teamDiv.closest('.matchup');
                const matchupId = matchupDiv.dataset.matchupId;
                const teamIndex = parseInt(teamDiv.dataset.team);
                
                this.selectWinner(matchupId, teamIndex);
            }
        });

        // Admin controls
        document.getElementById('adminMode').addEventListener('click', () => this.toggleAdminPanel());
        document.getElementById('updateResults').addEventListener('click', () => this.updateResults());

        // Auto results controls
        document.getElementById('autoResults').addEventListener('click', () => this.toggleAutoUpdate());
        document.getElementById('simulateResults').addEventListener('click', () => this.simulateFullTournament());

        // Leaderboard sorting
        document.getElementById('sortBy').addEventListener('change', () => this.updateLeaderboard());
    }

    async syncWithSheets() {
        if (!this.useGoogleSheets) {
            this.showNotification('Please configure Google Sheets first', 'error');
            return;
        }
        
        await this.loadFromGoogleSheets();
        await this.saveToGoogleSheets();
    }

    startBracket() {
        const userName = document.getElementById('userName').value.trim();
        const errorDiv = document.getElementById('userError');
        
        if (!userName) {
            errorDiv.textContent = 'Please enter your name';
            return;
        }
        
        if (userName.length < 2) {
            errorDiv.textContent = 'Name must be at least 2 characters';
            return;
        }
        
        this.currentUser = userName;
        this.loadUserBracket();
        this.showBracketSection();
        errorDiv.textContent = '';
    }

    switchUser() {
        if (this.currentUser) {
            this.saveBracket();
        }
        this.currentUser = null;
        this.bracket = this.initializeBracket();
        document.getElementById('userName').value = '';
        this.showUserSection();
    }

    loadUserBracket() {
        if (this.allBrackets[this.currentUser]) {
            this.bracket = this.allBrackets[this.currentUser].bracket;
        } else {
            this.bracket = this.initializeBracket();
        }
    }

    loadLocalData() {
        const saved = localStorage.getItem('marchMadnessBrackets2026');
        this.allBrackets = saved ? JSON.parse(saved) : {};
        
        const results = localStorage.getItem('marchMadnessResults2026');
        this.tournamentResults = results ? JSON.parse(results) : this.initializeBracket();
    }

    saveLocalData() {
        localStorage.setItem('marchMadnessBrackets2026', JSON.stringify(this.allBrackets));
        localStorage.setItem('marchMadnessResults2026', JSON.stringify(this.tournamentResults));
    }

    renderBracket() {
        for (let i = 1; i <= 6; i++) {
            this.renderRound(`round${i}`, this.bracket[`round${i}`]);
        }
    }

    renderRound(roundId, matchups) {
        const container = document.getElementById(roundId);
        container.innerHTML = '';
        
        matchups.forEach(matchup => {
            const matchupDiv = document.createElement('div');
            matchupDiv.className = 'matchup';
            matchupDiv.dataset.matchupId = matchup.id;
            
            const team1Div = this.createTeamElement(matchup.team1, matchup.winner, 1);
            const team2Div = this.createTeamElement(matchup.team2, matchup.winner, 2);
            
            matchupDiv.appendChild(team1Div);
            matchupDiv.appendChild(team2Div);
            container.appendChild(matchupDiv);
        });
    }

    createTeamElement(team, winner, teamIndex) {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';
        teamDiv.dataset.team = teamIndex;
        
        if (team) {
            teamDiv.innerHTML = `
                <span class="team-name">${team.seed} ${team.name}</span>
                <span class="team-seed">${team.seed}</span>
            `;
            
            if (winner && winner.seed === team.seed && winner.name === team.name) {
                teamDiv.classList.add('selected');
            }
        }
        
        return teamDiv;
    }

    selectWinner(matchupId, teamIndex) {
        let matchup = null;
        let roundNumber = null;
        
        for (let i = 1; i <= 6; i++) {
            const round = this.bracket[`round${i}`];
            const found = round.find(m => m.id === matchupId);
            if (found) {
                matchup = found;
                roundNumber = i;
                break;
            }
        }
        
        if (!matchup || !matchup.team1 || !matchup.team2) return;
        
        matchup.winner = teamIndex === 1 ? matchup.team1 : matchup.team2;
        
        if (roundNumber < 6) {
            this.updateNextRound(roundNumber, matchupId, matchup.winner);
        }
        
        this.renderBracket();
        this.updateScore();
    }

    updateNextRound(currentRound, matchupId, winner) {
        const nextRound = currentRound + 1;
        const matchupIndex = parseInt(matchupId.split('_')[1]);
        const nextMatchupIndex = Math.floor(matchupIndex / 2);
        
        const nextMatchup = this.bracket[`round${nextRound}`][nextMatchupIndex];
        
        if (matchupIndex % 2 === 0) {
            nextMatchup.team1 = winner;
        } else {
            nextMatchup.team2 = winner;
        }
    }

    calculateScore(userBracket, resultsBracket = null) {
        let score = 0;
        const results = resultsBracket || this.tournamentResults;
        
        for (let round = 1; round <= 6; round++) {
            const userRound = userBracket[`round${round}`];
            const resultsRound = results[`round${round}`];
            
            userRound.forEach((matchup, index) => {
                const resultMatchup = resultsRound[index];
                if (matchup.winner && resultMatchup.winner) {
                    if (matchup.winner.seed === resultMatchup.winner.seed && 
                        matchup.winner.name === resultMatchup.winner.name) {
                        score += this.standardScoring[round - 1];
                    }
                }
            });
        }
        
        return score;
    }

    updateScore() {
        const score = this.calculateScore(this.bracket);
        document.getElementById('currentScore').textContent = score;
        
        const isComplete = this.isBracketComplete(this.bracket);
        const statusElement = document.getElementById('bracketStatus');
        if (isComplete) {
            statusElement.textContent = 'Complete';
            statusElement.style.color = '#48bb78';
        } else {
            statusElement.textContent = 'In Progress';
            statusElement.style.color = '#ed8936';
        }
        
        let possibleScore = 0;
        for (let i = 0; i < this.standardScoring.length; i++) {
            possibleScore += this.standardScoring[i] * Math.pow(2, 5 - i);
        }
        document.getElementById('possibleScore').textContent = possibleScore;
    }

    isBracketComplete(bracket) {
        return bracket.round6[0].winner !== null;
    }

    async saveBracket() {
        this.allBrackets[this.currentUser] = {
            bracket: this.bracket,
            score: this.calculateScore(this.bracket),
            submitted: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveLocalData();
        
        if (this.useGoogleSheets) {
            await this.saveToGoogleSheets();
        }
        
        this.showNotification('Bracket saved successfully!', 'success');
    }

    async submitBracket() {
        if (!this.isBracketComplete(this.bracket)) {
            this.showNotification('Please complete your bracket before submitting!', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to submit your bracket? This will finalize your predictions.')) {
            this.allBrackets[this.currentUser] = {
                bracket: this.bracket,
                score: this.calculateScore(this.bracket),
                submitted: true,
                timestamp: new Date().toISOString()
            };
            
            this.saveLocalData();
            
            if (this.useGoogleSheets) {
                await this.saveToGoogleSheets();
            }
            
            this.updateLeaderboard();
            this.showNotification('Bracket submitted successfully!', 'success');
        }
    }

    updateLeaderboard() {
        const sortBy = document.getElementById('sortBy').value;
        const leaderboardList = document.getElementById('leaderboardList');
        
        const entries = Object.entries(this.allBrackets).map(([name, data]) => ({
            name,
            score: this.calculateScore(data.bracket),
            submitted: data.submitted,
            timestamp: data.timestamp
        }));
        
        entries.sort((a, b) => {
            switch (sortBy) {
                case 'score': return b.score - a.score;
                case 'name': return a.name.localeCompare(b.name);
                case 'submitted': return new Date(b.timestamp) - new Date(a.timestamp);
                default: return 0;
            }
        });
        
        leaderboardList.innerHTML = '';
        
        if (entries.length === 0) {
            leaderboardList.innerHTML = '<p class="no-entries">No brackets submitted yet</p>';
            return;
        }
        
        entries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'leaderboard-entry';
            
            const rankClass = index === 0 ? 'rank-gold' : index === 1 ? 'rank-silver' : index === 2 ? 'rank-bronze' : '';
            
            entryDiv.innerHTML = `
                <span class="leaderboard-rank ${rankClass}">#${index + 1}</span>
                <span class="leaderboard-name">${entry.name} ${entry.submitted ? '✓' : ''}</span>
                <span class="leaderboard-score">${entry.score}</span>
            `;
            
            leaderboardList.appendChild(entryDiv);
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#48bb78' : '#e53e3e'};
            color: white;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Include other methods from previous implementation...
    toggleAdminPanel() {
        const panel = document.getElementById('adminPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    updateResults() {
        const round = parseInt(document.getElementById('resultRound').value);
        if (confirm(`Update results for Round ${round}? This will recalculate all scores.`)) {
            this.simulateResults(round);
            this.saveLocalData();
            this.updateScore();
            this.updateLeaderboard();
            this.updateTournamentResults();
            this.showNotification(`Results updated for Round ${round}`, 'success');
        }
    }

    simulateResults(round) {
        const resultsRound = this.tournamentResults[`round${round}`];
        resultsRound.forEach(matchup => {
            if (matchup.team1 && matchup.team2) {
                matchup.winner = Math.random() > 0.5 ? matchup.team1 : matchup.team2;
            }
        });
    }

    toggleAutoUpdate() {
        if (this.autoUpdateEnabled) {
            this.disableAutoUpdate();
        } else {
            this.enableAutoUpdate();
        }
    }

    enableAutoUpdate() {
        this.autoUpdateEnabled = true;
        const statusDiv = document.getElementById('resultsStatus');
        statusDiv.textContent = 'Auto-update: Active';
        statusDiv.classList.add('active');
        
        this.autoUpdateInterval = setInterval(() => {
            this.fetchTournamentResults();
        }, 5 * 60 * 1000);
        
        this.fetchTournamentResults();
    }

    disableAutoUpdate() {
        this.autoUpdateEnabled = false;
        const statusDiv = document.getElementById('resultsStatus');
        statusDiv.textContent = 'Auto-update: Off';
        statusDiv.classList.remove('active');
        
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
            this.autoUpdateInterval = null;
        }
    }

    async fetchTournamentResults() {
        try {
            const results = await this.getRealTournamentResults();
            if (results) {
                this.tournamentResults = results;
                this.saveLocalData();
                this.updateScore();
                this.updateLeaderboard();
                this.updateTournamentResults();
                this.showNotification('Tournament results updated!', 'success');
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    }

    async getRealTournamentResults() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.tournamentResults;
    }

    simulateFullTournament() {
        if (confirm('Simulate entire tournament? This will generate random results for all rounds.')) {
            this.generateTournamentResults();
            this.saveLocalData();
            this.updateScore();
            this.updateLeaderboard();
            this.updateTournamentResults();
            this.showNotification('Tournament simulation complete!', 'success');
        }
    }

    generateTournamentResults() {
        const upsets = [0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
        
        this.tournamentResults.round1.forEach(matchup => {
            if (matchup.team1 && matchup.team2) {
                const seedDiff = Math.abs(matchup.team1.seed - matchup.team2.seed);
                const upsetChance = upsets[0] + (seedDiff * 0.02);
                const isUpset = Math.random() < upsetChance;
                
                if (isUpset) {
                    matchup.winner = matchup.team1.seed > matchup.team2.seed ? matchup.team1 : matchup.team2;
                } else {
                    matchup.winner = matchup.team1.seed < matchup.team2.seed ? matchup.team1 : matchup.team2;
                }
            }
        });
        
        for (let round = 2; round <= 6; round++) {
            const prevRound = `round${round - 1}`;
            const currentRound = `round${round}`;
            
            this.tournamentResults[prevRound].forEach((matchup, index) => {
                if (matchup.winner) {
                    const nextMatchupIndex = Math.floor(index / 2);
                    const nextMatchup = this.tournamentResults[currentRound][nextMatchupIndex];
                    
                    if (index % 2 === 0) {
                        nextMatchup.team1 = matchup.winner;
                    } else {
                        nextMatchup.team2 = matchup.winner;
                    }
                }
            });
            
            this.tournamentResults[currentRound].forEach(matchup => {
                if (matchup.team1 && matchup.team2) {
                    const seedDiff = Math.abs(matchup.team1.seed - matchup.team2.seed);
                    const upsetChance = upsets[round - 1] + (seedDiff * 0.02);
                    const isUpset = Math.random() < upsetChance;
                    
                    if (isUpset) {
                        matchup.winner = matchup.team1.seed > matchup.team2.seed ? matchup.team1 : matchup.team2;
                    } else {
                        matchup.winner = matchup.team1.seed < matchup.team2.seed ? matchup.team1 : matchup.team2;
                    }
                }
            });
        }
    }

    updateTournamentResults() {
        const resultsDiv = document.getElementById('actualResults');
        
        let hasResults = false;
        for (let i = 1; i <= 6; i++) {
            const round = this.tournamentResults[`round${i}`];
            if (round.some(m => m.winner)) {
                hasResults = true;
                break;
            }
        }
        
        if (!hasResults) {
            resultsDiv.innerHTML = '<p>No tournament results entered yet</p>';
            return;
        }
        
        let html = '';
        for (let round = 1; round <= 6; round++) {
            const roundResults = this.tournamentResults[`round${round}`];
            const winners = roundResults.filter(m => m.winner).map(m => m.winner);
            
            if (winners.length > 0) {
                const roundNames = ['', 'Round 1', 'Round 2', 'Sweet 16', 'Elite 8', 'Final 4', 'Championship'];
                html += `<div class="result-round">
                    <h4>${roundNames[round]}</h4>
                    <div class="winners-list">${winners.map(w => `${w.seed} ${w.name}`).join(', ')}</div>
                </div>`;
            }
        }
        
        resultsDiv.innerHTML = html;
    }

    resetBracket() {
        if (confirm('Are you sure you want to reset your bracket?')) {
            this.bracket = this.initializeBracket();
            this.renderBracket();
            this.updateScore();
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the bracket tracker
document.addEventListener('DOMContentLoaded', () => {
    new MarchMadnessBracket();
});

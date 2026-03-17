// Enhanced March Madness Bracket Tracker 2026 with Multi-User Support
class MarchMadnessBracket {
    constructor() {
        this.teams = this.initializeTeams();
        this.bracket = this.initializeBracket();
        this.currentUser = null;
        this.allBrackets = this.loadAllBrackets();
        this.tournamentResults = this.loadTournamentResults();
        this.standardScoring = [1, 2, 4, 8, 16, 32]; // Standard March Madness scoring
        this.init();
    }

    initializeTeams() {
        return {
            // 2026 March Madness Teams (simulated realistic bracket)
            midwest: [
                { seed: 1, name: "Purdue" },
                { seed: 16, name: "Fairleigh Dickinson" },
                { seed: 8, name: "Utah State" },
                { seed: 9, name: "TCU" },
                { seed: 5, name: "Kansas" },
                { seed: 12, name: "Samford" },
                { seed: 4, name: "Creighton" },
                { seed: 13, name: "Akron" },
                { seed: 6, name: "Texas Tech" },
                { seed: 11, name: "NC State" },
                { seed: 3, name: "Kentucky" },
                { seed: 14, name: "Colgate" },
                { seed: 7, name: "Michigan State" },
                { seed: 10, name: "Colorado" },
                { seed: 2, name: "Marquette" },
                { seed: 15, name: "Vermont" }
            ],
            west: [
                { seed: 1, name: "North Carolina" },
                { seed: 16, name: "Howard" },
                { seed: 8, name: "Mississippi State" },
                { seed: 9, name: "Michigan" },
                { seed: 5, name: "San Diego State" },
                { seed: 12, name: "UAB" },
                { seed: 4, name: "Arizona" },
                { seed: 13, name: "Long Beach State" },
                { seed: 6, name: "BYU" },
                { seed: 11, name: "Duquesne" },
                { seed: 3, name: "Baylor" },
                { seed: 14, name: "Yale" },
                { seed: 7, name: "Washington State" },
                { seed: 10, name: "Drake" },
                { seed: 2, name: "Iowa" },
                { seed: 15, name: "South Dakota State" }
            ],
            east: [
                { seed: 1, name: "Houston" },
                { seed: 16, name: "Northern Kentucky" },
                { seed: 8, name: "Nebraska" },
                { seed: 9, name: "Texas A&M" },
                { seed: 5, name: "Wisconsin" },
                { seed: 12, name: "James Madison" },
                { seed: 4, name: "Duke" },
                { seed: 13, name: "Vermont" },
                { seed: 6, name: "Illinois" },
                { seed: 11, name: "Oregon" },
                { seed: 3, name: "Illinois" },
                { seed: 14, name: "Morehead State" },
                { seed: 7, name: "Florida Atlantic" },
                { seed: 10, name: "Northwestern" },
                { seed: 2, name: "Connecticut" },
                { seed: 15, name: "Stetson" }
            ],
            south: [
                { seed: 1, name: "Alabama" },
                { seed: 16, name: "Texas A&M-Corpus Christi" },
                { seed: 8, name: "Maryland" },
                { seed: 9, name: "West Virginia" },
                { seed: 5, name: "Gonzaga" },
                { seed: 12, name: "McNeese" },
                { seed: 4, name: "Auburn" },
                { seed: 13, name: "Charleston" },
                { seed: 6, name: "Dayton" },
                { seed: 11, name: "VCU" },
                { seed: 3, name: "Kansas" },
                { seed: 14, name: "Samford" },
                { seed: 7, name: "Washington" },
                { seed: 10, name: "Utah" },
                { seed: 2, name: "Arizona" },
                { seed: 15, name: "Longwood" }
            ]
        };
    }

    initializeBracket() {
        const bracket = {};
        
        // Round 1 matchups (64 teams -> 32 games)
        bracket.round1 = [];
        
        // Midwest region
        for (let i = 0; i < this.teams.midwest.length; i += 2) {
            bracket.round1.push({
                id: `midwest_${i/2}`,
                team1: this.teams.midwest[i],
                team2: this.teams.midwest[i + 1],
                winner: null
            });
        }
        
        // West region
        for (let i = 0; i < this.teams.west.length; i += 2) {
            bracket.round1.push({
                id: `west_${i/2}`,
                team1: this.teams.west[i],
                team2: this.teams.west[i + 1],
                winner: null
            });
        }
        
        // East region
        for (let i = 0; i < this.teams.east.length; i += 2) {
            bracket.round1.push({
                id: `east_${i/2}`,
                team1: this.teams.east[i],
                team2: this.teams.east[i + 1],
                winner: null
            });
        }
        
        // South region
        for (let i = 0; i < this.teams.south.length; i += 2) {
            bracket.round1.push({
                id: `south_${i/2}`,
                team1: this.teams.south[i],
                team2: this.teams.south[i + 1],
                winner: null
            });
        }
        
        // Initialize subsequent rounds
        bracket.round2 = Array(16).fill(null).map((_, i) => ({
            id: `r2_${i}`,
            team1: null,
            team2: null,
            winner: null
        }));
        
        bracket.round3 = Array(8).fill(null).map((_, i) => ({
            id: `r3_${i}`,
            team1: null,
            team2: null,
            winner: null
        }));
        
        bracket.round4 = Array(4).fill(null).map((_, i) => ({
            id: `r4_${i}`,
            team1: null,
            team2: null,
            winner: null
        }));
        
        bracket.round5 = Array(2).fill(null).map((_, i) => ({
            id: `r5_${i}`,
            team1: null,
            team2: null,
            winner: null
        }));
        
        bracket.round6 = Array(1).fill(null).map((_, i) => ({
            id: `r6_${i}`,
            team1: null,
            team2: null,
            winner: null
        }));
        
        return bracket;
    }

    init() {
        this.attachEventListeners();
        this.showUserSection();
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

        // Leaderboard sorting
        document.getElementById('sortBy').addEventListener('change', () => this.updateLeaderboard());
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

    loadAllBrackets() {
        const saved = localStorage.getItem('marchMadnessBrackets2026');
        return saved ? JSON.parse(saved) : {};
    }

    loadTournamentResults() {
        const saved = localStorage.getItem('marchMadnessResults2026');
        return saved ? JSON.parse(saved) : this.initializeBracket();
    }

    saveAllBrackets() {
        localStorage.setItem('marchMadnessBrackets2026', JSON.stringify(this.allBrackets));
    }

    saveTournamentResults() {
        localStorage.setItem('marchMadnessResults2026', JSON.stringify(this.tournamentResults));
    }

    renderBracket() {
        // Render all rounds
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
            
            // Team 1
            const team1Div = document.createElement('div');
            team1Div.className = 'team';
            team1Div.dataset.team = '1';
            if (matchup.team1) {
                team1Div.innerHTML = `
                    <span class="team-name">${matchup.team1.seed} ${matchup.team1.name}</span>
                    <span class="team-seed">${matchup.team1.seed}</span>
                `;
                if (matchup.winner && matchup.winner.seed === matchup.team1.seed && matchup.winner.name === matchup.team1.name) {
                    team1Div.classList.add('selected');
                }
            }
            
            // Team 2
            const team2Div = document.createElement('div');
            team2Div.className = 'team';
            team2Div.dataset.team = '2';
            if (matchup.team2) {
                team2Div.innerHTML = `
                    <span class="team-name">${matchup.team2.seed} ${matchup.team2.name}</span>
                    <span class="team-seed">${matchup.team2.seed}</span>
                `;
                if (matchup.winner && matchup.winner.seed === matchup.team2.seed && matchup.winner.name === matchup.team2.name) {
                    team2Div.classList.add('selected');
                }
            }
            
            matchupDiv.appendChild(team1Div);
            matchupDiv.appendChild(team2Div);
            container.appendChild(matchupDiv);
        });
    }

    selectWinner(matchupId, teamIndex) {
        // Find the matchup
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
        
        // Set winner
        matchup.winner = teamIndex === 1 ? matchup.team1 : matchup.team2;
        
        // Update next round
        if (roundNumber < 6) {
            this.updateNextRound(roundNumber, matchupId, matchup.winner);
        }
        
        // Re-render
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
        
        // Update bracket status
        const isComplete = this.isBracketComplete(this.bracket);
        const statusElement = document.getElementById('bracketStatus');
        if (isComplete) {
            statusElement.textContent = 'Complete';
            statusElement.style.color = '#48bb78';
        } else {
            statusElement.textContent = 'In Progress';
            statusElement.style.color = '#ed8936';
        }
        
        // Update possible score
        let possibleScore = 0;
        for (let i = 0; i < this.standardScoring.length; i++) {
            possibleScore += this.standardScoring[i] * Math.pow(2, 5 - i);
        }
        document.getElementById('possibleScore').textContent = possibleScore;
    }

    isBracketComplete(bracket) {
        // Check if championship has a winner
        return bracket.round6[0].winner !== null;
    }

    resetBracket() {
        if (confirm('Are you sure you want to reset your bracket?')) {
            this.bracket = this.initializeBracket();
            this.renderBracket();
            this.updateScore();
        }
    }

    saveBracket() {
        this.allBrackets[this.currentUser] = {
            bracket: this.bracket,
            score: this.calculateScore(this.bracket),
            submitted: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveAllBrackets();
        alert('Bracket saved successfully!');
    }

    submitBracket() {
        if (!this.isBracketComplete(this.bracket)) {
            alert('Please complete your bracket before submitting!');
            return;
        }
        
        if (confirm('Are you sure you want to submit your bracket? This will finalize your predictions.')) {
            this.allBrackets[this.currentUser] = {
                bracket: this.bracket,
                score: this.calculateScore(this.bracket),
                submitted: true,
                timestamp: new Date().toISOString()
            };
            
            this.saveAllBrackets();
            this.updateLeaderboard();
            alert('Bracket submitted successfully!');
        }
    }

    updateLeaderboard() {
        const sortBy = document.getElementById('sortBy').value;
        const leaderboardList = document.getElementById('leaderboardList');
        
        // Create leaderboard entries
        const entries = Object.entries(this.allBrackets).map(([name, data]) => ({
            name,
            score: this.calculateScore(data.bracket),
            submitted: data.submitted,
            timestamp: data.timestamp
        }));
        
        // Sort entries
        entries.sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.score - a.score;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'submitted':
                    return new Date(b.timestamp) - new Date(a.timestamp);
                default:
                    return 0;
            }
        });
        
        // Render leaderboard
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

    toggleAdminPanel() {
        const panel = document.getElementById('adminPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    updateResults() {
        const round = parseInt(document.getElementById('resultRound').value);
        
        if (confirm(`Update results for Round ${round}? This will recalculate all scores.`)) {
            // In a real implementation, this would open a modal to enter actual results
            // For now, we'll simulate with random winners
            this.simulateResults(round);
            this.saveTournamentResults();
            this.updateScore();
            this.updateLeaderboard();
            this.updateTournamentResults();
            alert(`Results updated for Round ${round}`);
        }
    }

    simulateResults(round) {
        const resultsRound = this.tournamentResults[`round${round}`];
        
        resultsRound.forEach(matchup => {
            if (matchup.team1 && matchup.team2) {
                // Random winner for simulation
                matchup.winner = Math.random() > 0.5 ? matchup.team1 : matchup.team2;
            }
        });
    }

    updateTournamentResults() {
        const resultsDiv = document.getElementById('actualResults');
        
        // Check if any results exist
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
        
        // Display results by round
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
}

// Initialize the bracket tracker
document.addEventListener('DOMContentLoaded', () => {
    new MarchMadnessBracket();
});

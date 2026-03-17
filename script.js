// March Madness Bracket Tracker 2026
class MarchMadnessBracket {
    constructor() {
        this.teams = this.initializeTeams();
        this.bracket = this.initializeBracket();
        this.selections = {};
        this.scores = {};
        this.currentScore = 0;
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
        this.renderBracket();
        this.attachEventListeners();
        this.updateScore();
    }

    renderBracket() {
        // Render Round 1
        this.renderRound('round1', this.bracket.round1);
        this.renderRound('round2', this.bracket.round2);
        this.renderRound('round3', this.bracket.round3);
        this.renderRound('round4', this.bracket.round4);
        this.renderRound('round5', this.bracket.round5);
        this.renderRound('round6', this.bracket.round6);
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

    attachEventListeners() {
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
        
        // Control buttons
        document.getElementById('resetBtn').addEventListener('click', () => this.resetBracket());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveBracket());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadBracket());
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

    updateScore() {
        // Calculate current score based on selections
        let score = 0;
        const roundPoints = [10, 20, 40, 80, 160, 320];
        
        for (let round = 1; round <= 6; round++) {
            const roundMatchups = this.bracket[`round${round}`];
            roundMatchups.forEach(matchup => {
                if (matchup.winner) {
                    score += roundPoints[round - 1];
                }
            });
        }
        
        this.currentScore = score;
        document.getElementById('currentScore').textContent = score;
        
        // Calculate possible score
        let possibleScore = 0;
        for (let round = 1; round <= 6; round++) {
            possibleScore += roundPoints[round - 1] * Math.pow(2, 6 - round);
        }
        document.getElementById('possibleScore').textContent = possibleScore;
    }

    resetBracket() {
        if (confirm('Are you sure you want to reset your bracket?')) {
            this.bracket = this.initializeBracket();
            this.selections = {};
            this.currentScore = 0;
            this.renderBracket();
            this.updateScore();
        }
    }

    saveBracket() {
        const bracketData = {
            bracket: this.bracket,
            selections: this.selections,
            currentScore: this.currentScore,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('marchMadnessBracket2026', JSON.stringify(bracketData));
        alert('Bracket saved successfully!');
    }

    loadBracket() {
        const savedData = localStorage.getItem('marchMadnessBracket2026');
        
        if (savedData) {
            const bracketData = JSON.parse(savedData);
            this.bracket = bracketData.bracket;
            this.selections = bracketData.selections;
            this.currentScore = bracketData.currentScore;
            
            this.renderBracket();
            this.updateScore();
            alert('Bracket loaded successfully!');
        } else {
            alert('No saved bracket found!');
        }
    }
}

// Initialize the bracket tracker
document.addEventListener('DOMContentLoaded', () => {
    new MarchMadnessBracket();
});

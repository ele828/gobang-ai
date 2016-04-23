// AI implementation
module.exports = {
    init: function(board, row, col, dropChessFn) {
        this.row = row;
        this.col = col;
        this.board = board;
        this.dropChessFn = dropChessFn;
        this.winCount = 0;
        this.over = false;
        // Generate wins array
        this.winArr = this.genWinArr(row, col) || [];

        // Player wins records.
        this.playerWinRecords = [];
        this.playerScore = [];
        // Computer wins records.
        this.computerWinRecords = [];
        this.computerScore = [];

        // Initializer
        for (var n = 0; n < this.winCount; n++) {
            this.playerWinRecords[n] = 0;
            this.computerWinRecords[n] = 0;
        }

    },

    // Drop a chess
    drop: function(u, v, computer) {
      // Player drop a chess
      if (!computer) {
        console.log('player turn', u, v)
        if (this.board[u][v] != 0)
          return;

        this.dropChessFn(u, v, false);
        this.board[u][v] = 1;
        for (var k = 0; k < this.winCount; k++) {
          if (this.winArr[u][v][k]) {
            this.playerWinRecords[k]++;
            this.computerWinRecords[k] = -1;

            if (this.playerWinRecords[k] == 5) {
              alert("你赢了！");
              this.over = true;
            }
          }
        }

        if (!this.over) {
          this.evaluate();
        }

        return;
      }

      if (computer) {
        console.log('computer turn', u, v)
        // computer is 2
        this.board[u][v] = 2;
        this.dropChessFn(u, v, true);

        for (var k = 0; k < this.winCount; k++) {
          if (this.winArr[u][v][k]) {
            this.computerWinRecords[k]++;
            // Player can not drop a chess here any more
            this.playerWinRecords[k] = -1;
            if (this.computerWinRecords[k] == 5) {
              alert('你输了！');
              this.over = true;
            }
          }
        }
      }

    },

    // Evaluate scores of player and computer
    // for making decisions
    evaluate: function() {
      // Game over
      if (this.over) return;

        var max = 0, u = 0, v = 0;

        // Reset wins array
        for (var i = 0; i < this.row; i++) {
            this.playerScore[i] = [];
            this.computerScore[i] = [];
            for (var j = 0; j < this.col; j++) {
                this.playerScore[i][j] = 0;
                this.computerScore[i][j] = 0;
            }
        }

        for (var i = 0; i < this.row; i++)
          for (var j = 0; j < this.col; j++)
            if (this.board[i][j] == 0) {
              for (var k = 0; k < this.winCount; k++) {
                  // Match player wins array
                  if (this.winArr[i][j][k]) {
                      if (this.playerWinRecords[k] == 1) {
                          this.playerScore[i][j] += 200;
                      }
                      else if (this.playerWinRecords[k] == 2) {
                          this.playerScore[i][j] += 300;
                      }
                      else if (this.playerWinRecords[k] == 3) {
                          this.playerScore[i][j] += 1000;
                      }
                      else if (this.playerWinRecords[k] == 4) {
                          this.playerScore[i][j] += 10000;
                      }
                  }

                  // Match computer wins array
                  if (this.winArr[i][j][k]) {
                      if (this.computerWinRecords[k] == 1) {
                          this.computerScore[i][j] += 230;
                      }
                      else if (this.computerWinRecords[k] == 2) {
                          this.computerScore[i][j] += 330;
                      }
                      else if (this.computerWinRecords[k] == 3) {
                          this.computerScore[i][j] += 1200;
                      }
                      else if (this.computerWinRecords[k] == 4) {
                          this.computerScore[i][j] += 20000;
                      }
                  }

                  if (this.playerScore[i][j] > max) {
                    max = this.playerScore[i][j];
                    u = i;
                    v = j;
                  } else if (this.playerScore[i][j] == max) {
                    if (this.computerScore[i][j] > this.computerScore[u][v]) {
                      u = i;
                      v = j;
                    }
                  }

                  if (this.computerScore[i][j] > max) {
                    max = this.computerScore[i][j];
                    u = i;
                    v = j;
                  } else if (this.computerScore[i][j] == max) {
                    if (this.playerScore[i][j] > this.playerScore[u][v]) {
                      u = i;
                      v = j;
                    }
                  }
              }
            }

        this.drop(u, v, true);

    },

    // The various ways to win
    genWinArr(row, col) {
        var count = 0;
        var num = 5;    // 5 chess in one line will win
        var wins = [];
        for (var i = 0; i < row; i++) {
            wins[i] = [];
            for (var j = 0; j < col; j++) {
                wins[i][j] = [];
            }
        }

        // -
        for (var i = 0; i < row; i++)
            for (var j = 0; j < col - 4; j++) {
                for (var k = 0; k < num; k++) {
                    wins[i][j + k][count] = true;
                }
                count++;
            }

        // |
        for (var i = 0; i < row; i++)
            for (var j = 0; j < col - 4; j++) {
                for (var k = 0; k < num; k++) {
                    wins[j+k][i][count] = true;
                }
                count++;
            }

        // \
        for (var i = 0; i < row - 4; i++)
            for (var j = 0; j < col - 4; j++) {
                for (var k = 0; k < num; k++) {
                    wins[i+k][j+k][count] = true;
                }
                count++;
            }

        // /
        for (var i = 0; i < row - 4; i++)
            for (var j = 14; j > 3; j--) {
                for (var k = 0; k < num; k++) {
                    wins[i+k][j-k][count] = true;
                }
                count++;
            }
        this.winCount = count;
        return wins;
    },

    logBoard: function() {
        console.table(this.board);
    }
};

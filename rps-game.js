document.addEventListener("DOMContentLoaded", () => {
  const rockBtn = document.getElementById("rock-btn");
  const paperBtn = document.getElementById("paper-btn");
  const scissorsBtn = document.getElementById("scissors-btn");
  const playerDisplay = document.getElementById("player-choice");
  const computerDisplay = document.getElementById("computer-choice");
  const resultMessage = document.getElementById("result-message");
  const playerScoreElement = document.getElementById("player-score");
  const computerScoreElement = document.getElementById("computer-score");
  const tiesScoreElement = document.getElementById("ties-score");
  const restartBtn = document.getElementById("restart-game");
  const closeGameBtn = document.getElementById("close-game");
  const rpsGameContainer = document.getElementById("rps-game-container");
  const todoContainer = document.getElementById("todo-container");

  let playerScore = 0;
  let computerScore = 0;
  let ties = 0;
  let playerChoice = null;
  let computerChoice = null;
  let gameActive = true;

  // Initialize game
  init();

  // Event listeners
  rockBtn.addEventListener("click", () => playGame("rock"));
  paperBtn.addEventListener("click", () => playGame("paper"));
  scissorsBtn.addEventListener("click", () => playGame("scissors"));
  restartBtn.addEventListener("click", resetGame);

  if (closeGameBtn) {
    closeGameBtn.addEventListener("click", () => {
      if (rpsGameContainer && todoContainer) {
        rpsGameContainer.style.display = "none";
        todoContainer.style.display = "block";

        // Update nav active state
        const todoLink = document.getElementById("todo-link");
        const gameLink = document.getElementById("game-link");
        if (todoLink && gameLink) {
          todoLink.classList.add("active");
          gameLink.classList.remove("active");
        }
      }
    });
  }

  // Functions
  function init() {
    updateScore();
    playerDisplay.textContent = "?";
    computerDisplay.textContent = "?";
    resultMessage.textContent = "Choose your move!";
  }

  function playGame(choice) {
    if (!gameActive) return;

    playerChoice = choice;
    computerChoice = getComputerChoice();

    // Update displays
    playerDisplay.textContent = getChoiceEmoji(playerChoice);

    // Animation effect
    playerDisplay.classList.add("rps-shake");
    computerDisplay.classList.add("rps-shake");

    // Disable buttons during animation
    setButtonsEnabled(false);

    // Show result after animation
    setTimeout(() => {
      computerDisplay.textContent = getChoiceEmoji(computerChoice);
      const result = determineWinner(playerChoice, computerChoice);

      // Update scores
      if (result === "player") {
        playerScore++;
        resultMessage.textContent = "You win this round!";
      } else if (result === "computer") {
        computerScore++;
        resultMessage.textContent = "Computer wins this round!";
      } else {
        ties++;
        resultMessage.textContent = "It's a tie!";
      }

      // Remove animation classes
      playerDisplay.classList.remove("rps-shake");
      computerDisplay.classList.remove("rps-shake");

      // Update scoreboard
      updateScore();

      // Re-enable buttons
      setButtonsEnabled(true);
    }, 1500);
  }

  function getComputerChoice() {
    const choices = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
  }

  function determineWinner(player, computer) {
    if (player === computer) return "tie";

    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "player";
    } else {
      return "computer";
    }
  }

  function getChoiceEmoji(choice) {
    switch (choice) {
      case "rock":
        return "✊";
      case "paper":
        return "✋";
      case "scissors":
        return "✌️";
      default:
        return "?";
    }
  }

  function updateScore() {
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
    tiesScoreElement.textContent = ties;
  }

  function resetGame() {
    playerScore = 0;
    computerScore = 0;
    ties = 0;
    playerChoice = null;
    computerChoice = null;
    gameActive = true;

    init();
  }

  function setButtonsEnabled(enabled) {
    gameActive = enabled;
    const buttons = [rockBtn, paperBtn, scissorsBtn];
    buttons.forEach((btn) => {
      btn.disabled = !enabled;
      if (!enabled) {
        btn.classList.add("disabled");
      } else {
        btn.classList.remove("disabled");
      }
    });
  }
});

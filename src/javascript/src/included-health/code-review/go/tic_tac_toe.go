package main

import (
	"fmt"
	"math"
	"math/rand"
	"time"
)

// wesp: For a more junior engineer, I would elaborate on my comments with more
// in-depth examples to showcase how they might achieve something. For more
// experienced engineers, I would use fewer examples and focus on discussion.

// wesp: Convention in Go is to use camelCase for variables and private members
// and PascalCase for exported members. We can leave this for another task to
// add a linter that can auto-fix stylistic issues.

// wesp: Are there other requirements we need to consider, such as adding the
// ability to play against a local human player? If so, we may want these
// values to be assignable to each player independently, same for the O/X
// characters.

// wesp: Related to requirements, what unit tests would you write to make sure
// we meet those requirements?
const ( // WIN and LOSE is from User's point of view. WIN indicates that the player won and the computer lost.
	RUNNING = 1
	STOPPED = 2
	WIN     = 3
	DRAW    = 4
	LOSE    = 5
)

// wesp: To simplify the design, should we consider using the O/X/_ characters
// as the grid values rather than converting between the two? If memory is a
// concern, we can use runes/bytes instead of strings.
const (
	USER_POS     = 1
	COMPUTER_POS = 2
	EMPTY_POS    = 3
)

var POSITION_STATUS_TO_GRID_VAL = map[int]string{
	1: "O",
	2: "X",
	3: "_",
}

type Board struct {
	board [][]int
	// wesp: Tic Tac Toe is usually only a 3x3 grid. Do we intend to support
	// variable sized boards? If so, can we infer the board size from the array
	// length to make sure the inferred value does not get out of sync with the
	// actual size?
	board_size int
}

func init_board(board *Board, board_size int) {
	board.board_size = board_size
	board.board = make([][]int, board_size)
	for i := range board.board {
		board.board[i] = make([]int, board_size)
		for j := range board.board[i] {
			board.board[i][j] = EMPTY_POS
		}
	}
}

func show_board(board Board) {
	for i := range board.board {
		for j := range board.board[i] {
			fmt.Printf("%s ", POSITION_STATUS_TO_GRID_VAL[board.board[i][j]])
		}
		fmt.Printf("\n")
	}
}

func (board *Board) update_board(move int, desired_status int) {
	// wesp: nit: because these are all integers, initialization will infer the
	// type, and we can remove type casting for slightly better readability.
	var x, y int = int(move / board.board_size), move % board.board_size
	board.board[x][y] = desired_status
}

// wesp: Because the validation checks are not expensive operations, what
// do you think of simplifying this logic by removing the goroutines?
// Currently, this also gets us in a deadlock because the for-range loop
// introduces a race condition where we may not have added anything to the
// channel yet. There are two ways we can get around this:
//
// 1. Convert the for loop to loop over the two known values (legacy approach).
//     for i := 0; i < 2; i++ {
//	       ret = ret && <-is_valid
//     }
// 2. Use a WaitGroup (now the recommended approach) to wait on the two async
// operations.
//     var wg sync.WaitGroup
//     wg.Add(1)
//     go func() {
//         defer wg.Done()
//     }()
//     wg.Wait()

func (board Board) validate_position(move int, verbose bool) bool {
	is_valid := make(chan bool, 2)

	// out of bound
	go func() {
		is_valid <- !(move < 0 || float64(move) > math.Pow(float64(board.board_size), 2)-1)
	}()

	// already taken
	go func() {
		var x, y int = int(move / board.board_size), move % board.board_size
		is_valid <- board.board[x][y] == EMPTY_POS
	}()

	ret := true
	for i := range is_valid {
		ret = ret && i
	}

	if verbose && !ret {
		fmt.Println("Invalid move provided!")
	}

	return ret
}

func (original_board Board) copy_board() Board {
	var copied_board = Board{
		board_size: original_board.board_size,
	}
	copied_board.board = make([][]int, original_board.board_size)
	for i := range copied_board.board {
		copied_board.board[i] = make([]int, original_board.board_size)
		copy(copied_board.board[i], original_board.board[i])
	}
	return copied_board
}

func (board Board) get_all_possible_moves() []int {
	var eligible_moves []int
	for move := 0; move < int(math.Pow(float64(board.board_size), 2))-1; move++ {
		if board.validate_position(move, false) {
			eligible_moves = append(eligible_moves, move)
		}
	}
	return eligible_moves
}

func (board Board) check_if_dir_filled(player int, ix, iy, dx, dy, traverse_counter int) bool {
	if board.board[ix][iy] != player {
		return false
	}
	if traverse_counter > board.board_size {
		return true
	}
	var l int = board.board_size
	return board.check_if_dir_filled(
		player,
		(((ix+dx)%l)+l)%l,
		(((iy+dy)%l)+l)%l,
		dx,
		dy,
		traverse_counter+1,
	)
}

func (board Board) did_win(player int) bool {
	var win bool = false
	/* Check diagonals */
	// From top left to bottom right
	win = win || board.check_if_dir_filled(
		player,
		0,
		0,
		1,
		1,
		0,
	)
	// From top right to bottom left
	win = win || board.check_if_dir_filled(
		player,
		0,
		board.board_size-1,
		1,
		-1,
		0,
	)

	/* Check horizontals */
	for i := range board.board {
		win = win || board.check_if_dir_filled(
			player,
			i,
			0,
			0,
			1,
			0,
		)
	}

	/* Check verticals */
	for i := range board.board {
		win = win || board.check_if_dir_filled(
			player,
			0,
			i,
			1,
			0,
			0,
		)
	}

	return win
}

type TicTacToe struct {
	board          Board
	is_player_turn bool
	status         int
}

func (game *TicTacToe) init_game(board_size int) {
	// wesp: nit: As of Go 1.20, you no longer need to set a random seed value and
	// can leave this out.
	// Randomly set turn
	rand.Seed(time.Now().UnixNano())
	game.is_player_turn = rand.Int()%2 == 1
	// Initiate board
	init_board(&game.board, board_size)
	game.status = RUNNING
}

// wesp: It appears that the copy_* functions are not used anywhere. Can we
// remove this dead code? This will reduce maintenance burden in the future.
func (game TicTacToe) copy_game() TicTacToe {
	return TicTacToe{
		board:          game.board.copy_board(),
		is_player_turn: game.is_player_turn,
		status:         game.status,
	}
}

// wesp: This is great that we separate the rendering logic from the game
// engine logic. This allows the game engine to operate independently of how we
// display the game. We could then easily provide multiple user interfaces
// (e.g. mobile, browser, etc.).
func (game TicTacToe) show_move() {
	for i := range game.board.board {
		for j := range game.board.board[i] {
			fmt.Printf("%d ", i*game.board.board_size+j)
		}
		fmt.Printf("\n")
	}
}

func (game *TicTacToe) make_player_move() {
	var move int
	for {
		fmt.Println("Make a move : ...")
		_, err := fmt.Scanf("%d", &move)
		if err != nil {
			fmt.Printf("Error parsing move %e\n", err)
			continue
		}
		if game.board.validate_position(move, true) {
			game.board.update_board(move, USER_POS)
			break
		}
	}

}

func (game *TicTacToe) check_and_update_game_status() {
	// If already stopped, exit early
	if game.status != RUNNING {
		return
	}

	// Check if there's a winner
	if game.board.did_win(USER_POS) {
		game.status = WIN
		return
	}
	if game.board.did_win(COMPUTER_POS) {
		game.status = LOSE
		return
	}

	// Check if it's a draw
	if len(game.board.get_all_possible_moves()) <= 0 {
		game.status = DRAW
		return
	}
}

/**
 * Simulate all valid move and choose the one where AI win. If there's no winning move
 * return a drawing move.
 */
func (game *TicTacToe) make_ai_move() {
	eligible_moves := game.board.get_all_possible_moves()

	if len(eligible_moves) <= 0 {
		// If no elible moves, update game status
		game.status = WIN
	} else {
		game.board.update_board(
			eligible_moves[rand.Intn(len(eligible_moves))],
			COMPUTER_POS,
		)
	}

}

func (game *TicTacToe) play() {
	switch game.status {
	case RUNNING:
		fmt.Println("Current board : ")
		game.board.show_board()
		if game.is_player_turn {
			fmt.Println("It's your turn : ")
			fmt.Println("Here are moves you can make : ")
			game.show_move()
			game.make_player_move()
		} else {
			fmt.Println("It's computer's turn : ")
			fmt.Println("AI making move...")
			game.make_ai_move()
		}

		// wesp: What do you think of also returning the game status and
		// showing the board if it ended? This way, when the game ends, we can
		// see the state from the final move.

		// Check game status
		game.check_and_update_game_status()

		// Flip turn
		game.is_player_turn = !game.is_player_turn

		// Move to next turn
		game.play()
	case STOPPED:
		fmt.Println("Game stopped.")
		break
	case WIN:
		fmt.Println("Congratulations, you won!")
		break
	case DRAW:
		fmt.Println("It's a draw!")
		break
	case LOSE:
		fmt.Println("Sorry, you lost!")
		break
	}
}

func main() {
	fmt.Println("Enter board size :")
	var board_size int
	_, err := fmt.Scanf("%d", &board_size)
	if err != nil {
		fmt.Printf("Error parsing board size %e", err)
		panic(err)
	}

	var game TicTacToe
	game = TicTacToe{}
	game.init_game(board_size)
	game.play()
}

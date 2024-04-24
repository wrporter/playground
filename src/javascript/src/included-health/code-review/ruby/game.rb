require_relative 'board'
require_relative 'human_player'
require_relative 'computer_player'

class Game
  attr_reader :board, :players

  def initialize(board, x_player, o_player)
    @board = board
    @players = [x_player, o_player]
  end

  def announce_result
    if board.won?
      winner = players.find { |p| p.mark == board.winning_mark }
      winner.view_board
      puts "Player #{winner.mark.to_s.upcase} wins!"
    else
      puts "Game tied!"
    end
  end

  def play
    until board.won? || board.tied?
      players.first.move
      players.rotate!
    end

    announce_result
  end
end

if __FILE__ == $PROGRAM_NAME
  board = Board.new
  x_player = HumanPlayer.new(board, :x)
  o_player = ComputerPlayer.new(board, :o)
  Game.new(board, x_player, o_player).play
end

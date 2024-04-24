require_relative 'player'

class ComputerPlayer < Player
  def move
    view_board
    puts "Player #{mark.to_s.upcase}'s turn. Computing move ..."
    sleep(1)
    position = board.winning_position_for(mark) || board.random_position
    puts "Input: #{position}"
    sleep(1)
    board[position] = mark.to_s.upcase
  end
end

require_relative 'player'

class HumanPlayer < Player
  def move
    view_board
    puts "Player #{mark.to_s.upcase}'s turn. Which position will you mark?\nEnter '0, 0' to mark the top-left corner, for example."

    begin
      print "Input: "
      pos = gets.scan(/\b\d+\b/).map(&:to_i)

      raise "Invalid input!" unless pos.length == 2 && board.inbounds?(pos)
      raise "Position already occupied!" unless board.empty?(pos)

      board[pos] = mark.to_s.upcase
    rescue RuntimeError => e
      puts e.message
      retry
    end
  end
end

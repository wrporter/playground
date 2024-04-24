class Player
  attr_reader :board, :mark

  def initialize(board, mark)
    @board = board
    @mark = mark
  end

  def view_board
    system "clear"

    print "State of play:\n\n"

    board.rows.each do |row|
      row.each do |item|
        character = (item.nil? ? '_' : item)
        printf("%4s", character)
      end

      print "\n\n"
    end
  end
end

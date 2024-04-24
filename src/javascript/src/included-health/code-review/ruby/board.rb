class Board
  attr_reader :grid
  alias :rows :grid

  SIDE_LENGTH = 3

  def initialize
    @grid = Array.new(SIDE_LENGTH) { Array.new(SIDE_LENGTH) }
  end

  def [](pos)
    grid[pos.first][pos.last]
  end

  def []=(pos, val)
    grid[pos.first][pos.last] = val
  end

  def columns
    first_row = rows.first
    rest_rows = rows.drop(1)
    first_row.zip(*rest_rows)
  end

  def diagonals
    northwest, northeast = [], []

    SIDE_LENGTH.times do |i|
      northwest << grid[i][i]
      northeast << grid[i][SIDE_LENGTH - (i + 1)]
    end

    [northwest, northeast]
  end

  def empty?(pos)
    self[pos].nil?
  end

  def inbounds?(pos)
    pos.min >= 0 && pos.max < SIDE_LENGTH
  end

  def random_position
    pos = nil

    loop do
      pos = [rand(SIDE_LENGTH), rand(SIDE_LENGTH)]
      break if empty?(pos)
    end

    pos
  end

  def tied?
    !won? && winnable_strips.all? { |strip| strip.none?(&:nil?) }
  end

  def winnable_strips
    rows + columns + diagonals
  end

  def winning_mark
    return nil unless won?

    winning_strip = winnable_strips.find do |strip|
      strip.none?(&:nil?) && strip.uniq.count == 1
    end

    winning_strip.first.downcase.to_sym
  end

  def winning_position_for(mark)
    SIDE_LENGTH.times do |row|
      SIDE_LENGTH.times do |col|
        pos = [row, col]
        next unless empty?(pos)
        self[pos] = mark
        winning = true if won?
        self[pos] = nil
        return pos if winning
      end
    end

    nil
  end

  def won?
    winnable_strips.any? do |strip|
      strip.none?(&:nil?) && strip.uniq.count == 1
    end
  end
end

import scala.io.StdIn
import scala.util.{ Failure, Random, Success, Try }

// Utils /////////////////
trait Showable[+T] { def show(): String }

// Fancy toString.
sealed trait Show[T] { def show(t: T): String }

object Show {
  def apply(t: String) = t
  def apply[T](t: Showable[T]): String = t.show()
  def apply[T : Show](t: T): String =
    implicitly[Show[T]].show(t)
}

// Interface
class IllegalOperationError(message: String) extends Exception(message)

sealed trait Piece extends Showable[Piece]

sealed trait Action

sealed trait Outcome extends Showable[Outcome]

// Map-backed board with 2D geometry.
trait Board[+This <: Board[This]] extends Showable[This] {

  def get(loc: Int): Option[Piece] = state.get(loc)
  def put(loc: Int, p: Piece): Try[This]
  def remove(loc: Int, p: Piece): Try[This]

  def shape: (Int, Int)
  def size: Int = shape._1 * shape._2
  def isFull: Boolean = state.size == size

  def show(): String = state.toString()
  protected def state: Map[Int, Piece]
}

object Board {
  class OutOfBoundsError extends Exception
}

trait Player extends Showable[Player] {
  val name: String
  val piece: Piece
}

/** How Players interact with the board. **/
trait Strategy { self: Player =>
  def play(board: Board[_]): Action
}

trait Game[B <: Board[_]] {
  def players: Seq[Player with Strategy]

  def execute(board: B, action: Action): Try[B]

  def assessOutcome(board: B): Option[Outcome]
}

object Game {
  /** Repeat 'xs' forever. **/
  def cycle[T](xs: Seq[T]): Iterator[T] = for {
    _ <- Iterator.continually(())
    x <- xs
  } yield x

  // 3 strikes by default.
  def retry[B <: Board[_]](f: () => Try[B], n: Int = 3): Try[B] = {
    if (n <= 1) f()
    else f().orElse {
      println(s"Bad move, you have ${n - 1} retries remaning")
      retry(f, n - 1)
    }
  }

  /** Players alternate taking turns until the game is resolved. **/
  def run[B <: Board[_]](game: Game[B], board: B): Outcome =
    cycle(game.players)
      .scanLeft(board) { case (b, p) =>
        val attempt = { () => game.execute(b, p.play(b)) }
        retry(attempt).get // crash game here if we need to.
      }
      .flatMap { b =>
        val outcome = game.assessOutcome(b)
        outcome.foreach { o =>
          println(Show(o))
          println(Show(b))
        }
        outcome
      }
      .next // game on!
}

// Implementations

// Pieces (unfortunately have to jump through hoops here...
case object X extends Piece { def show() = "X" }
case object O extends Piece { def show() = "O" }

// Actions
case class Put(loc: Int, piece: Piece) extends Action
case class Remove(loc: Int, piece: Piece) extends Action
case object Pass extends Action // meh...

// Outcomes
case class Victory(p: Player) extends Outcome {
  def show() =  s"Victory($p)"
}

case class Draw(ps: Seq[Player]) extends Outcome {
  def show() = s"Draw($ps)"
}

case object Abandoned extends Outcome {
  def show() = "Abandoned"
}

// Strategies
trait RandomStrategy extends Strategy {
  self: Player =>

  def play(board: Board[_]): Action =
    choose(unoccupiedSpaces(board))
      .map { loc => Put(loc, self.piece) }
      .getOrElse(Pass)

  private def choose[T](s: Seq[T]): Option[T] =
    if (s.nonEmpty) Some(s(math.abs(Random.nextInt()) % s.size))
    else            None

  private def unoccupiedSpaces(b: Board[_]): Seq[Int] =
    (0 until b.size).flatMap { i =>
      b.get(i) match {
        case None    => Some(i)
        case Some(_) => None
      }
    }(collection.breakOut)
}

trait UserInputStrategy extends Strategy {
  self: Player =>

  def play(board: Board[_]): Action = {
    println(s"${self.name}'s turn!")
    println(Show(board))
    val choice = StdIn.readInt()
    Put(choice, self.piece)
  }
}

class TicTacToeBoard private(
  protected val state: Map[Int, Piece]
) extends Board[TicTacToeBoard]
  with Showable[TicTacToeBoard] {

  val shape = (3, 3)

  def put(loc: Int, piece: Piece) = for {
    _ <- checkBounds(loc)
    _ <- ensureUnoccupied(loc)
  } yield new TicTacToeBoard(state + (loc -> piece))

  def remove(loc: Int, piece: Piece) = for {
    _ <- checkBounds(loc)
    p <- ensureOccupied(loc) if p == piece
  } yield new TicTacToeBoard(state - loc)

  override def show(): String = (0 until size)
    .foldLeft(Seq.empty[String]) { case (acc, i) =>
      acc :+ state.get(i).map(_.toString).getOrElse(i.toString)
    }
    .grouped(shape._1)
    .map(_.mkString(" | "))
    .mkString("\n" + "---" * shape._1 + "\n")

  protected def checkBounds(loc: Int): Try[Int] =
    if (loc >= 0 && loc < size) Success(loc)
    else Failure(new Board.OutOfBoundsError)

  protected def ensureOccupied(loc: Int): Try[Piece] = state.get(loc) match {
    case Some(piece) =>
      Success(piece)
    case None =>
      Failure(new IllegalOperationError(s"There is nothing here!"))
  }

  protected def ensureUnoccupied(loc: Int): Try[Unit] = state.get(loc) match {
    case Some(piece) =>
      Failure(new IllegalOperationError(s"Location $loc is already taken by $piece!"))
    case None =>
      Success(Unit)
  }
}

object TicTacToeBoard {
  def apply() =  new TicTacToeBoard(Map.empty[Int, Piece])
}

class TicTacToeGame(
  val players: Seq[Player with Strategy]
) extends Game[TicTacToeBoard] {

  val pieceToPlayer: Map[Piece, Player] =
    players.map { p => (p.piece -> p) }(collection.breakOut)

  // Try to execute the action, breaking if invalid!
  def execute(board: TicTacToeBoard, action: Action): Try[TicTacToeBoard] = action match {
    case Pass         => Success(board)
    case Put(loc, p)  => board.put(loc, p)
    case Remove(_, _) =>
      Failure(new IllegalOperationError("You can't remove pieces in Tic Tac Toe!"))
  }

  def assessOutcome(board: TicTacToeBoard): Option[Outcome] = paths
    .iterator
    .map(_.flatMap(board.get))
    .withFilter(_.size >= 3)
    .collectFirst {
      case Seq(X, X, X) => Victory(pieceToPlayer(X))
      case Seq(O, O, O) => Victory(pieceToPlayer(O))
    }
    .orElse { if (board.isFull) Some(Draw(players)) else None }

  // hard coded for 3x3 board.
  val paths: Seq[Seq[Int]] = {
    val rows = (0 until 9).grouped(3).toSeq
    val cols = rows.transpose
    val diag = Seq(Seq(0, 4, 8), Seq(2, 4, 6))
    rows ++ cols ++ diag
  }
}

case class BadAIPlayer(
  val name: String,
  val piece: Piece
) extends Player
  with RandomStrategy {

  def show() = this.toString
}

case class HumanPlayer(
  val name: String,
  val piece: Piece
) extends Player
  with UserInputStrategy {

  def show() = this.toString
}

object Main {
  val x = HumanPlayer("Mysterious Stranger", X)
  val o = BadAIPlayer("Zuhl!", O)
  val players = Seq[Player with Strategy](x, o)

  val board = TicTacToeBoard()
  val game = new TicTacToeGame(players)

  def main(args: Array[String]) {
    Show(Game.run(game, board))
  }
}

import "./styles.css";
import { useState } from "react";

const maze = [
  [1, 1, 1, 0],
  [0, 1, 0, 1],
  [0, 1, 1, 0],
  [1, 0, 1, 1]
];

const N = maze.length;

export default function App() {
  const [path, setPath] = useState([]);
  const [isPossible, setIsPossible] = useState(true);

  function isSafe(x, y) {
    return x >= 0 && x < N && y >= 0 && y < N && maze[x][y] === 1;
  }

  function solveMaze() {
    let sol = new Array(N);
    for (let i = 0; i < N; i++) {
      sol[i] = new Array(N);
      for (let j = 0; j < N; j++) {
        sol[i][j] = 0;
      }
    }

    if (solveMazeUtil(0, 0, sol) === false) {
      console.log("Solution doesn't exist");
      setIsPossible(false);
      return false;
    }
    setPath(sol);
    // console.log(sol);

    return true;
  }

  function solveMazeUtil(x, y, sol) {
    // if (x, y is goal) return true
    if (x === N - 1 && y === N - 1 && maze[x][y] === 1) {
      sol[x][y] = 1;
      return true;
    }

    // Check if maze[x][y] is valid
    if (isSafe(x, y) === true) {
      // Check if the current block is already part of solution path.
      if (sol[x][y] === 1) return false;

      // mark x, y as part of solution path
      sol[x][y] = 1;

      /* Move forward in x direction */
      if (solveMazeUtil(x + 1, y, sol)) return true;

      /* If moving in x direction doesn't give
      solution then Move down in y direction */
      if (solveMazeUtil(x, y + 1, sol)) return true;

      /* If moving in y direction doesn't give
      solution then Move backwards in x direction */
      if (solveMazeUtil(x - 1, y, sol)) return true;

      /* If moving backwards in x direction doesn't give
      solution then Move upwards in y direction */
      if (solveMazeUtil(x, y - 1, sol)) return true;

      /* If none of the above movements works then
      BACKTRACK: unmark x, y as part of solution
      path */
      sol[x][y] = 0;
      return false;
    }
    return false;
  }

  function Child({ path }) {
    return path?.map((row, RI) => {
      return row.map((col, CI) => {
        if (RI === 0 && CI === 0) {
          return <div className="cell rat" key={{ RI, CI }}></div>;
        }
        if (RI === N - 1 && CI === N - 1) {
          return <div className="cell cheese" key={{ RI, CI }}></div>;
        }

        return (
          <div
            style={
              col === 0
                ? { backgroundColor: "red" }
                : { backgroundColor: "green" }
            }
            className="cell"
            key={{ RI, CI }}
          ></div>
        );
      });
    });
  }

  return (
    <div className="App">
      <h1>Rat in a Maze</h1>
      <div className="ratMaze">
        {maze.map((row, rowInd) => {
          return row.map((column, colInd) => {
            // console.log({ rowInd, colInd });
            if (rowInd === 0 && colInd === 0) {
              return <div className="cell rat" key={{ rowInd, colInd }}></div>;
            }
            if (rowInd === N - 1 && colInd === N - 1) {
              return (
                <div className="cell cheese" key={{ rowInd, colInd }}></div>
              );
            }
            return (
              <div
                style={
                  column === 0
                    ? { backgroundColor: "red" }
                    : { backgroundColor: "white" }
                }
                className="cell"
                key={{ rowInd, colInd }}
              ></div>
            );
          });
        })}
      </div>
      <button style={{ margin: 20 }} onClick={solveMaze}>
        Find optimum path
      </button>
      {!isPossible && (
        <h2 className="message" style={{ color: "red" }}>
          Solution doesn't exist
        </h2>
      )}
      <div className="ratMaze">
        <Child path={path} />
      </div>
    </div>
  );
}

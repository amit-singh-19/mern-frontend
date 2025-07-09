//conditional rendering

// export default function Home({ age }) {
//   if (age > 18) return <h2>Welcome</h2>;
//   else return <h2>Not allowed</h2>;
// }

// export default function Home({ age }) {
//   return age > 18 ? <h2 style={{color: "green"}}>Welcome</h2> : <h2 style={{color: "red"}}>Not allowed</h2>
// }

// export default function Home({ age }) {
//   return age > 18 && <h2>Welcome</h2>
// }

// export default function Home() {
//   const handleClick = () => {
//     alert("Hello");
//   };

//   const handleSubmit = (name) => {
//     alert(`Hello, ${name}`);
//   };
//   return (
//     <>
//       <h2>Hello World</h2>
//       <button onClick={handleClick}>Click</button>
//       <button onClick={() => handleSubmit("John")}>Submit</button>
//     </>
//   );
// }

import { useState } from "react";

// export default function Home() {
//   const [score, setScore] = useState(0);
//   const increment = () => {
//     setScore(score + 1);
//   };
//   const decrement = () => {
//     setScore(score - 1);
//   };
//   return (
//     <>
//       <p style={{margin: "0.5rem 1rem", fontSize: "1.3rem"}}>Score: {score}</p>
//       <button onClick={increment}>Increment Score</button>
//       <button onClick={decrement}>Decrement Score</button>
//     </>
//   );
// }

export default function Home() {
  const [run, increaseRun] = useState(0);
  const [wicket, increaseWicket] = useState(0);
  const [message, setMessage] = useState();

  const runFunc = () => {
    if (wicket < 11) {
      increaseRun(run + 1);
      setMessage("Well Done!!");
    }
  };

  const wicketFunc = () => {
    if (wicket < 11) {
      increaseWicket(wicket + 1);
      setMessage("Better Luck next time!")
    }else {
      setMessage("Game Over")
    }
  };

  return (
    <>
      <h2>Welcome</h2>
      <button onClick={runFunc}>Run</button>
      <p>Run: {run}</p>
      <button onClick={wicketFunc}>Wicket</button>
      <p>Wicket: {wicket}</p>
      <hr />
      <p>{message}</p>
    </>
  );
}

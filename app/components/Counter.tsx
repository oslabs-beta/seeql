// import * as React from 'app/components/node_modules/react';
// import { Component } from 'app/components/node_modules/react';
// import { Link } from 'app/components/node_modules/react-router-dom';
// const routes = require('../constants/routes.json');
// const styles = require('./Counter.css');

// type Props = {
//   increment: () => void;
//   incrementIfOdd: () => void;
//   incrementAsync: () => void;
//   decrement: () => void;
//   counter: number;
// };

// export default class Counter extends Component<Props> {
//   props: Props;

//   render() {
//     const {
//       increment,
//       incrementIfOdd,
//       incrementAsync,
//       decrement,
//       counter
//     } = this.props;
//     return (
//       <div>
//         <div className={styles.backButton} data-tid="backButton">
//           <Link to={routes.HOME}>
//             <i className="fa fa-arrow-left fa-3x" />
//           </Link>
//         </div>
//         <div className={`counter ${styles.counter}`} data-tid="counter">
//           {counter}
//         </div>
//         <div className={styles.btnGroup}>
//           <button
//             className={styles.btn}
//             onClick={increment}
//             data-tclass="btn"
//             type="button"
//           >
//             <i className="fa fa-plus" />
//           </button>
//           <button
//             className={styles.btn}
//             onClick={decrement}
//             data-tclass="btn"
//             type="button"
//           >
//             <i className="fa fa-minus" />
//           </button>
//           <button
//             className={styles.btn}
//             onClick={incrementIfOdd}
//             data-tclass="btn"
//             type="button"
//           >
//             odd
//           </button>
//           <button
//             className={styles.btn}
//             onClick={() => incrementAsync()}
//             data-tclass="btn"
//             type="button"
//           >
//             async
//           </button>
//         </div>
//       </div>
//     );
//   }
// }

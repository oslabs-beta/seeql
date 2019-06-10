// import * as React from 'react';
// import { useSpring, animated } from 'react-spring';

// const ellipses = Array.from({ length: 4 }, (_, i) => i + 1);
// const cssTransformation = i => r =>
//   `translate3d(0, ${20 * Math.sin(r + (i * 3 * Math.PI) / 10)}px, 0)`;

// function LoadComponent() {
//   const { baseVals } = useSpring({
//     to: async next => {
//       while (4) await next({ baseVals: 4 * Math.PI });
//     },
//     from: { baseVals: 0 },
//     config: { duration: 4000 },
//     reset: true
//   });

//   const renderList = ellipses.map(i => (
//     <animated.div
//       key={i}
//       id={'kata' + i.toString()}
//       className="box"
//       style={{ transform: baseVals.interpolate(cssTransformation(i)) }}
//     />
//   ));

//   return <div>rendering load</div>;
//   //<div className="five">{renderList}</div>;
// }

// export default LoadComponent;

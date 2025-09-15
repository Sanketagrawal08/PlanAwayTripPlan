// import React, { useEffect } from 'react'

// const TripTracker = () => {



// //har adhe ghante me loation 


// function getLocation () {
//     navigator.geolocation.getCurrentPosition(
//     (pos) => console.log(pos),
//     (err) => console.error(err),
//   { enableHighAccuracy: true }
// )
// }

// //30 * 60 * 1000 = 30 minutes
// //10*1000 = 10 second bcoz js takes time in miliseconds

// useEffect(() => {
//   getLocation();
//   const interval = setInterval(getLocation, 30 * 60 * 1000 );
//   return () => clearInterval(interval); // cleanup
// }, []);

//   return (
//     <div>TripTracker</div>
//   )
// }

// export default TripTracker
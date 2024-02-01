// // In OAuthCallback.jsx
// import { useEffect } from 'react';
// import { useLocation, useHistory } from 'react-router-dom';
// import axios from 'axios'; // Ensure axios is installed

// const OAuthCallback = () => {
//   const location = useLocation();
//   const history = useHistory();

//   useEffect(() => {
//     const exchangeCodeForToken = async () => {
//       const queryParams = new URLSearchParams(location.search);
//       const code = queryParams.get('code');

//       if (code) {
//         try {
//           const response = await axios.post('YOUR_BACKEND_ENDPOINT', { code });
//           localStorage.setItem('accessToken', response.data.accessToken);
//           history.push('/dashboard');
//         } catch (error) {
//           console.error('Error exchanging token', error);
//           history.push('/login');
//         }
//       }
//     };

//     exchangeCodeForToken();
//   }, [location, history]);

//   return <div>Logging you in...</div>;
// };

// export default OAuthCallback;

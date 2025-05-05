import axios from "axios";

const axiosApi = axios.create( {
    baseURL: `http://127.0.0.1:9000/api/v1/`,
} );
export const axiosInstance = axiosApi;

axiosInstance.interceptors.request.use(
    ( config ) => {
        const tokenString = localStorage.getItem( "token" );
        if ( tokenString ) {
            const token = tokenString ? JSON.parse( tokenString ) : null;
            config.headers.Authorization = `Token ${ token }`;
        }
        return config;
    },
    ( error ) => {
        return Promise.reject( error );
    }
);

axiosInstance.interceptors.response.use(
    ( response ) => {
        console.log( "Response:", response );
        return response;
    },
    ( error ) => {
        console.log( "Error response:", error.response );
        if ( error.response && error.response.status === 401 ) {
            console.log( "Unauthorized, redirecting to login..." );
            // localStorage.clear();
            // sessionStorage.clear();
            // window.location.href = "/register";
            // window.location.reload();
        }
        return Promise.reject( error );
    }
);
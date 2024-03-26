import {useState, useEffect} from 'react';
import axios from 'axios';
// HELPER
import {extractTokenFromCookie} from "@/Helpers/extractToken";

export const useAuth = () => {
    // STATE
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                //GET THE TOKEN
                const token = extractTokenFromCookie(document.cookie);

                //CHECK IF THE TOKEN IS VALID
                if (!token) return setIsAuthenticated(false);

                const response = await axios.get(`https://api.lathaty.com/api/v1/get/verify/token`, {
                    params: {
                        token: token,
                    }
                });
                setIsAuthenticated(true);
                setUserData(response.data);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        fetchData();
    }, []);

    return {isAuthenticated, userData};
};

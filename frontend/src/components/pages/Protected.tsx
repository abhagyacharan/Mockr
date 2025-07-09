import {useEffect} from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPage(){
    const navigate = useNavigate();
    
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            console.log(token);
            try {
                const response = await fetch(`http://localhost:8000/api/auth/verify-token/${token}`);

                if (!response.ok){
                    throw new Error("Token verification failed.");
                }
            } catch (error) {
                localStorage.removeItem('token');
                navigate('/');
            }
        };

        verifyToken();
    }, [navigate]);

    return(
        <div>This is a protected Page.</div>
    )
}

export default ProtectedPage;
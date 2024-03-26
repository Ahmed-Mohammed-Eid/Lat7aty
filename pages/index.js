import React, { useState } from "react";
import MapContainer from "@/components/Map/Map";
// AXIOS
import axios from "axios";

export default function Home() {
    const [visible, setVisible] = useState(false);
    const [role, setRole] = useState("");

    // EFFECT TO SHOW MAP
    React.useEffect(() => {
        setVisible(true);
        // GET ROLE FROM LOCAL STORAGE
        const role = localStorage.getItem("role");
        // IF ROLE IS ADMIN, SHOW MAP
        if(role === "admin") {
            setVisible(true);
            setRole(role)
        }

        if(role === "farmer") {
            setVisible(false);
            setRole(role)
        }
    }, []);

    return (
        <>
            {role === "admin" && (<div className="card flex justify-content-center">
                {visible && (<MapContainer />)}
            </div>)}
        </>
    );
}

export async function getServerSideProps(ctx) {
    // GET THE TOKEN FROM THE COOKIES
    const token = ctx.req.cookies.token;

    // IF TOKEN NOT FOUND, REDIRECT TO LOGIN PAGE
    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    // IF TOKEN FOUND, FETCH USER DATA
    if (token) {
        axios
            .get(`https://api.lathaty.com/api/v1/get/verify/token`, {
                params: {
                    token: token,
                },
            })
            .then((_) => {
                // console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
                // REDIRECT TO LOGIN PAGE IF TOKEN IS INVALID
            });
    }

    return {
        props: {},
    };
}

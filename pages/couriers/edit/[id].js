//AXIOS
import axios from "axios";
//IMPORTS
import CourierForm from "@/components/CouriesForm/CourierEdit";


export default function EditCourier({id, courier}) {

    return (
        <CourierForm id={id} courier={courier}/>
    )
}


export async function getServerSideProps(ctx) {
    // GET THE ID FROM THE URL
    const {id} = ctx.query;
    // GET THE TOKEN FROM THE REQUEST
    const {token} = ctx.req.cookies;
    // GET THE COURIER FROM THE API AND GET THE ORDERS FROM ANOTHER API ENDPOINT USING THE COURIER ID AND THEY BOTH NEED THE TOKEN
    if(!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    // 02. GET THE COURIER
    const courier = await axios.get(`https://api.lathaty.com/api/v1/get/courier`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            courierId: id
        }
    })
        .then(res => res.data)
        .catch(err => err.response.data)

    // 03. RETURN THE PROPS TO THE COMPONENT WITH THE COURIER AND THE ORDERS DATA IF THEY EXIST
    if (courier.success === true) {
        return {
            props: {
                id: id,
                courier: courier.courier,
            }
        }
    }
    // 04. IF THE COURIER OR THE ORDERS DOESN'T EXIST RETURN THE PROPS WITH THE ID ONLY
    else {
        return {
            props: {
                id: id
            }
        }
    }
}
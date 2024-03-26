//AXIOS
import axios from "axios";
//IMPORTS
import EditOrder from "@/components/OrderForm/EditOrder";


export default function EditCourier({id, order}) {

    return (
        <EditOrder order={order} id={id} />
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
    const order = await axios.get(`https://api.lathaty.com/api/v1/order`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            orderId: id
        }
    })
        .then(res => res.data)
        .catch(err => err.response.data)

    // 03. RETURN THE PROPS TO THE COMPONENT WITH THE COURIER AND THE ORDERS DATA IF THEY EXIST
    if (order.success === true) {
        return {
            props: {
                id: id,
                order: order.order,
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
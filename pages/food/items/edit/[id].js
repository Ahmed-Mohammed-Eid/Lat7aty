import React from "react";
import ItemsEdit from "@/components/ItemsForm/ItemsEdit";
import axios from "axios";

function EditItem({item, id}) {
    return <ItemsEdit item={item} id={id} />;
}

export default EditItem;

export async function getServerSideProps(ctx) {
    // GET THE ID FROM THE URL
    const {id} = ctx.query;
    // GET THE TOKEN FROM THE REQUEST
    const {token} = ctx.req.cookies;
    // GET THE ROLE FROM THE REQUEST
    const {role} = ctx.req.cookies;

    // GET THE COURIER FROM THE API AND GET THE ORDERS FROM ANOTHER API ENDPOINT USING THE COURIER ID AND THEY BOTH NEED THE TOKEN
    if(!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    let url = "https://api.lathaty.com/api/v1/get/item";

    if(role === "farmer"){
        url =  `https://api.lathaty.com/api/v1/get/farmer/item`;
    }

    // 02. GET THE COURIER
    const item = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            itemId: id
        }
    })
        .then(res => res.data)
        .catch(err => err.response.data)

    // 03. RETURN THE PROPS TO THE COMPONENT WITH THE COURIER AND THE ORDERS DATA IF THEY EXIST
    if (item.success === true) {
        return {
            props: {
                id: id,
                item: item.item,
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
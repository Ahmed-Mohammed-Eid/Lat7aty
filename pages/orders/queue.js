import React, {useState, useEffect} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
// AXIOS
import axios from "axios";

// TOAST
import {toast} from "react-hot-toast";

const OrdersQueueTable = () => {

    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [orders, setOrders] = useState([]);

    // FUNCTION TO GET THE SHIFTS
    const getOrders = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET SHIFTS
        if (token) {
            axios
                .get(`https://api.lathaty.com/api/v1/queued/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setOrders(res.data?.orders);
                })
                .catch((err) => {
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }

    // FETCH SHIFTS
    useEffect(() => {
        getOrders();
    }, []);

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };

    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">Orders in queue</h1>

            <div className=" mb-3 w-full">
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText
                        placeholder="Search"
                        value={globalFilter || ""}
                        onChange={onGlobalFilter}
                        className="p-inputtext p-component"
                    />
                </span>
            </div>
            <DataTable
                value={orders}
                paginator
                first={page * rowsPerPage}
                rows={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sortMode="multiple"
                globalFilter={globalFilter}
                emptyMessage="No records found"
                // Max height of the table container
                scrollable
                scrollHeight="calc(100vh - 370px)"
            >
                <Column
                    field="areaName"
                    header="Area Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Area Name"
                />
                <Column
                    field="numberOfOrders"
                    header="Number of Orders"
                    sortable
                    filter
                    filterPlaceholder="Search by Number of Orders"
                />
            </DataTable>
        </div>
    );
};
export default OrdersQueueTable;

// SERVER SIDE PROPS
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

    return {
        props: {},
    };
}
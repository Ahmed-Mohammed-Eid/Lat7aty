import React, {useState} from "react";
// AXIOS
import axios from 'axios';
// TOAST
import {toast} from "react-hot-toast";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment/moment";
import {Dialog} from "primereact/dialog";


export default function Courier({courier, orders}) {

    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [orderInfoDialog, setOrderInfoDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    return (
        <div>
            {/*COURIER INFO PART*/}
            <div className={'card'}>
                <div className={'card-header'}>
                    <h3 className={'card-title uppercase'}>Courier</h3>
                    <div className={'card-body'}>
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">FullName:</div>
                                <div>{courier?.courierName}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Username:</div>
                                <div
                                    onClick={() => {
                                    // COPY THE USERNAME TO THE CLIPBOARD
                                    navigator.clipboard.writeText(courier?.username)
                                    // SHOW A TOAST
                                    toast.success('Username Copied to Clipboard', {
                                        position: "top-center",
                                        autoClose: 3000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                    });
                                }}
                                    style={{
                                        color: "#6b6bbb",
                                        cursor: "pointer",
                                    }}
                                >{courier?.username}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Phone Number:</div>
                                <div>{courier?.phoneNumber}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Birthdate:</div>
                                <div>
                                    {new Date(
                                        courier?.birthdate
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Company Name:</div>
                                <div>{courier?.companyName}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Car Brand:</div>
                                <div>{courier?.carBrand}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Car Model:</div>
                                <div>{courier?.carModel}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Has Fridge:</div>
                                <div>{courier?.hasFridge ? (<span className={"text-success"}>Yes</span>) : (
                                    <span className={"text-danger"}>No</span>)}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Plate Number:</div>
                                <div>{courier?.plateNumber}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">License Number:</div>
                                <div>{courier?.licenseNumber}</div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Area Name:</div>
                                <div>
                                    {courier?.workingAreaId?.areaName}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="font-bold">Zone Name:</div>
                                <div>
                                    {courier?.workingAreaId?.zoneName}
                                </div>
                            </div>

                            {courier?.documents?.length > 0 && (<div className="col-12 card mt-4">
                                <div className="font-bold">Attachments:</div>
                                <div className="grid mt-2 gap-2">
                                    {courier?.documents?.map((attachment, index) => {
                                        return (
                                            <a key={attachment}
                                               className={"bg-info py-1 px-4 inline-block custom-button rounded-md col-12 md:col-6 lg:col-3"}
                                               style={{color: 'white'}} href={attachment}
                                               target={"_blank"}>Attachment {index + 1}</a>
                                        )
                                    })}
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
            {/*ORDERS PART*/}
            <div className={'card mt-4'}>
                <div className={'card-header'}>
                    <h3 className={'card-title uppercase'}>Orders</h3>
                    <div className={'card-body'}>
                            <DataTable
                                value={orders}
                                paginator
                                first={page * rowsPerPage}
                                rows={rowsPerPage}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                sortMode="multiple"
                                emptyMessage="No records found"
                                // Max height of the table container
                                scrollable
                                scrollHeight="calc(100vh - 370px)"
                            >
                                <Column
                                    field="clientId"
                                    header="Client ID"
                                    sortable
                                    filter
                                    filterPlaceholder="Search by Client ID"
                                    body={(rowData) => {
                                        return (
                                            <span
                                                className="text-blue-500"
                                            >
                                {rowData.clientId}
                            </span>
                                        );
                                    }}
                                />
                                <Column
                                    field="parcelName"
                                    header="Parcel Name"
                                    sortable
                                    filter
                                    filterPlaceholder="Search by Parcel Name"
                                />
                                <Column
                                    field="senderName"
                                    header="Sender Name"
                                    sortable
                                    filter
                                    filterPlaceholder="Search by Sender Name"
                                />
                                <Column
                                    field="receiverName"
                                    header="Reciever Name"
                                    sortable
                                    filter
                                    filterPlaceholder="Search by Reciever Name"
                                />
                                <Column
                                    field="orderStatus"
                                    header="Status"
                                    sortable
                                    filter
                                    filterPlaceholder="Search by Reciever Name"
                                    body={(rowData) => {
                                        // STATUS ARRAY OF OBJECTS WITH STATE CHILD TO LOOP THROUGH AND RETURN THE STATE NAME WITH CUSTOM STYLING FROM ROWDATA
                                        if (rowData?.orderStatus.length > 0) {
                                            // GET THE LAST STATUS  OBJECT
                                            const lastStatus = rowData.orderStatus[rowData.orderStatus.length - 1].state;
                                            // RETURN THE LAST STATUS WITH CUSTOM STYLING AND MY STATUS WILL BE [pending, accepted, received, delivered]
                                            if (lastStatus === "pending") {
                                                return <span className="px-3 py-1 text-white rounded-full bg-yellow-500 capitalize"
                                                             style={{fontSize: '11px'}}>{lastStatus}</span>
                                            } else if (lastStatus === "accepted") {
                                                return <span className="px-3 py-1 text-white rounded-full bg-blue-500 capitalize"
                                                             style={{fontSize: '11px'}}>{lastStatus}</span>
                                            } else if (lastStatus === "received") {
                                                return <span className="px-3 py-1 text-white rounded-full bg-cyan-500 capitalize"
                                                             style={{fontSize: '11px'}}>{lastStatus}</span>
                                            } else if (lastStatus === "delivered") {
                                                return <span className="px-3 py-1 text-white rounded-full bg-green-500 capitalize"
                                                             style={{fontSize: '11px'}}>{lastStatus}</span>
                                            } else {
                                                return <span>{lastStatus}</span>
                                            }
                                        }
                                    }}
                                />
                                <Column
                                    field="createdAt"
                                    header="Created At"
                                    sortable
                                    filter
                                    filterPlaceholder="Search by Created At"
                                    body={(rowData) => {
                                        return <span>{moment(rowData.createdAt).format("DD/MM/YYYY")}</span>
                                    }}
                                />
                                <Column
                                    field="paymentStatus"
                                    header="Payment Status"
                                    sortable
                                    filter
                                    filterPlaceholder="Search by Payment Status"
                                    body={(rowData) => {
                                        // STATUS ARRAY OF OBJECTS WITH STATE CHILD TO LOOP THROUGH AND RETURN THE STATE NAME WITH CUSTOM STYLING FROM ROWDATA
                                        if (rowData?.paymentStatus) {
                                            // RETURN THE LAST STATUS WITH CUSTOM STYLING AND MY STATUS WILL BE [pending, accepted, received, delivered]
                                            if (rowData.paymentStatus === "pending") {
                                                return <span className="px-3 py-1 text-white rounded-full bg-yellow-500 capitalize"
                                                             style={{fontSize: '11px'}}>{rowData.paymentStatus}</span>
                                            } else if (rowData.paymentStatus.trim() === "paid") {
                                                return <span className="px-3 py-1 text-white rounded-full bg-green-500 capitalize"
                                                             style={{fontSize: '11px'}}>{rowData.paymentStatus}</span>
                                            } else {
                                                return <span>{rowData.paymentStatus}</span>
                                            }
                                        }
                                    }
                                    }
                                />
                                <Column
                                    field="_id"
                                    header="Actions"
                                    body={(rowData) => {
                                        return (
                                            <div className="flex gap-2">
                                                <button
                                                    className="bg-info text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                                    onClick={() => {
                                                        setSelectedOrder(rowData);
                                                        setOrderInfoDialog(true);
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        );
                                    }}
                                />
                            </DataTable>
                            <Dialog
                                header="ORDER INFO"
                                visible={orderInfoDialog}
                                style={{width: "90vw", maxWidth: "600px"}}
                                onHide={() => {
                                    // CLOSE THE DIALOG AND IF DIALOG IS CLOSED, SET THE SELECTED order TO NULL
                                    setOrderInfoDialog(false);
                                    const timer = setTimeout(() => {
                                        setSelectedOrder(null);
                                        clearTimeout(timer);
                                    }, 500)
                                }}
                            >
                                <div className="grid col-12">
                                    <div className="col-6">
                                        <div className="font-bold">CLIENT ID</div>
                                        <div>{selectedOrder?.clientId}</div>
                                    </div>
                                    <div className={'col-6'}>
                                        <div className="font-bold">PAYER</div>
                                        <div>{selectedOrder?.payer}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">PARCEL NAME</div>
                                        <div>{selectedOrder?.parcelName}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">PARCEL TYPE</div>
                                        <div>{selectedOrder?.parcelType}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">SENDER NAME</div>
                                        <div>{selectedOrder?.senderName}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">SENDER PHONE</div>
                                        <div>{selectedOrder?.senderPhone}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">RECEIVER NAME</div>
                                        <div>{selectedOrder?.receiverName}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">RECEIVER PHONE</div>
                                        <div>{selectedOrder?.receiverPhone}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">FROM (ADDRESS)</div>
                                        <div>{selectedOrder?.fromAddress}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">TO (ADDRESS)</div>
                                        <div>{selectedOrder?.toAddress}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">PAYMENT TYPE</div>
                                        <div>{selectedOrder?.paymentType}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">PAYMENT STATUS</div>
                                        <div>{selectedOrder?.paymentStatus}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">CREATED AT</div>
                                        <div>{moment(selectedOrder?.createdAt).format("DD/MM/YYYY")}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="font-bold">ORDER TIME</div>
                                        <div>{selectedOrder?.orderTime}</div>
                                    </div>
                                    <div className="col-12 card mt-3">
                                        <div className="font-bold">ORDER NOTES</div>
                                        <div>{selectedOrder?.notes}</div>
                                    </div>
                                </div>
                            </Dialog>
                    </div>
                </div>
            </div>
        </div>
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

    // 01. GET THE ORDERS
    const response = await axios.get(`https://api.lathaty.com/api/v1/courier/orders`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            courierId: id
        }
    })
        .then(res => res.data)
        .catch(err => err.response.data)

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
    if (response.success === true && courier.success === true) {
        return {
            props: {
                id: id,
                courier: courier.courier,
                orders: response.orders
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
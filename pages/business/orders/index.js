import React, {useState, useEffect} from "react";
import Image from "next/image";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import moment from "moment";
import Link from "next/link";

// AXIOS
import axios from "axios";

// TOAST
import {toast} from "react-hot-toast";

// IMPORT SOCKET IO
import {getIo} from "@/Helpers/socket";

const OrdersTable = () => {
    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [globalFilter, setGlobalFilter] = useState("");
    const [orders, setOrders] = useState([]);
    const [orderInfoDialog, setOrderInfoDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);


    // STATE FOR THE OVERLAY PANEL
    const [selectedOrderImage, setSelectedOrderImage] = useState(null);

    // FETCH ORDERS
    useEffect(() => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET ORDERS
        if (token) {
            getAllOrders();
        } else {
            toast.error("You are not authorized to access this page");
        }
    }, []);


    // HANDLER TO GET ALL ORDERS
    const getAllOrders = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");
        // GET THE ID FROM LOCAL STORAGE
        const id = localStorage.getItem("userId");

        // GET ORDERS
        if (token) {
            // GET ORDERS
            axios
                .get(`https://api.lathaty.com/api/v1/get/business/orders?businessOwnerId=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page: page,
                    },
                })
                .then((res) => {
                    setOrders(res.data?.orders || []);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };

    // SOCKET IO
    useEffect(() => {
        const socket = getIo();

        socket.on("business_order", (event) => {
            getAllOrders();
            toast.success(event?.message || "New order received");
        })
    }, [])

    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">Orders</h1>

            <div
                className="mb-3 w-full"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
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
                rows={rowsPerPage}
                rowsPerPageOptions={[25, 50, 100]}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                globalFilter={globalFilter}
                header="Orders"
                emptyMessage="No orders found"
                className="p-datatable-sm"
            >
                <Column
                    field="parcelName"
                    header="Parcel Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Parcel Name"
                    style={{whiteSpace: "nowrap"}}
                    body={(rowData) => {
                        return (
                            <span
                                className="font-bold"
                                style={{
                                    cursor: "pointer",
                                    userSelect: "none",
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedOrderImage(rowData?.parcelImage);
                                }}
                            >
                                {rowData.parcelName}
                            </span>
                        );
                    }}
                />
                <Column
                    field="senderName"
                    header="Sender Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Sender Name"
                    style={{whiteSpace: "nowrap"}}
                />
                <Column
                    field="receiverName"
                    header="Reciever Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Reciever Name"
                    style={{whiteSpace: "nowrap"}}
                />
                <Column
                    field="orderType"
                    header="Order Type"
                    sortable
                    filter
                    filterPlaceholder="Search by Order Type"
                    body={(rowData) => {
                        // THE ORDER TYPE IS INSTANT OR postponed
                        return (
                            <span
                                className={
                                    rowData.orderType === "instant"
                                        ? "text-green-500"
                                        : "text-red-500"
                                }
                            >
                                {rowData.orderType === "instant"
                                    ? "Instant"
                                    : "Postponed"}
                            </span>
                        );
                    }}
                    style={{whiteSpace: "nowrap"}}
                />
                <Column
                    field="orderStatus"
                    header="Status"
                    sortable
                    filter
                    filterPlaceholder="Search by Reciever Name"
                    body={(rowData) => {
                        // STATUS ARRAY OF OBJECTS WITH STATE CHILD TO LOOP THROUGH AND RETURN THE STATE NAME WITH CUSTOM STYLING FROM ROW DATA
                        if (rowData?.orderStatus.length > 0) {
                            // GET THE LAST STATUS  OBJECT
                            const lastStatus =
                                rowData.orderStatus[
                                rowData.orderStatus.length - 1
                                    ]?.state;
                            // RETURN THE LAST STATUS WITH CUSTOM STYLING AND MY STATUS WILL BE [pending, accepted, received, delivered]
                            if (lastStatus === "pending") {
                                return (
                                    <span
                                        className="px-3 py-1 text-white rounded-full bg-yellow-500 capitalize"
                                        style={{fontSize: "11px"}}
                                    >
                                        {lastStatus}
                                    </span>
                                );
                            } else if (lastStatus === "accepted") {
                                return (
                                    <span
                                        className="px-3 py-1 text-white rounded-full bg-blue-500 capitalize"
                                        style={{fontSize: "11px"}}
                                    >
                                        {lastStatus}
                                    </span>
                                );
                            } else if (lastStatus === "received") {
                                return (
                                    <span
                                        className="px-3 py-1 text-white rounded-full bg-cyan-500 capitalize"
                                        style={{fontSize: "11px"}}
                                    >
                                        {lastStatus}
                                    </span>
                                );
                            } else if (lastStatus === "rejected") {
                                return (
                                    <span
                                        className="px-3 py-1 text-white rounded-full bg-red-500 capitalize"
                                        style={{fontSize: "11px"}}
                                    >
                                        {lastStatus}
                                    </span>
                                );
                            } else if (lastStatus === "canceled") {
                                return (
                                    <span
                                        className="px-3 py-1 text-white rounded-full bg-red-500 capitalize"
                                        style={{fontSize: "11px"}}
                                    >
                                        {lastStatus}
                                    </span>
                                );
                            } else if (lastStatus === "transporting") {
                                return (
                                    <span
                                        className="px-3 py-1 text-white rounded-full bg-purple-500 capitalize"
                                        style={{fontSize: "11px"}}
                                    >
                                        {lastStatus}
                                    </span>
                                );
                            } else if (lastStatus === "delivered") {
                                return (
                                    <span
                                        className="px-3 py-1 text-white rounded-full bg-green-500 capitalize"
                                        style={{fontSize: "11px"}}
                                    >
                                        {lastStatus}
                                    </span>
                                );
                            } else {
                                return <span>{lastStatus}</span>;
                            }
                        }
                    }}
                    style={{whiteSpace: "nowrap"}}
                />
                <Column
                    field="createdAt"
                    header="Created At"
                    sortable
                    filter
                    filterPlaceholder="Search by Created At"
                    body={(rowData) => {
                        return (
                            <span>
                                {moment(rowData.createdAt).format("DD/MM/YYYY")}
                            </span>
                        );
                    }}
                    style={{whiteSpace: "nowrap"}}
                />
                <Column
                    field="paymentStatus"
                    header="Payment Status"
                    sortable
                    filter
                    filterPlaceholder="Search by Payment Status"
                    body={(rowData) => {
                        // STATUS ARRAY OF OBJECTS WITH STATE CHILD TO LOOP THROUGH AND RETURN THE STATE NAME WITH CUSTOM STYLING FROM ROW DATA
                        if (rowData?.paymentStatus) {
                            // RETURN THE LAST STATUS WITH CUSTOM STYLING AND MY STATUS WILL BE [pending, accepted, received, delivered]
                            if (rowData.paymentStatus === "pending") {
                                return (
                                    <span
                                        className="px-3 py-1 text-white rounded-full bg-yellow-500 capitalize"
                                        style={{fontSize: "11px"}}
                                    >
                                        {rowData.paymentStatus}
                                    </span>
                                );
                            } else if (
                                rowData.paymentStatus.trim() === "paid"
                            ) {
                                return (
                                    <span
                                        className="px-3 py-1 text-white rounded-full bg-green-500 capitalize"
                                        style={{fontSize: "11px"}}
                                    >
                                        {rowData.paymentStatus}
                                    </span>
                                );
                            } else {
                                return <span>{rowData.paymentStatus}</span>;
                            }
                        }
                    }}
                    style={{whiteSpace: "nowrap"}}
                />
                <Column
                    field="serviceType"
                    header="Service Type"
                    sortable
                    filter
                    filterPlaceholder="Search by Service Type"
                    style={{whiteSpace: "nowrap"}}
                />
                <Column
                    field="_"
                    header="Actions"
                    body={(rowData) => {
                        return (
                            <div className="flex items-center justify-center">
                                <button
                                    className="button text-white bg-blue-500 px-4 py-2 rounded-md border-none pointer custom-button"
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
                    style={{whiteSpace: "nowrap"}}
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
                    }, 500);
                }}
            >
                <div className="grid col-12">
                    {selectedOrder?.parcelImage && (<div className="col-12">
                        <Image
                            src={selectedOrder?.parcelImage}
                            alt="Parcel Image"
                            width={200}
                            height={200}
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </div>)}
                    <div className="col-6">
                        <div className="font-bold">CLIENT ID</div>
                        <div>{selectedOrder?.clientId}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">ORDER NUMBER</div>
                        <div>{selectedOrder?.orderNumber}</div>
                    </div>
                    <div className={"col-6"}>
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
                        <div className={"font-bold"}>ORDER PRICE</div>
                        <div>{selectedOrder?.deliveryPrice}</div>
                    </div>
                    <div className="col-6">
                        <div className={"font-bold"}>COLLECTION AMOUNT</div>
                        <div>{selectedOrder?.collectionAmount}</div>
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
                        <div className="font-bold">Order Date</div>
                        <div>{`${moment(selectedOrder?.createdAt).format(
                            "DD/MM/YYYY"
                        )} - (${moment(selectedOrder?.orderDate).format(
                            "DD/MM/YYYY"
                        )})`}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">ORDER TIME</div>
                        <div>{selectedOrder?.orderTime}</div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">Has Fridge</div>
                        <div>
                            {selectedOrder?.courierId?.vehicleType ===
                            "fridge" ? (
                                <span className={"text-success"}>Yes</span>
                            ) : (
                                <span className={"text-danger"}>No</span>
                            )}
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">FROM POINT</div>
                        <Link
                            href={`https://www.google.com/maps?q=${selectedOrder?.fromPoint?.lat},${selectedOrder?.fromPoint?.lng}`}
                            target="_blank"
                        >
                            <span className="mr-2">
                                Lat: {selectedOrder?.fromPoint?.lat}
                            </span>
                            <span>Lng: {selectedOrder?.fromPoint?.lng}</span>
                        </Link>
                    </div>
                    <div className="col-6">
                        <div className="font-bold">TO POINT</div>
                        <Link
                            href={`https://www.google.com/maps?q=${selectedOrder?.toPoint?.lat},${selectedOrder?.toPoint?.lng}`}
                            target="_blank"
                        >
                            <span className="mr-2">
                                Lat: {selectedOrder?.toPoint?.lat}
                            </span>
                            <span>Lng: {selectedOrder?.toPoint?.lng}</span>
                        </Link>
                    </div>
                    {selectedOrder?.courierId && (
                        <div className="col-12 card grid mt-4">
                            <div className={"col-6"}>
                                <div className="font-bold">COURIER NAME</div>
                                <div>
                                    {selectedOrder?.courierId?.courierName}
                                </div>
                            </div>
                            <div className={"col-6"}>
                                <div className="font-bold">COURIER PHONE</div>
                                <div>
                                    {selectedOrder?.courierId?.phoneNumber}
                                </div>
                            </div>
                            <div className={"col-6"}>
                                <div className="font-bold">COURIER COMPANY</div>
                                <div>
                                    {selectedOrder?.courierId?.companyName}
                                </div>
                            </div>
                            <div className={"col-6"}>
                                <div className="font-bold">COURIER CAR</div>
                                <div>
                                    {selectedOrder?.courierId?.carBrand} -{" "}
                                    {selectedOrder?.courierId?.carModel} -{" "}
                                    {selectedOrder?.courierId?.licenseNumber}
                                </div>
                            </div>
                            <div className={"col-6"}>
                                <div className="font-bold">REJECT REASON</div>
                                <div>{selectedOrder?.rejectionReason}</div>
                            </div>
                            <div className="col-6">
                                <div className="font-bold">Has Fridge</div>
                                <div>
                                    {selectedOrder?.courierId?.vehicleType ===
                                    "fridge" ? (
                                        <span className={"text-success"}>
                                            Yes
                                        </span>
                                    ) : (
                                        <span className={"text-danger"}>
                                            No
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedOrder?.orderItems?.length > 0 && (
                        <div className="col-12 card mt-3">
                            <div className="font-bold">ORDER ITEMS</div>
                            <div className="grid col-12 mt-2">
                                <DataTable
                                    value={selectedOrder?.orderItems}
                                    style={{width: "100%"}}
                                    paginator
                                    rows={5}
                                    totalRecords={
                                        selectedOrder?.orderItems?.length
                                    }
                                    lazy
                                    first={1}
                                >
                                    <Column
                                        field="itemName"
                                        header="Item Name"
                                        sortable
                                        filter
                                        filterPlaceholder="Search by Item Name"
                                    />
                                    <Column
                                        field="quantity"
                                        header="Item Quantity"
                                        sortable
                                        filter
                                        filterPlaceholder="Search by Item Quantity"
                                    />
                                    <Column
                                        field="itemPrice"
                                        header="Item Price"
                                        sortable
                                        filter
                                        filterPlaceholder="Search by Item Price"
                                    />
                                    <Column
                                        field="_id"
                                        header="Total Price"
                                        sortable
                                        filter
                                        filterPlaceholder="Search by Total Price"
                                        body={(rowData) => {
                                            return (
                                                <span>
                                                    {rowData.quantity *
                                                    rowData.itemPrice}
                                                </span>
                                            );
                                        }}
                                    />
                                </DataTable>
                            </div>
                        </div>
                    )}
                    {selectedOrder?.notes && (
                        <div className="col-12 card mt-3">
                            <div className="font-bold">ORDER NOTES</div>
                            <div>{selectedOrder?.notes}</div>
                        </div>
                    )}
                    {selectedOrder?.attachments.length > 0 && (
                        <div className="col-12 card">
                            <div className="font-bold">ORDER ATTACHMENTS</div>
                            <div className="grid col-6 gap-2 mt-2">
                                {selectedOrder?.attachments?.map(
                                    (attachment, index) => {
                                        return (
                                            <button
                                                type={"button"}
                                                key={index}
                                                className="button text-white px-6 py-3 rounded-md border-none pointer custom-button"
                                                style={{
                                                    backgroundColor: "#28a745",
                                                    color: "#fff",
                                                    padding: ".5rem",
                                                    borderRadius: "5px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    window.open(
                                                        attachment,
                                                        "_blank"
                                                    );
                                                }}
                                            >
                                                Attachment {index + 1}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
            <Dialog
                onHide={() => setSelectedOrderImage(null)}
                visible={selectedOrderImage}
                style={{width: "90vw", maxWidth: "600px"}}
            >
                <Image
                    src={selectedOrderImage || ""}
                    alt="Order Image"
                    width={550}
                    height={500}
                    style={{
                        objectFit: "contain",
                        display: "block",
                        marginLeft: "auto",
                    }}
                />
            </Dialog>
        </div>
    );
};
export default OrdersTable;

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

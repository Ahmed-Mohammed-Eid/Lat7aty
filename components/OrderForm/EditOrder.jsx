import React, {useState, useEffect} from "react";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {Checkbox} from "primereact/checkbox";

// NOTIFICATION
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";


const EditOrder = ({id, order: orderServer}) => {

    // STATES
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState({
        orderId: "",
        notes: "",
        serviceType: "",
        paymentStatus: "",
        paymentType: "",
        payer: "",
        deliveryPrice: "",
        receiverPhone: "",
        receiverName: "",
        senderPhone: "",
        senderName: "",
        parcelType: "",
        parcelName: "",
        toAddress: "",
        fromAddress: "",
        convertedToPostponed: false,
    });

    // SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        // Check if all fields are filled
        if (!order.orderId || !order.serviceType || !order.paymentStatus || !order.paymentType || !order.payer || !order.deliveryPrice || !order.receiverPhone || !order.receiverName || !order.senderPhone || !order.senderName || !order.parcelType || !order.parcelName || !order.toAddress || !order.fromAddress) {
            toast.error("Please fill all fields");
            return;
        }

        // Create object for the data
        const data = {
            orderId: order.orderId,
            notes: order.notes,
            serviceType: order.serviceType,
            paymentStatus: order.paymentStatus,
            paymentType: order.paymentType,
            payer: order.payer,
            deliveryPrice: order.deliveryPrice,
            receiverPhone: order.receiverPhone,
            receiverName: order.receiverName,
            senderPhone: order.senderPhone,
            senderName: order.senderName,
            parcelType: order.parcelType,
            parcelName: order.parcelName,
            toAddress: order.toAddress,
            fromAddress: order.fromAddress,
            orderType: order.convertedToPostponed ? "postponed" : "instant",
        }

        // set the loading to true
        setLoading(true);

        // Send the form data to the server
        axios.put("https://api.lathaty.com/api/v1/edit/order", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                // set the loading to false
                setLoading(false);
                // show success message
                toast.success(res.data?.message || 'Order Updated Successfully');
            })
            .catch((err) => {
                console.log(err.response);
                // set the loading to false
                setLoading(false);
                // show error message
                toast.error(err.response.data.message);
            });
    };

    // EFFECT TO SET THE ORDER DATA FROM THE SERVER VERSION
    useEffect(() => {
        setOrder({
            orderId: orderServer._id || id,
            notes: orderServer.notes,
            serviceType: orderServer.serviceType,
            paymentStatus: orderServer.paymentStatus,
            paymentType: orderServer.paymentType,
            payer: orderServer.payer,
            deliveryPrice: orderServer.deliveryPrice,
            receiverPhone: orderServer.receiverPhone,
            receiverName: orderServer.receiverName,
            senderPhone: orderServer.senderPhone,
            senderName: orderServer.senderName,
            parcelType: orderServer.parcelType,
            parcelName: orderServer.parcelName,
            toAddress: orderServer.toAddress,
            fromAddress: orderServer.fromAddress,
            convertedToPostponed: orderServer?.orderType !== "instant",
        })
    }, [id, orderServer]);

    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">Edit Order</h1>

                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="parcel-name">Parcel Name</label>
                        <InputText
                            id="parcel-name"
                            value={order.parcelName}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    parcelName: e.target.value,
                                })
                            }
                            placeholder="Parcel Name"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="parcel-type">Parcel Type</label>
                        <Dropdown
                            id="parcel-type"
                            value={order.parcelType}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    parcelType: e.target.value,
                                })
                            }
                            placeholder="Parcel Type"
                            options={[
                                {label: "ملفات", value: "ملفات"},
                                {label: "طعام", value: "طعام"},
                                {label: "حلويات", value: "حلويات"},
                                {label: "دواء", value: "دواء"},
                                {label: "ملابس", value: "ملابس"},
                                {label: "غير ذلك", value: "غير ذلك"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="sender-name">Sender Name</label>
                        <InputText
                            id="sender-name"
                            value={order.senderName}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    senderName: e.target.value,
                                })
                            }
                            placeholder="Sender Name"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="sender-phone">Sender Phone</label>
                        <InputText
                            id="sender-phone"
                            value={order.senderPhone}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    senderPhone: e.target.value,
                                })
                            }
                            placeholder="Sender Phone"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="receiver-name">Receiver Name</label>
                        <InputText
                            id="receiver-name"
                            value={order.receiverName}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    receiverName: e.target.value,
                                })
                            }
                            placeholder="Receiver Name"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="receiver-phone">Receiver Phone</label>
                        <InputText
                            id="receiver-phone"
                            value={order.receiverPhone}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    receiverPhone: e.target.value,
                                })
                            }
                            placeholder="Receiver Phone"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="service-type">Service Type</label>
                        <Dropdown
                            id="service-type"
                            value={order.serviceType}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    serviceType: e.target.value,
                                })
                            }
                            placeholder="Service Type"
                            options={[
                                {label: "Individual", value: "individual"},
                                {label: "Task", value: "task"},
                                {label: "Business", value: "business"},
                                {label: "Food", value: "food"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="address-from">From</label>
                        <InputText
                            id="address-from"
                            value={order.fromAddress}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    fromAddress: e.target.value,
                                })
                            }
                            placeholder="From"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="address-to">To</label>
                        <InputText
                            id="address-to"
                            value={order.toAddress}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    toAddress: e.target.value,
                                })
                            }
                            placeholder="To"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="delivery-price">Delivery Price</label>
                        <InputText
                            id="delivery-price"
                            value={order.deliveryPrice}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    deliveryPrice: e.target.value,
                                })
                            }
                            placeholder="Delivery Price"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="payer">Payer</label>
                        <InputText
                            id="payer"
                            value={order.payer}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    payer: e.target.value,
                                })
                            }
                            placeholder="Payer"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="payment-type">Payment Type</label>
                        <Dropdown
                            id="payment-type"
                            value={order.paymentType}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    paymentType: e.target.value,
                                })
                            }
                            placeholder="Payment Type"
                            options={[
                                {label: "Cash", value: "cash"},
                                {label: "Card", value: "card"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="payment-status">Payment Status</label>
                        <Dropdown
                            id="payment-status"
                            value={order.paymentStatus.trim()}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    paymentStatus: e.target.value,
                                })
                            }
                            placeholder="Payment Status"
                            options={[
                                {label: "Paid", value: "paid"},
                                {label: "Pending", value: "pending"},
                            ]}
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="notes">Notes</label>
                        <InputTextarea
                            id="notes"
                            value={order.notes}
                            onChange={(e) =>
                                setOrder({
                                    ...order,
                                    notes: e.target.value,
                                })
                            }
                            placeholder="Notes"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="CTP">Convert to Postponed</label>
                        <Checkbox
                            inputId="CTP"
                            name="CTP"
                            onChange={e => {
                                setOrder({
                                    ...order,
                                    convertedToPostponed: e.checked
                                })
                            }}
                            checked={order.convertedToPostponed}
                            className={'block'}
                        ></Checkbox>
                    </div>


                    <div className="w-1/2 ml-auto">
                        <Button
                            type="submit"
                            className="bg-slate-500 w-full"
                            style={{
                                background: loading
                                    ? "#dcdcf1"
                                    : "var(--primary-color)",
                            }}
                            label={
                                loading ? (
                                    <ProgressSpinner
                                        strokeWidth="4"
                                        style={{
                                            width: "1.5rem",
                                            height: "1.5rem",
                                        }}
                                    />
                                ) : (
                                    "Submit"
                                )
                            }
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditOrder;

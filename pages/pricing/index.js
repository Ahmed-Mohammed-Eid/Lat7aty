import React, {useEffect, useState} from 'react';

// AXIOS
import axios from 'axios';
// TOAST
import {toast} from 'react-hot-toast';

// COMPONENTS
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";


export default function Pricing() {

    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [prices, setPrices] = useState([]);
    // STATES
    const [loading, setLoading] = useState(false);
    const [pricing, setPricing] = useState({
        pricingId: 0,
        pricePerKm: 0,
        minimumPrice: 0,
        priceForFridge: 0,
    })

    // SUBMIT HANDLER
    const submitHandler = (e) => {
        e.preventDefault();
        // VALIDATION
        if (!pricing.pricingId) {
            toast.error('Please select a price type');
            return;
        }
        if (!pricing.pricePerKm) {
            toast.error('Please enter a price per KM');
            return;
        }
        if (!pricing.minimumPrice) {
            toast.error('Please enter a minimum price');
            return;
        }

        // GET THE TOKEN
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Please login first');
            return;
        }

        // SUBMIT
        setLoading(true);

        axios.post('https://api.lathaty.com/api/v1/set/pricing', {
            pricingCategory: pricing.pricingId,
            pricePerKilometer: pricing.pricePerKm,
            minimumPrice: pricing.minimumPrice,
            fridgePrice: pricing.priceForFridge
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then(_ => {
                setLoading(false);
                toast.success('Price set successfully');
            })
            .catch(_ => {
                setLoading(false);
                toast.error('Something went wrong');
            })
    }

    // FUNCTION TO GET THE SHIFTS
    const getPrices = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET SHIFTS
        if (token) {
            axios
                .get(`https://api.lathaty.com/api/v1/prices/list`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setPrices(res.data?.prices);
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
        getPrices();
    }, []);

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };
    
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title uppercase">SET PRICE</h5>
                </div>
                <form className={'p-fluid formgrid grid'} onSubmit={submitHandler}>
                    <div className="field col-12">
                        <label htmlFor="price-type" className={'font-bold'}>Price Category</label>
                        <Dropdown
                            id="price-type"
                            value={pricing.pricingId}
                            onChange={(e) =>
                                setPricing({...pricing, pricingId: e.target.value})
                            }
                            placeholder="Select a Price Type"
                            options={[
                                {label: 'Individual', value: 'individual'},
                                {label: 'Task', value: 'task'},
                                {label: 'Business', value: 'business'},
                                {label: 'Food', value: 'food'}
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="pricePerKilometer" className={'font-bold'}>Price Per Km</label>
                        <InputNumber
                            id="pricePerKilometer"
                            value={pricing.pricePerKm}
                            currency={"KWD"}
                            mode={'currency'}
                            onChange={(e) =>
                                setPricing({...pricing, pricePerKm: e.value})
                            }
                            placeholder="Price per KM"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="minimumPrice" className={'font-bold'}>Minimum Price</label>
                        <InputNumber
                            id="minimumPrice"
                            value={pricing.minimumPrice}
                            currency={"KWD"}
                            mode={'currency'}
                            onChange={(e) =>
                                setPricing({...pricing, minimumPrice: e.value})
                            }
                            placeholder="Minimum Price"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor={'priceForFridge'} className={'font-bold'}>Price for Fridge</label>
                        <InputNumber
                            id="priceForFridge"
                            value={pricing.priceForFridge}
                            currency={"KWD"}
                            mode={'currency'}
                            onChange={(e) =>
                                setPricing({...pricing, priceForFridge: e.value})
                            }
                            placeholder="Price for Fridge"
                        />
                    </div>

                    <div className="w-1/2 ml-auto mr-2">
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
                </form>
            </div>
            <div className="card">
                <h1 className="text-2xl mb-5 uppercase">Prices List</h1>

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
                    value={prices}
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
                        field="pricingCategory"
                        header="Price Category"
                        sortable
                        filter
                        filterPlaceholder="Search by Price Category"
                        body={(rowData) => {
                            return (
                                <span className="uppercase">{rowData.pricingCategory}</span>
                            );
                        }}
                    />
                    <Column
                        field="pricePerKilometer"
                        header="Price Per KM"
                        sortable
                        filter
                        filterPlaceholder="Search by Price Per KM"
                    />
                    <Column
                        field="minimumPrice"
                        header="Minimum Price"
                        sortable
                        filter
                        filterPlaceholder="Search by Minimum Price"
                    />
                    <Column
                        field="fridgePrice"
                        header="Fridge Price"
                        sortable
                        filter
                        filterPlaceholder="Search by Fridge Price"
                    />
                </DataTable>
            </div>

        </>
    )
}


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

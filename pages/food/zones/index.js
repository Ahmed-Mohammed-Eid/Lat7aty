import React, {useEffect, useState} from 'react';

// AXIOS
import axios from 'axios';
// TOAST
import {toast} from 'react-hot-toast';

// COMPONENTS
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
// TEXT AREA
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";


export default function Zones() {


    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;
    
    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [zones, setZones] = useState([]);
    // STATES
    const [loading, setLoading] = useState(false);
    const [zone, setZone] = useState({
        zoneName: '',
        lat: '',
        long: '',
        zonePrice: '',
    })
    const [selectedZoneDelete, setSelectedZoneDelete] = useState({
        areaDialogDelete: false,
        zoneIdDelete: "",
    });

    // STATES FOR LOADERS
    const [deleteZoneLoader, setDeleteZoneLoader] = useState(false);


    // SUBMIT HANDLER
    const submitHandler = (e) => {
        e.preventDefault();
        // VALIDATION
        if (!zone.zoneName || !zone.lat || !zone.long) {
            toast.error('Please fill all the fields');
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

        axios.post('https://api.lathaty.com/api/v1/create/food/zone', {
            zoneName: zone.zoneName,
            lat: zone.lat,
            lng: zone.long,
            zonePrice: zone.zonePrice,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then(_ => {
                setLoading(false);
                toast.success('Zone created successfully');
                // RESET THE STATE
                setZone({
                    zoneName: '',
                    lat: '',
                    long: '',
                })
                // GET ZONES
                getZones();
            })
            .catch(_ => {
                setLoading(false);
                toast.error('Something went wrong while creating the zone');
            })
    }

    // FUNCTION TO GET THE SHIFTS
    const getZones = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET SHIFTS
        if (token) {
            axios
                .get(`https://api.lathaty.com/api/v1/food/zones`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setZones(res.data?.foodZones);
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
        getZones();
    }, []);

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };


    // DELETE ZONE
    function deleteZoneHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // CHECK IF THE ID IS VALID
        if (selectedZoneDelete.zoneIdDelete === null) {
            toast.error("Please select a shift to delete");
            return;
        }

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setDeleteZoneLoader(true)
            axios
                .delete(`https://api.lathaty.com/api/v1/delete/food/zone`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        foodZoneId: selectedZoneDelete?.zoneIdDelete
                    }
                })
                .then(async (res) => {
                    toast.success(res.data.message);
                    // GET SHIFTS
                    await getZones();
                    // CLOSE THE DIALOG
                    setSelectedZoneDelete({
                        areaDialogDelete: false,
                        zoneIdDelete: "",
                    });
                    // CLOSE THE LOADER
                    setDeleteZoneLoader(false)
                })
                .catch((err) => {
                    setDeleteZoneLoader(false)
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }


    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title uppercase">CREATE ZONE</h5>
                </div>
                <form className={'p-fluid formgrid grid'} onSubmit={submitHandler}>
                    <div className="field col-12">
                        <label htmlFor="zoneName" className={'font-bold'}>Zone Name</label>
                        <InputText
                            id="zoneName"
                            value={zone.zoneName}
                            onChange={(e) => setZone({...zone, zoneName: e.target.value})}
                            placeholder="Zone Name"
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="lat" className={'font-bold'}>Lat</label>
                        <InputText
                            id="lat"
                            value={zone.lat}
                            onChange={(e) => setZone({...zone, lat: e.target.value})}
                            placeholder="Lat"
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="lng" className={'font-bold'}>Lng</label>
                        <InputText
                            id="lng"
                            value={zone.long}
                            onChange={(e) => setZone({...zone, long: e.target.value})}
                            placeholder="Lng"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="zonePrice" className={'font-bold'}>Zone Price</label>
                        <InputNumber
                            id="zonePrice"
                            value={zone.zonePrice}
                            onChange={(e) => setZone({...zone, zonePrice: e.value})}
                            placeholder="Zone Price"
                            mode="currency"
                            currency="KWD"
                            locale="en-KW"
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
                <h1 className="text-2xl mb-5 uppercase">Zones List</h1>

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
                    value={zones}
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
                        field="zoneName"
                        header="Zone Name"
                        sortable
                        filter
                        filterPlaceholder="Search by Zone Name"
                    />
                    <Column
                        field="zonePrice"
                        header="Zone Price"
                        sortable
                        filter
                        filterPlaceholder="Search by Zone Price"
                        body={(rowData) => {
                            return (
                                <span>{rowData.zonePrice} KWD</span>
                            )
                        }}
                    />
                    <Column
                        field="_id"
                        header="Actions"
                        body={(rowData) => {
                            return (
                                <div className="flex gap-2">
                                    <button
                                        className="bg-danger text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                        onClick={() => {
                                            setSelectedZoneDelete({
                                                areaDialogDelete: true,
                                                zoneIdDelete: rowData._id,
                                            });
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            );
                        }}
                        style={{width: "10rem"}}
                    />
                </DataTable>
                <Dialog
                    header="Delete Zone"
                    visible={selectedZoneDelete?.areaDialogDelete}
                    style={{width: "90vw", maxWidth: "600px"}}
                    onHide={() => setSelectedZoneDelete({
                        areaDialogDelete: false,
                        areaId: ''
                    })}
                    footer={
                        (
                            <div>
                                <Button
                                    label="No"
                                    icon="pi pi-times"
                                    onClick={() => setSelectedZoneDelete({
                                        areaDialogDelete: false,
                                        areaId: ''
                                    })}
                                    className="p-button-text"/>
                                <Button
                                    icon="pi pi-check"
                                    onClick={() => deleteZoneHandler()}
                                    style={{
                                        background: deleteZoneLoader
                                            ? "#faacac"
                                            : "red",
                                    }}
                                    label={
                                        deleteZoneLoader ? (
                                            <ProgressSpinner
                                                strokeWidth="4"
                                                style={{
                                                    width: "1.5rem",
                                                    height: "1.5rem",
                                                }}
                                            />
                                        ) : (
                                            "Yes"
                                        )
                                    }/>
                            </div>
                        )
                    }>
                    <p className="m-0">
                        Are you sure you want to delete this Zone?
                    </p>
                </Dialog>
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
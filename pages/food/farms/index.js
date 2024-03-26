import React, {useEffect, useState} from 'react';

// AXIOS
import axios from 'axios';
// TOAST
import {toast} from 'react-hot-toast';

// COMPONENTS
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {InputText} from "primereact/inputtext";
// TEXT AREA
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import CustomFileInput from "@/components/CustomFileInput/CustomFileInput";
import Image from "next/image";


export default function Farms() {

    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [farms, setFarms] = useState([]);
    // STATES
    const [loading, setLoading] = useState(false);
    const [zones, setZones] = useState([]);
    const [farm, setFarm] = useState({
        farmName: '',
        location: '',
        category: '',
        files: [],
    })
    const [selectedFarmDelete, setSelectedFarmDelete] = useState({
        areaDialogDelete: false,
        farmIdDelete: "",
    });

    // STATES FOR LOADERS
    const [deleteFarmLoader, setDeleteFarmLoader] = useState(false);


    // SUBMIT HANDLER
    const submitHandler = (e) => {
        e.preventDefault();
        // VALIDATION
        if (!farm.farmName || !farm.zone || !farm.category) {
            toast.error('Please fill all the fields');
            return;
        }

        // GET THE TOKEN
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Please login first');
            return;
        }

        // CREATE FORM DATA
        const formData = new FormData();
        // APPEND THE DATA
        formData.append('farmName', farm.farmName);
        formData.append('foodZoneId', farm.zone);
        formData.append('category', farm.category);
        // APPEND THE FILES
        farm.files.forEach(file => {
            formData.append('files', file);
        });

        // SUBMIT
        setLoading(true);

        axios.post('https://api.lathaty.com/api/v1/create/farm', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then(_ => {
                setLoading(false);
                toast.success('Farm created successfully');
                // RESET THE STATE
                setFarm({
                    farmName: '',
                    location: '',
                    category: '',
                    files: [],
                })
                // GET FARMS
                getFarms();
            })
            .catch(_ => {
                setLoading(false);
                toast.error('Something went wrong while creating the farm');
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
                    const zones = res.data?.foodZones.map((zone) => {
                        return {
                            label: zone.zoneName,
                            value: zone._id,
                        };
                    });
                    setZones(zones)
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

    const getFarms = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET SHIFTS
        if (token) {
            axios
                .get(`https://api.lathaty.com/api/v1/admin/farms`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setFarms(res.data?.farms);
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
        getFarms();
        getZones();
    }, []);

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };


    // DELETE FARM
    function deleteFarmHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // CHECK IF THE ID IS VALID
        if (selectedFarmDelete.farmIdDelete === null) {
            toast.error("Please select a shift to delete");
            return;
        }

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setDeleteFarmLoader(true)
            axios
                .delete(`https://api.lathaty.com/api/v1/delete/farm`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        farmId: selectedFarmDelete.farmIdDelete,
                    }
                })
                .then(async (res) => {
                    toast.success(res.data.message);
                    // GET SHIFTS
                    await getFarms();
                    // CLOSE THE DIALOG
                    setSelectedFarmDelete({
                        areaDialogDelete: false,
                        farmIdDelete: "",
                    });
                    // CLOSE THE LOADER
                    setDeleteFarmLoader(false)
                })
                .catch((err) => {
                    setDeleteFarmLoader(false)
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
                    <h5 className="card-title uppercase">CREATE FARM / Shop</h5>
                </div>
                <form className={'p-fluid formgrid grid'} onSubmit={submitHandler}>

                    <div className="field col-12">
                        <label htmlFor="farmName" className={'font-bold'}>Farm / Shop Name</label>
                        <InputText
                            id="farmName"
                            value={farm.farmName}
                            onChange={(e) => setFarm({...farm, farmName: e.target.value})}
                            placeholder="Farm Name"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="zones" className={'font-bold'}>Zones</label>
                        <Dropdown
                            id="zones"
                            value={farm.zone}
                            onChange={(e) => setFarm({...farm, zone: e.target.value})}
                            placeholder="Select a Zone"
                            options={zones || []}
                            optionLabel="label"
                            filter
                            filterBy="label"
                            showClear
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="Category" className={'font-bold'}>Category</label>
                        <Dropdown
                            id="Category"
                            value={farm.category}
                            onChange={(e) => setFarm({...farm, category: e.target.value})}
                            placeholder="Select a Category"
                            options={[
                                {label: 'مزارع العبدلي', value: 'مزارع العبدلي'},
                                {label: 'مزارع الوفرة', value: 'مزارع الوفرة'},
                                {label: 'مطابخ وحلويات', value: 'مطابخ وحلويات'},
                                {label: 'عطور وبخور', value: 'عطور وبخور'},
                                {label: 'ملابس رجاليه', value: 'ملابس رجاليه'},
                                {label: 'ملابس نسائيه', value: 'ملابس نسائيه'},
                                {label: 'اكسسوارات', value: 'اكسسوارات'},
                                {label: 'قسم الاطفال', value: 'قسم الاطفال'},
                                {label: 'هدايا', value: 'هدايا'},
                            ]}
                            optionLabel="label"
                            filter
                            filterBy="label"
                            showClear
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="files">Files</label>
                        <CustomFileInput accept={'.jpg, .jpeg, .png, .gif'} handleImageChange={(files) => {
                            // SET THE FILES
                            setFarm({...farm, files: files})
                        }}/>
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
                <h1 className="text-2xl mb-5 uppercase">Farms / Shops List</h1>
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
                    value={farms}
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
                        field={"imageUrl"}
                        header="Image"
                        body={(rowData) => {
                            return (
                                <Image
                                    src={rowData?.imageUrl || '/not-found.png'}
                                    alt={rowData.farmName}
                                    width={40}
                                    height={40}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                            );
                        }}
                    />
                    <Column
                        field="farmName"
                        header="Farm / Shop Name"
                        sortable
                        filter
                        filterPlaceholder="Search by Farm Name"
                    />
                    <Column
                        field="foodZoneId.zoneName"
                        header="Zone"
                        sortable
                        filter
                        filterPlaceholder="Search by Zone"
                    />
                    <Column
                        field="category"
                        header="Category"
                        sortable
                        filter
                        filterPlaceholder="Search by Category"
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
                                            setSelectedFarmDelete({
                                                areaDialogDelete: true,
                                                farmIdDelete: rowData._id,
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
                    header="Delete Farm"
                    visible={selectedFarmDelete?.areaDialogDelete}
                    style={{width: "90vw", maxWidth: "600px"}}
                    onHide={() => setSelectedFarmDelete({
                        areaDialogDelete: false,
                        areaId: ''
                    })}
                    footer={
                        (
                            <div>
                                <Button
                                    label="No"
                                    icon="pi pi-times"
                                    onClick={() => setSelectedFarmDelete({
                                        areaDialogDelete: false,
                                        areaId: ''
                                    })}
                                    className="p-button-text"/>
                                <Button
                                    icon="pi pi-check"
                                    onClick={() => deleteFarmHandler()}
                                    style={{
                                        background: deleteFarmLoader
                                            ? "#faacac"
                                            : "red",
                                    }}
                                    label={
                                        deleteFarmLoader ? (
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
                        Are you sure you want to delete this Farm?
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
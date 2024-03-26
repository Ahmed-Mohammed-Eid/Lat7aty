import React, {useState, useEffect} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";

// AXIOS
import axios from "axios";

// TOAST
import {toast} from "react-hot-toast";

const ShiftsTable = () => {

    // STATES FOR LOADERS
    const [deleteAreaLoader, setDeleteAreaLoader] = useState(false);

    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [areas, setAreas] = useState([]);
    const [selectedAreaDelete, setSelectedAreaDelete] = useState({
        areaDialogDelete: false,
        areaIdDelete: "",
    });
    // STATE FOR LOADING ANOTHER PAGE OF DATA

    // FUNCTION TO GET THE SHIFTS
    const getAreas = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET SHIFTS
        if (token) {
            axios
                .get(`https://api.lathaty.com/api/v1/get/areas`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setAreas(res.data?.areas);
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

    // FETCH SHIFTS
    useEffect(() => {
        getAreas();
    }, []);

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };

    // DELETE SHIFT
    function deleteShiftHandler() {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // CHECK IF THE ID IS VALID
        if (selectedAreaDelete.shiftIdDelete === null) {
            toast.error("Please select a shift to delete");
            return;
        }

        // DELETE COURIER
        if (token) {
            // DELETE COURIER
            setDeleteAreaLoader(true)
            axios
                .delete(`https://api.lathaty.com/api/v1/delete/area`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        areaId: selectedAreaDelete?.areaIdDelete,
                    }
                })
                .then(async (res) => {
                    toast.success(res.data.message);
                    // GET SHIFTS
                    await getAreas();
                    // CLOSE THE DIALOG
                    setSelectedAreaDelete({
                        areaDialogDelete: false,
                        areaIdDelete: "",
                    });
                    // CLOSE THE LOADER
                    setDeleteAreaLoader(false)
                })
                .catch((err) => {
                    setDeleteAreaLoader(false)
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }


    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">Areas</h1>

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
                value={areas}
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
                    field="zoneName"
                    header="Zone Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Zone Name"
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
                                        setSelectedAreaDelete({
                                            areaDialogDelete: true,
                                            areaIdDelete: rowData._id,
                                        });
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog
                header="Delete Area"
                visible={selectedAreaDelete?.areaDialogDelete}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => setSelectedAreaDelete({
                    areaDialogDelete: false,
                    areaId: ''
                })}
                footer={
                    (
                        <div>
                            <Button
                                label="No"
                                icon="pi pi-times"
                                onClick={() => setSelectedAreaDelete({
                                    areaDialogDelete: false,
                                    areaId: ''
                                })}
                                className="p-button-text"/>
                            <Button
                                icon="pi pi-check"
                                onClick={() => deleteShiftHandler()}
                                style={{
                                    background: deleteAreaLoader
                                        ? "#faacac"
                                        : "red",
                                }}
                                label={
                                    deleteAreaLoader ? (
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
                    Are you sure you want to delete this Area?
                </p>
            </Dialog>
        </div>
    );
};
export default ShiftsTable;

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
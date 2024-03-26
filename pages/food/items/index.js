import React, {useState, useEffect} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
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
import {ColorPicker} from "primereact/colorpicker";

const ItemsTable = () => {
    // ROUTER
    const router = useRouter();
    // LOADERS
    const [deleteLoader, setDeleteLoader] = useState(false);

    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [globalFilter, setGlobalFilter] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [role, setRole] = useState(null);
    const [farmId, setFarmId] = useState(null);
    const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);

    // GLOBAL FILTER
    const onGlobalFilter = (e) => {
        setGlobalFilter(e.target.value);
    };

    // GET THE FOOD ITEMS HANDLER
    function getFoodItemsHandler(role, farmId) {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        let url = `https://api.lathaty.com/api/v1/farms/items`

        if (role === "farmer") {
            url = `https://api.lathaty.com/api/v1/farmer/items?farmId=${farmId}`
        }

        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                setFoodItems(res.data.items);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        // GET THE ROLE FROM LOCAL STORAGE
        const role = localStorage.getItem("role");
        // GET farmId FROM LOCAL STORAGE
        const farmId = localStorage.getItem("farmId");

        if (role === "farmer") {
            setRole(role);
            setFarmId(farmId);
            getFoodItemsHandler(role, farmId);
        } else {
            getFoodItemsHandler();
        }
    }, [])

    // DELETE FOOD ITEMS HANDLER
    function deleteFoodItemHandler(item) {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // SET THE DELETE LOADER TO TRUE
        setDeleteLoader(true);

        let url = `https://api.lathaty.com/api/v1/delete/item`

        if (role === "farmer") {
            url = `https://api.lathaty.com/api/v1/delete/farmer/item`
        }

        // DELETE THE ITEM
        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                itemId: item._id,
            }
        })
            .then((_) => {
                // SET THE DELETE LOADER TO FALSE
                setDeleteLoader(false);

                // SHOW THE SUCCESS TOAST
                toast.success("Item deleted successfully");

                // GET THE FOOD ITEMS AGAIN
                if (role === "farmer") {
                    getFoodItemsHandler(role, farmId);
                } else {
                    getFoodItemsHandler();
                }

                // CLOSE THE DIALOG
                setSelectedItemToDelete(null);
            })
            .catch((_) => {
                // SET THE DELETE LOADER TO FALSE
                setDeleteLoader(false);

                // SHOW THE ERROR TOAST
                toast.error("Something went wrong while deleting the item");

                // CLOSE THE DIALOG
                setSelectedItemToDelete(null);
            });
    }

    return (
        <div className="card">
            <h1 className="text-2xl mb-5 uppercase">ITEMS</h1>

            <div className="mb-3 w-full" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText
                        placeholder="Search"
                        value={globalFilter || ""}
                        onChange={onGlobalFilter}
                        className="p-inputtext p-component"
                    />
                </span>
                {/*  BUTTON TO LOAD MORE  */}
            </div>
            <DataTable
                value={foodItems}
                paginator
                first={page}
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
                    field="itemImage"
                    header="Item Image"
                    sortable
                    filter
                    filterPlaceholder="Search by Item Image"
                    body={(rowData) => {
                        return (
                            <Image
                                src={rowData.itemImage}
                                alt={rowData.itemName}
                                width={50}
                                height={50}
                                style={{
                                    borderRadius: "50%",
                                    border: "1px solid #ccc",
                                }}
                            />
                        );
                    }}
                />

                <Column
                    field="itemName"
                    header="Item Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Item Name"
                />

                <Column
                    field="itemPrice"
                    header="Item Price"
                    sortable
                    filter
                    filterPlaceholder="Search by Item Price"
                    body={(rowData) => {
                        return <span style={{fontWeight: 'bold'}}>{rowData.itemPrice} KWD</span>
                    }}
                />

                <Column
                    field="pricingSystem"
                    header="Pricing System"
                    sortable
                    filter
                    filterPlaceholder="Search by Pricing System"
                    body={(rowData) => {
                        return <span>{rowData.pricingSystem}</span>
                    }}
                />

                <Column
                    field="itemBlocked"
                    header="Blocked"
                    sortable
                    filter
                    filterPlaceholder="Search by Blocked"
                    body={(rowData) => {
                        return <span
                            className={`px-2 py-1 rounded-md text-white ${rowData.itemBlocked ? "bg-danger" : "bg-success"}`}
                        >{rowData.itemBlocked ? "Yes" : "No"}</span>
                    }}
                />

                {role !== "farmer" && (<Column
                    field="farmId.farmName"
                    header="Business Name"
                    sortable
                    filter
                    filterPlaceholder="Search by Farm Name"
                />)}

                <Column
                    field="sizes"
                    header="Sizes"
                    body={(rowData) => {
                        return (
                            <div className="flex gap-2">
                                {rowData.sizes.map((size, index) => {
                                    return (
                                        <span
                                            key={`${size}-${index}`}
                                            className="px-2 py-1 rounded-md text-white bg-primary"
                                        >
                                            {size}
                                        </span>
                                    );
                                })}
                            </div>
                        );
                    }}
                />

                <Column
                    field="colors"
                    header="Colors"
                    body={(rowData) => {
                        return (
                            <div className="flex gap-2">
                                {rowData.colors.map((color, index) => {
                                    return (
                                        <ColorPicker
                                            key={`${color}-${index}`}
                                            disabled={true}
                                            value={color}
                                            readOnly
                                            style={{
                                                width: "2rem",
                                                height: "2rem",
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        );
                    }}
                />

                <Column
                    field="_id"
                    header="Actions"
                    body={(rowData) => {
                        return (
                            <div className="flex gap-2">
                                <button
                                    className="bg-edit text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        router.push(`/food/items/edit/${rowData._id}`);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-danger text-white px-3 py-1 rounded-md pointer border-none custom-button"
                                    onClick={() => {
                                        setSelectedItemToDelete(rowData)
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
                header="Delete Item"
                visible={selectedItemToDelete}
                style={{width: "90vw", maxWidth: "600px"}}
                onHide={() => setSelectedItemToDelete(null)}
                footer={
                    (
                        <div>
                            <Button
                                label="No"
                                icon="pi pi-times"
                                onClick={() => setSelectedItemToDelete(null)}
                                className="p-button-text"/>
                            <Button
                                icon="pi pi-check"
                                onClick={() => deleteFoodItemHandler(selectedItemToDelete)}
                                style={{
                                    background: deleteLoader
                                        ? "#faacac"
                                        : "red",
                                }}
                                label={
                                    deleteLoader ? (
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
                    Are you sure you want to delete this Item?
                </p>
            </Dialog>
        </div>
    );
};
export default ItemsTable;

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
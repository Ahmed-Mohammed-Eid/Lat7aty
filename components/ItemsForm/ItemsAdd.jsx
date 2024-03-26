import React, {useState, useEffect} from "react";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Dropdown} from "primereact/dropdown";
import {Checkbox} from "primereact/checkbox";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
// NOTIFICATION
import {toast} from "react-hot-toast";
// AXIOS
import axios from "axios";
// FILE UPLOADER
import CustomFileInput from "@/components/CustomFileInput/CustomFileInput";
import ItemOptions from "@/components/ItemOptions/ItemOptions";
import ItemSizes from "@/components/ItemSizes/ItemSizes";


const ItemForm = () => {
    // STATES
    const [loading, setLoading] = useState(false);
    const [farms, setFarms] = useState([]);
    const [role, setRole] = useState('');
    const [item, setItem] = useState({
        itemName: "",
        pricingSystem: "",
        itemPrice: "",
        files: [],
        sizes: [],
        colors: [],
        farmId: "",
        itemBlocked: false,
    });

    // SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault();
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // Process form submission or validation here
        if (!item.itemName || !item.pricingSystem || !item.itemPrice || !item.farmId) {
            toast.error("Please fill all the fields!");
            return;
        }

        // Create FormData object
        const formData = new FormData();
        // Append data to FormData object
        formData.append("itemName", item.itemName);
        formData.append("pricingSystem", item.pricingSystem);
        formData.append("itemPrice", item.itemPrice);
        formData.append("farmId", item.farmId);
        formData.append("itemBlocked", item.itemBlocked);

        // LOOP THROUGH THE COLORS
        for (let i = 0; i < item.colors.length; i++) {
            formData.append("colors", item.colors[i]);
        }

        // LOOP THROUGH THE SIZES
        for (let i = 0; i < item.sizes.length; i++) {
            formData.append("sizes", item.sizes[i]);
        }


        // Append files to FormData object
        for (let i = 0; i < item.files.length; i++) {
            formData.append("files", item.files[i]);
        }

        // set the loading to true
        setLoading(true);

        let url = "https://api.lathaty.com/api/v1/create/farm/item";

        if (role === 'farmer') {
            url = "https://api.lathaty.com/api/v1/create/farmer/item";
        }

        // Send the form data to the server
        axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                console.log(res)
                // set the loading to false
                setLoading(false);
                // show success message
                toast.success(res.data.message);
                // reset the form
                setItem({
                    itemName: "",
                    pricingSystem: "",
                    itemPrice: "",
                    files: [],
                    farmId: "",
                    itemBlocked: false,
                });
            })
            .catch((err) => {
                console.log(err.response);
                // set the loading to false
                setLoading(false);
                // show error message
                toast.error(err.response.data.message);
            });
    };

    // EFFECT TO GET THE FARMS
    useEffect(() => {
        // GET THE  ROLE FROM THE LOCAL STORAGE
        const role = localStorage.getItem("role");
        // GET THE farmId FROM THE LOCAL STORAGE
        const farmId = localStorage.getItem("farmId");
        if (role === "farmer" && farmId) {
            setRole(role);
            setItem({
                ...item,
                farmId: farmId,
            });
        } else {
            getFarms();
        }
    }, []);

    // HANDLER TO GET THE FARMS
    const getFarms = () => {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");
        // set the loading to true
        // Send the form data to the server
        axios.get("https://api.lathaty.com/api/v1/admin/farms", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                const farms = res.data.farms.map((farm) => {
                    return {
                        label: farm.farmName,
                        value: farm._id,
                    };
                });
                // SET THE FARMS
                setFarms(farms);
            })
            .catch((err) => {
                // show error message
                toast.error(err.response?.data?.message);
            });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="card">
                    <h1 className="text-2xl mb-5 uppercase">Create Item</h1>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="item-name">Item Name</label>
                            <InputText
                                id="item-name"
                                value={item.itemName}
                                onChange={(e) =>
                                    setItem({
                                        ...item,
                                        itemName: e.target.value,
                                    })
                                }
                                placeholder="Item Name"
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="item-price">Item Price</label>
                            <InputNumber
                                id="item-price"
                                value={item.itemPrice}
                                onChange={(e) => {
                                    setItem({
                                        ...item,
                                        itemPrice: e.value,
                                    });
                                }}
                                placeholder="Item Price"
                                // CURRENCY
                                mode="currency"
                                currency="kwd"
                                locale="en-KW"
                                currencyDisplay="symbol"
                            />
                        </div>

                        <div className={`field col-12 ${role === "farmer" ? 'md:col-12' : 'md:col-6'}`}>
                            <label htmlFor="pricingSystem">Pricing System</label>
                            <Dropdown
                                id="pricingSystem"
                                value={item.pricingSystem}
                                onChange={(e) => {
                                    setItem({
                                        ...item,
                                        pricingSystem: e.target.value,
                                    });
                                }}
                                placeholder="Pricing System"
                                options={[
                                    {label: "Per KG", value: "Per KG"},
                                    {label: "Per Item", value: "Per Item"},
                                ]}
                            />
                        </div>

                        {(role !== 'farmer') && (<div className="field col-12 md:col-6">
                            <label htmlFor="farmId">Business Name</label>
                            <Dropdown
                                id="farmId"
                                value={item.farmId}
                                onChange={(e) => {
                                    setItem({
                                        ...item,
                                        farmId: e.target.value,
                                    });
                                }}
                                placeholder="Business Name"
                                options={farms || []}
                            />
                        </div>)}

                        <div className="field col-12">
                            <label htmlFor="files">Files</label>
                            <CustomFileInput accept={'.jpg, .jpeg, .png, .gif'} handleImageChange={(files) => {
                                // SET THE FILES
                                setItem({...item, files: files})
                            }}/>
                        </div>

                        <div className="field col-12 md:col-6 flex items-center gap-2">
                            <Checkbox
                                inputId="itemBlocked"
                                checked={item.itemBlocked}
                                onChange={(e) =>
                                    setItem({...item, itemBlocked: e.checked})
                                }
                            />
                            <label htmlFor="itemBlocked">Item Blocked</label>
                        </div>
                    </div>
                </div>

                <ItemOptions sendColors={(colorsArray) => {
                    setItem({
                        ...item,
                        colors: colorsArray
                    })
                }}/>

                <ItemSizes sendSizes={(sizesArray) => {
                    setItem({
                        ...item,
                        sizes: sizesArray
                    })
                }}/>

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
            </form>
        </>
    );
};

export default ItemForm;

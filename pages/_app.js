import React from "react";

import {LayoutProvider} from "@/layout/context/layoutcontext";
import Layout from "../layout/layout";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../styles/layout/layout.scss";

import "../styles/globals.css";
// TOAST
import {Toaster} from "react-hot-toast";
// SOCKET
import {initIo} from "@/Helpers/socket";
// PROGRESS BAR
import NextNProgress from 'nextjs-progressbar';


export default function MyApp({Component, pageProps}) {

    React.useEffect(() => {
        initIo();
    }, []);

    if (Component.getLayout) {
        return (
            <LayoutProvider>
                <NextNProgress color={`#191843`}/>
                {Component.getLayout(<Component {...pageProps} />)}
                <Toaster position="bottom-right" reverseOrder={false}/>
            </LayoutProvider>
        );
    } else {
        return (
            <LayoutProvider>
                <Layout>
                    <NextNProgress color={`#191843`}/>
                    <Component {...pageProps} />
                    <Toaster position="bottom-right" reverseOrder={false}/>
                </Layout>
            </LayoutProvider>
        );
    }
}

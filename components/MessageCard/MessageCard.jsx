import React from 'react';
import {Card} from 'primereact/card';
import Link from "next/link";

export default function MessageCard({Name, subject, message, email, date}) {
    return (
        <div className="grid p-2">
            <Card title={subject} className={'col-12'}>
                <p className="m-0 mb-4 text-lg">
                    {message}
                </p>
                <div className="flex justify-content-start align-items-start gap-2 flex-column">
                    <p className="m-0 uppercase">
                        <span className={"font-bold"}>Name:</span> {Name}
                    </p>
                    <p className="m-0 uppercase">
                        {/*  SEND EMAIL  */}
                        <span className={"font-bold"}>EMAIL:</span> <Link href={`mailto:${email}`}> {email} </Link>
                    </p>
                    <p className="m-0 uppercase">
                        <span className={"font-bold"}>Date:</span> {date}
                    </p>
                </div>
            </Card>
        </div>
    )
}

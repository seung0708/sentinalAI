import { DataTable } from "@/app/components/users/DataTable";

import data from '@/app/(users)/dashboard/data.json'

export default function Transactions() {
    return (
        <DataTable data={data} />
    )
}
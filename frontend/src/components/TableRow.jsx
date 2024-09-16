import {formatDate, isValidUrl} from "../utils/index.js";


const TableRow = ({ row }) => {

    return (
        <tr className={row["Status"] === "Failed" ? "failed" : ""}>
            {Object.entries(row).map(([key, val], index) => (
                <td key={index}>
                    {key === "Applied At" ? (
                        formatDate(val)
                    ) : isValidUrl(val) ? (
                        <a href={val} target="_blank" rel="noopener noreferrer">Open Link</a>
                    ) : (
                        val
                    )}
                </td>
            ))}
        </tr>
    );
};

export default TableRow;
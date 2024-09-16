
const TableHeader = ({ headers }) => {
    return (
        <thead>
        <tr>
            {headers.map((header, index) => (
                <th key={index}>{header}</th>
            ))}
        </tr>
        </thead>
    );
};

export default TableHeader;

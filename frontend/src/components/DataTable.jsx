import TableHeader from "./TableHeader.jsx";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import TableRow from "./TableRow.jsx";
import {useContext} from "react";
import JobsContext from "../context/JobsContext.jsx";
import Pagination from "./Pagination.jsx";
import SearchFilters from "./SearchFilters.jsx";

export default function DataTable() {

    const {jobs, headers} = useContext(JobsContext);

    return (
        <>
            <SearchFilters/>
            <Pagination/>
            <table className="table-container">
                <TableHeader headers={headers}/>
                <tbody>
                <TransitionGroup component={null}>
                    {jobs.map((row, index) => (
                        <CSSTransition
                            key={index}
                            timeout={500}
                            classNames="fade">
                            <TableRow row={row}/>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
                </tbody>
            </table>
            <Pagination/>
        </>
    );
}
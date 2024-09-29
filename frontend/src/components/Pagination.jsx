import {useContext} from "react";
import JobsContext from "../context/JobsContext.jsx";

const Pagination = () => {
    const {
        pageRange,
        totalPages,
        currentPage,
        goToPage,
        toNextPageRange,
        toPrevPageRange
    } = useContext(JobsContext);

    const pageNumbers = [];


    for (let i = pageRange.start; i <= Math.min(pageRange.end, totalPages); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageRange.start > 1 && (
                    <li className="page-item">
                        <button onClick={toPrevPageRange} className="page-link">
                            &laquo;
                        </button>
                    </li>
                )}
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => goToPage(number)} href="#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
                {pageRange.end < totalPages && (
                    <li className="page-item">
                        <button onClick={toNextPageRange} className="page-link">
                            &raquo;
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;

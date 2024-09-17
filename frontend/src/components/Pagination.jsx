import PropTypes from 'prop-types';

const Pagination = ({ jobsPerPage, totalJobs, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalJobs / jobsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} href="#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

Pagination.propTypes = {
    jobsPerPage: PropTypes.number.isRequired,
    totalJobs: PropTypes.number.isRequired,
    paginate: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
};

export default Pagination;

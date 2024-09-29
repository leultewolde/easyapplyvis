import JobTrendsChart from "./JobTrendsChart.jsx";
import Modal from "./Modal.jsx";
import PropTypes from "prop-types";

export default function ChartModal({showModal, setShowModal}) {

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
            <JobTrendsChart/>
        </Modal>
    );
}

ChartModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    setShowModal: PropTypes.func.isRequired
}
import './styles/App.scss';
import DataTable from "./components/DataTable.jsx";
import JobStats from "./components/JobStats.jsx";
import {JobsProvider} from "./context/JobsContext.jsx";

function App() {

    return (
        <JobsProvider>
            <JobStats/>
            <DataTable/>
        </JobsProvider>
    )
}

export default App

import { EthProvider } from './contexts/EthContext';
import PageMain from './pages/PageMain';

function App() {
    return (
        <EthProvider>
            <div id='App'>
                <PageMain />
            </div>
        </EthProvider>
    );
}

export default App;

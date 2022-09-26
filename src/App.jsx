import BHdulich from './components/BHdulich';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Error from './components/Error';
import BHoto from './components/BHoto';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Navbar />

			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/dulich'
					element={<BHdulich />}
				/>
				<Route
					path='/oto'
					element={<BHoto />}
				/>
				<Route
					path='*'
					element={<Error />}
				/>
			</Routes>
		</Router>
	);
}

export default App;

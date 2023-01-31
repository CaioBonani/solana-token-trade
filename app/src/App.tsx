import './App.css';
import MintToken from './MintToken';

/*
import MintNft from './MintNft';
import SendSol from './SendSol';
*/

import Enderecos from './Enderecos';

function App() {
	return (
		<div className="App">
		<header className="App-header">
			<Enderecos />

			<div>
				<h1></h1>
			</div>
			
			<MintToken />
			{/* <MintNft /> */}
			{/* <SendSol /> */}
		</header>
		</div>
	);
}

export default App;

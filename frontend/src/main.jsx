import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<Toaster 
				position="bottom-right" 
				reverseOrder={false} 
				toastOptions={{
					style: {
						fontSize: '20px',
						padding: '16px',
						minWidth: '320px',
						duration: 5000,
						zIndex: 999999
					}
				}}
			/>
			<App />
		</BrowserRouter>
	</StrictMode>,
)
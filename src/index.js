import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App/App'
import 'bootstrap/dist/css/bootstrap.min.css'
import dotenv from 'dotenv'
import 'react-datepicker/dist/react-datepicker.css'

dotenv.config()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

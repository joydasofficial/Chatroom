import '../styles/globals.css'
import { Context } from '../src/SocketContext'

export default function App({ Component, pageProps }) {
  return (
    <Context>
      <Component {...pageProps} />
    </Context>
  )
}

import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { makeServer } from '../services/mirage'

if (process.env.NODE_ENV === "development") {
  makeServer({ environment: "development" })
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp

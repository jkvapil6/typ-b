import { GRAPHQL_API } from '@/core/config'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'tailwindcss/tailwind.css'
import 'antd/dist/antd.css'
// dark mode 
// import 'antd/dist/antd.dark.css'

import '../styles/index.css'

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  uri: GRAPHQL_API,
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp

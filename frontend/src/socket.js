import {io} from 'socket.io-client'

// const URL="http://localhost:5000"
const URL=`https://${process.env.REACT_APP_BACK_END_ROOT}`

export const socket=io(URL);
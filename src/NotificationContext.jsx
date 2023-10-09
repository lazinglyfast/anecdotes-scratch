import { createContext, useReducer, useContext } from "react"

const NotificationContext = createContext()

const notificationsReducer = (_state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload
    default:
    case "CLEAR":
      return ""
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationsReducer)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export const notify = (dispatch, payload) => {
  dispatch({ type: "SET", payload })
  setTimeout(() => {
    dispatch({ type: "CLEAR" })
  }, 5000)
}

export default NotificationContext

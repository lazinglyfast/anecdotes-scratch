import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAnecdotes, createAnecdote, updateAnecdote } from "./requests"
import { useNotificationValue, useNotificationDispatch, notify } from "./NotificationContext"

const Notification = () => {
  const notification = useNotificationValue()
  if (!notification) {
    return
  }

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

const App = () => {
  const dispatchNotification = useNotificationDispatch()

  const client = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = client.getQueryData(["anecdotes"])
      client.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote))
      const payload = `created anecdote ${newAnecdote.content}`
      notify(dispatchNotification, payload)
    }
  })

  const voteForAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = client
        .getQueryData(["anecdotes"])
        .map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a)
      client.setQueryData(["anecdotes"], anecdotes)
      const payload = `voted for anecdote ${updatedAnecdote.content}`
      notify(dispatchNotification, payload)
    }
  })

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: false,
  })

  if (result.isLoading) {
    return <span>Loading...</span>
  }

  if (result.isError) {
    return <span>anecdote service not available due to problems in server</span>
  }

  const anecdotes = result.data

  const onSubmit = (e) => {
    e.preventDefault()
    const content = e.target.content.value
    e.target.content.value = ""
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  const onClick = (anecdote) => {
    voteForAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  return (
    <div>
      <Notification />
      <form onSubmit={onSubmit}>
        <input type="text" name="content" />
        <button type="submit">add</button>
      </form>
      {anecdotes.map(a => (
        <div key={a.id}>
          {`${a.content} has ${a.votes} `}
          <button type="button" onClick={() => onClick(a)}>vote</button>
        </div>
      ))}
    </div>
  )
}

export default App

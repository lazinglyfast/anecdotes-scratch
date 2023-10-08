import { useQuery } from "@tanstack/react-query"
import { getAnecdotes } from "./requests"

const App = () => {

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: false,
  })

  console.log(result)

  if (result.isLoading) {
    return <span>Loading...</span>
  }

  if (result.isError) {
    return <span>Error: {result.error.message}</span>
  }

  const anecdotes = result.data

  return (
    <div>
      {anecdotes.map(a => (
        <div key={a.id}>
          {`${a.content} has ${a.votes} `}
          <button type="button">vote</button>
        </div>
      ))}
    </div>
  )
}

export default App

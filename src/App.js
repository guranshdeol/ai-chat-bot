import { useState } from "react"


const App = () => {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(null)

  const surpriseOptions = [
    'Who is known as the missile man of india?',
    'Which community is the bravest in the world?',
    'Who are You?',
    'Who won the latest Nobel Peace Prize?'
  ]
  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!")
      return
    }
    try {
      const options = {
        method : 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type' : 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      console.log(data)
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value
      },
        {
          role: "model",
          parts: data
        }
    ])

    setValue("")
      
    }catch (error) {
      console.error(error)
      setError("Something went wrong! Please try again Later...")
    }

    
  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }

  const login = () => {
    const token = Math.random().toString(36).substring(7)
    localStorage.setItem('token', token)
    setToken(token)
    setIsLoggedIn(true)
  }
  
  return (
    <div className="app">
      {isLoggedIn ? (
        <>
        <p>Your Token: {token}</p>
          <p>
            What do you want to know?
            <button className="surprise" onClick={surprise} disabled={!chatHistory.length}>Surprise Me!</button>
          </p>
          <div className="input-container">
            <input
              value={value}
              placeholder="Who are You?"
              onChange={(e) => setValue(e.target.value)}
            />
            {!error && <button onClick={getResponse}>Ask Me</button>}
            {error &&<button onClick={clear}>Clear</button>}
          </div>
          {error && <p>{error}</p>}
          <div className="Search-result">
            {chatHistory.map((chatItem, _index) => <div key={chatItem.id || _index}>
              <p className="answer">{chatItem.role} : {chatItem.parts}</p>
            </div>)}
          </div>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  )
}

export default App

'use client'
import './hangman.css'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import { blockchainWordList } from './wordList'
export default function Home() {
  // const [inputVal, setInputVal] = useState('')
  // const { push } = useRouter()

  // const handleSubmit = (event: FormEvent) => {
  //   event.preventDefault()
  //   push(`/prediction/${inputVal}`)
  // }

  const [word, setWord] = useState([])
  const [hint, setHint] = useState('')
  const [currentWord, setCurrentWord] = useState('a')
  const [wrongGuessCount, setWrongGuessCount] = useState(0)
  const [maxGuesses, setMaxGuesses] = useState(6)
  const [revealedLetters, setRevealedLetters] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [correctLetters, setCorrectLetters] = useState([])
  const [isVictory, setIsVictory] = useState(false)

  const getRandomWord = () => {
    const { word, hint } =
      blockchainWordList[Math.floor(Math.random() * blockchainWordList.length)]
    setHint(hint)
    setCurrentWord(word)
    console.log('The word: ', word)
    const wordyWord = word
      .split('') // Split the word into individual characters
      .map((char, index) => <li key={index} className="letter"></li>)
    setRevealedLetters(Array(wordyWord.length).fill(''))
  }

  const handleButtonClick = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
      // Update the revealed letters state
      let cpyCorrectLetters = [...correctLetters]

      const updatedRevealedLetters = revealedLetters.map((char, index) => {
        const currentCorrectLetter =
          currentWord[index] === clickedLetter && clickedLetter
        if (currentCorrectLetter) {
          setCorrectLetters((prevCorrectLetters) => {
            const updatedCorrectLetters = [
              ...prevCorrectLetters,
              currentCorrectLetter,
            ]
            return updatedCorrectLetters
          })
        }
        return currentWord[index] === clickedLetter ? clickedLetter : char
      })

      setRevealedLetters(updatedRevealedLetters)
    } else {
      setWrongGuessCount((prevCount) => {
        return prevCount + 1
      })
    }
    button.disabled = true
  }
  // if (wrongGuessCount === maxGuesses) setGameOver(true)
  // if (correctLetters.length === currentWord.length) {
  //   setIsVictory(true)
  // }

  const refreshPage = () => {
    window.location.reload()
  }
  console.log('Wrong guess count: ', wrongGuessCount)
  console.log('correct letters length: ', correctLetters.length)
  console.log('The current word length: ', currentWord.length)
  useEffect(() => {
    getRandomWord()
  }, [])

  return (
    <div>
      {wrongGuessCount === maxGuesses ||
      correctLetters.length === currentWord.length ? (
        <div className="game-modal fixed bg-opacity-60 bg-black left-0 top- w-[100%] h-[100%]  flex items-center justify-center -mt-40 z-10 pointer-events-auto">
          <div className="content bg-white max-w-[420px] w-[420px] text-center rounded-lg p-8">
            <img
              src={`images/${
                correctLetters.length === currentWord.length
                  ? 'victory.gif'
                  : 'lost.gif'
              }`}
              alt="gif"
              className="max-w-32 mb-5 mx-auto"
            />
            {correctLetters.length === currentWord.length ? (
              <h4 className="text-2xl">You win!</h4>
            ) : (
              <div>
                <h4 className="text-2xl">Game Over!</h4>
                <p className="text-lg">
                  The correct word was: <b>{currentWord}</b>
                </p>
              </div>
            )}
            <button className="play-again py-3 px-6" onClick={refreshPage}>
              Play Again
            </button>
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="w-[1000px] bg-white flex py-14 px-10 rounded-xl gap-16 items-end">
        <div>
          <img
            src={`images/hangman-${wrongGuessCount}.svg`}
            alt="hangman-img"
            className="max-w-72"
          />
          <h1 className="text-2xl mt-5 text-center uppercase">Hangman Game</h1>
        </div>
        <div className="game-box">
          <ul className="word-display flex list-none gap-3 items-center justify-center">
            {revealedLetters.map((char, index) => (
              <li key={index} className={`letter ${char ? 'guessed' : ''}`}>
                {char || ''}
              </li>
            ))}
          </ul>
          <h4 className="hint-text">
            Hint:
            <b>{hint}</b>
          </h4>
          <h4 className="guesses-text text-red-600">
            Incorrect guesses:
            <b>
              {wrongGuessCount}/{maxGuesses}
            </b>
          </h4>
          <div className="keyboard flex gap-1 flex-wrap justify-center mt-10">
            {Array.from({ length: 26 }, (_, i) => {
              const letter = String.fromCharCode(97 + i) // Generate letters 'a' to 'z'
              return (
                <button
                  key={letter}
                  onClick={(e) => handleButtonClick(e.target, letter)}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

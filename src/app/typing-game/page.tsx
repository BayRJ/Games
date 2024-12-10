'use client'

import './typing-game.css'
import { paragraphs } from './paragraphs'
import { useEffect, useRef, useState } from 'react'

export default function TypingGame() {
  const [typingText, setTypingText] = useState([])
  const [userInput, setUserInput] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [cpyUserInput, setCpyUserInput] = useState('')
  const [time, setTime] = useState(60)
  const [isTyping, setIsTyping] = useState(false)
  const [cpm, setCPM] = useState(0)
  const [wpm, setWPM] = useState(0)
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  function randomParagraph() {
    let randIndex = Math.floor(Math.random() * paragraphs.length)
    let cpyTypingText = []
    paragraphs[randIndex].split('').forEach((span, index) => {
      let spanTag = <span key={index}>{span}</span>
      cpyTypingText.push(spanTag)
    })

    setTypingText(cpyTypingText)
  }

  function initTyping() {
    const cpyTypingText = [...typingText]
    const charactersLetters = typingText.map((char) => char.props.children)
    let typedChar = userInput.split('')[charIndex]

    if (charIndex < charactersLetters.length - 1 && time > 0) {
      if (!isTyping && userInput) {
        setIsTyping(true)
        if (!timerRef.current) {
          timerRef.current = setInterval(() => {
            setTime((prevTime) => {
              if (prevTime <= 1) {
                clearInterval(timerRef.current)
                timerRef.current = null
                setIsTyping(false)
                return 0
              }
              return prevTime - 1
            })
          }, 1000)
        }
      }

      console.log('this the typedChar: ', typedChar)
      console.log('this the charIndex: ', charIndex)
      console.log('this the userInput: ', userInput)
      if (typedChar == null && typingText.length > 0 && userInput) {
        if (
          charactersLetters[charIndex - 1] !==
            cpyUserInput.charAt(charIndex - 1) &&
          userInput
        ) {
          setMistakes(mistakes - 1)
        }
        if (
          charactersLetters[charIndex - 1] ===
          cpyUserInput.charAt(charIndex - 1)
        ) {
          setCPM(charIndex - 1 - mistakes)
        }
        setCharIndex(charIndex - 1)
        cpyTypingText[charIndex] = (
          <span key={charIndex}>{charactersLetters[charIndex]}</span>
        )

        cpyTypingText[charIndex - 1] = (
          <span key={charIndex - 1} className="active">
            {charactersLetters[charIndex - 1]}
          </span>
        )
        setTypingText(cpyTypingText)
        return
      } else {
        if (charactersLetters[charIndex] === typedChar) {
          cpyTypingText[charIndex] = (
            <span key={charIndex} className="correct">
              {charactersLetters[charIndex]}
            </span>
          )
          setCPM(charIndex + 1 - mistakes)
        } else if (charactersLetters[charIndex] !== typedChar && userInput) {
          setMistakes(mistakes + 1)
          cpyTypingText[charIndex] = (
            <span key={charIndex} className="incorrect">
              {charactersLetters[charIndex]}
            </span>
          )
        }
      }

      if (typingText && typingText.length > 0) {
        setCharIndex(charIndex + 1)
        cpyTypingText[charIndex + 1] = (
          <span key={charIndex + 1} className="active">
            {charactersLetters[charIndex + 1]}
          </span>
        )
        let cpyWPM = Math.round(((charIndex - mistakes) / 5 / (60 - time)) * 60)
        setTypingText(cpyTypingText)
        setCpyUserInput(userInput)

        setWPM(cpyWPM < 0 || !cpyWPM || cpyWPM === Infinity ? 0 : cpyWPM)
      }
    } else {
      setUserInput('')
    }
  }

  function resetGame() {
    randomParagraph()
    setTime(60)
    setUserInput('')
    setCharIndex(0)
    setMistakes(0)
    setCPM(0)
    setWPM(0)
    setIsTyping(false)
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  useEffect(() => {
    randomParagraph()
    const handleKeyDown = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    initTyping()
  }, [userInput])

  console.log('This is the time: ', time)

  return (
    <div className="wrapper w-[770px] p-9 bg-white rounded-xl">
      <input
        type="text"
        className="input-field absolute -z-10 opacity-0"
        ref={inputRef}
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value)
        }}
      />
      <div className="content-box rounded-xl">
        <div className="typing-text max-h-[255px] overflow-y-auto">
          <p className="text-xl text-justify" key={1}>
            {typingText}
          </p>
        </div>
        <div className="content flex justify-between py-3 px-0 items-center">
          <ul className="result-details flex justify-between ">
            <li className="time">
              <p>Time Left:</p>
              <span>
                <b className="font-medium">{time}</b>s
              </span>
            </li>
            <li className="mistake">
              <p>Mistakes:</p>
              <span>{mistakes}</span>
            </li>
            <li className="wpm">
              <p>WPM:</p>
              <span>{wpm}</span>
            </li>
            <li className="cpm">
              <p>CPM:</p>
              <span>{cpm}</span>
            </li>
          </ul>
          <button
            className="border-none outline-none w-[105px] bg-sky-500 py-2 px-0 cursor-pointer text-base rounded-md text-white"
            onClick={resetGame}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

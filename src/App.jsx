import { aleatorio } from './aleatorio'
import React, { useEffect, useState } from 'react'
import { Parejas } from './parejas'
import { Celdas } from './Celdas'
import conffeti from 'canvas-confetti'

const comprobarWinner = (array) => {
  const respuesta = array.every((e) => {
    return e.fijo === true
  })
  return respuesta
}
export function App () {
  const [celdas, setCeldas] = useState(() => {
    const arrayAleatorio = aleatorio(30)
    const nuevaCeldas = Array(30).fill({ emoji: null, visible: false, fijo: false, indice: null, animacion: false })

    let contador = 0
    for (const pareja in Parejas) {
      const emoji = Parejas[pareja]
      nuevaCeldas[arrayAleatorio[contador]] = { emoji, visible: false, fijo: false, indice: null, animacion: false }
      contador++
      nuevaCeldas[arrayAleatorio[contador]] = { emoji, visible: false, fijo: false, indice: null, animacion: false }
      contador++
    }
    const tablero = window.localStorage.getItem('tablero')
    return tablero ? JSON.parse(tablero) : nuevaCeldas
  })
  const [tiempo, setTiempo] = useState(() => {
    const tiempo = window.localStorage.getItem('tiempo')
    return tiempo ? JSON.parse(tiempo) : 0
  })
  const [winner, setWinner] = useState(() => {
    const winner = window.localStorage.getItem('winner')
    return winner ? JSON.parse(winner) : false
  })
  const [tiempoConseguido, setTiempoConseguido] = useState(() => {
    const record = window.localStorage.getItem('tiempoRecord')
    return record ? JSON.parse(record) : 0
  })
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTiempo((prevTiempo) => {
        const aumento = prevTiempo + 1
        window.localStorage.setItem('tiempo', JSON.stringify(aumento))
        return aumento
      })
    }, 1000)
    return () => clearInterval(intervalId)
  }, [tiempo])
  const actualizarCelda = (index) => {
    const newArray = [...celdas]
    newArray[index] = { ...newArray[index], visible: true, indice: index }
    setTimeout(() => {
      setCeldas(newArray)
    }, 150)
    setTimeout(() => {
      const arrayPares = newArray.filter((celda) => {
        return celda.visible && !celda.fijo
      })
      if (arrayPares.length === 2) {
        const emoji1 = arrayPares[0].emoji
        const emoji2 = arrayPares[1].emoji
        if (emoji1 !== emoji2) {
          const tablero = document.querySelector('.tablero')
          tablero.children[arrayPares[1].indice].classList.remove('animacion')
          tablero.children[arrayPares[0].indice].classList.remove('animacion')
          setTimeout(() => {
            const updatedArray = newArray.map((celda) => {
              return celda.visible && !celda.fijo ? { ...celda, visible: false } : celda
            }
            )
            setCeldas(updatedArray)
          }, 1)
        } else {
          const updatedArray = newArray.map((celda) =>
            celda.visible && !celda.fijo ? { ...celda, fijo: true, animacion: true } : celda
          )
          setCeldas(updatedArray)
          window.localStorage.setItem('tablero', JSON.stringify(updatedArray))
          const respuesta = comprobarWinner(updatedArray)
          if (respuesta) {
            conffeti()
            window.localStorage.setItem('winner', JSON.stringify(respuesta))
            setWinner(true)
            const tiempoRecord = (formatoTiempo(tiempo))
            window.localStorage.setItem('tiempoRecord', JSON.stringify(tiempoRecord))
            setTiempoConseguido(tiempoRecord)
          }
        }
      }
    }, 600)
  }
  const handleReset = () => {
    const arrayAleatorio = aleatorio(30)
    const nuevaCeldas = Array(30).fill({ emoji: null, visible: false, fijo: false, indice: null, animacion: false })

    let contador = 0
    for (const pareja in Parejas) {
      const emoji = Parejas[pareja]
      nuevaCeldas[arrayAleatorio[contador]] = { emoji, visible: false, fijo: false, indice: null, animacion: false }
      contador++
      nuevaCeldas[arrayAleatorio[contador]] = { emoji, visible: false, fijo: false, indice: null, animacion: false }
      contador++
    }
    const tablero = document.querySelector('.tablero')
    const arry = [...tablero.children]
    arry.forEach((div) => (div.classList.remove('animacion')))
    window.localStorage.removeItem('tablero')
    window.localStorage.removeItem('tiempo')
    window.localStorage.removeItem('winner')
    window.localStorage.removeItem('tiempoRecord')
    setCeldas(nuevaCeldas)
    setWinner(false)
    setTiempo(0)
    setTiempoConseguido(0)
  }

  const formatoTiempo = (segundos) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segundosRestantes = segundos % 60

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`
  }
  return (
    <>
      <h1>Juego  encontrar parejas</h1>
      <div className='crono'>Tiempo: {!winner ? formatoTiempo(tiempo) : tiempoConseguido}</div>

      <div className='tablero'>
        {
            celdas.map((celda, index) => {
              return (
                <Celdas
                  key={index}
                  index={index}
                  actualizarCelda={actualizarCelda}
                  emogi={celda.visible ? celda.emoji : null}
                  isSelected
                  celda={celda.animacion}
                />
              )
            })
        }
      </div>
      <button className='reset' onClick={handleReset}>Empezar de nuevo</button>
    </>
  )
}

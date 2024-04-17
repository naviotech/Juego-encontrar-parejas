export function Celdas ({ index, emogi, actualizarCelda, isSelected, celda }) {
  const handleClick = (e) => {
    actualizarCelda(index)
    e.target.classList.add('animacion')
  }

  return (

    <div className={`celdas ${celda ? 'animacion' : ''}`} onClick={handleClick}>
      <span className={isSelected ? 'is-selected' : 'no-selected'}>
        {emogi}
      </span>
    </div>

  )
}

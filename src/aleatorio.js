export function aleatorio (numero) {
  const array = []
  while (array.length < numero) {
    const numAleatorio = Math.round(Math.random() * (numero))
    if (!array.includes(numAleatorio) && numAleatorio !== 30) {
      array.push(numAleatorio)
    }
  }
  return array
}

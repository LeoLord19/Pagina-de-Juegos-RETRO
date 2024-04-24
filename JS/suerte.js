const min = 1,
    max = 100,
    guessInput = document.getElementById('guessInput'), // Obtiene el elemento de entrada para la suposición del usuario
    guessButton = document.getElementById('guessButton'), // Obtiene el botón para realizar la suposición
    result = document.getElementById('result'), // Obtiene el elemento donde se mostrará el resultado
    attempts = document.getElementById('attempts'); // Obtiene el elemento donde se mostrará el número de intentos

let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // Genera un número aleatorio dentro del rango especificado
let attemptsCount = 0; // Inicializa el contador de intentos

guessButton.addEventListener('click', () => { // Agrega un evento de clic al botón de suposición
    const userGuess = Number(guessInput.value); // Obtiene la suposición del usuario y la convierte en un número
    if (isNaN(userGuess) || userGuess < min || userGuess > max) { // Verifica si la suposición es válida
        result.textContent = 'Por favor, introduce un número válido entre ' + min + ' y ' + max + '.';
    } else { // Si la suposición es válida
        attemptsCount++; // Incrementa el contador de intentos
        if (userGuess < randomNumber) {
            result.textContent = '¡Muy bajo!'; // Muestra un mensaje si la suposición es demasiado baja
        } else if (userGuess > randomNumber) {
            result.textContent = '¡Muy alto!'; // Muestra un mensaje si la suposición es demasiado alta
        } else {
            result.textContent = '¡Olé! Has acertado en ' + attemptsCount + ' intentos, es decir tu mala suerte hoy es de ' + (attemptsCount / 100) + '%'; // Muestra un mensaje de felicitación si la suposición es correcta
            guessInput.disabled = true; // Deshabilita el campo de entrada después de que se haya adivinado correctamente
            guessButton.disabled = true; // Deshabilita el botón después de que se haya adivinado correctamente
        }
    }
    guessInput.value = ''; // Limpia el campo de entrada después de cada suposición
    attempts.textContent = 'Intentos: ' + attemptsCount; // Actualiza el número de intentos mostrado en la interfaz
});

import { checkForName } from './nameChecker'

function handleSubmit(event) {
    event.preventDefault()

    const formText = document.getElementById('name').value
    checkForName(formText)

    console.log("::: Form Submitted :::")

    fetch('http://localhost:8080/test')
      .then(res => res.json())
      .then(res => {
        document.getElementById('results').innerHTML = res.message
      })
      .catch(err => {
        console.error("❌ Error fetching test response:", err)
      });
}

export { handleSubmit }

const awaitms = (ms = 30) => new Promise((res) => {
  setTimeout(res, ms)
})

export default awaitms
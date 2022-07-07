/* Define svg-size. */
const width = window.innerWidth - 16
const height = window.innerHeight - 140

/* Define scaleFactor. */
const scaleFactor = 0.355 * height

/* Some variables. */
let allCountries = []
let randomCountry = ""
let playerScore = 0

/* Create svg-element. */
const svg = d3.select("#svg")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  /* Define projection. */
const projection = d3.geoNaturalEarth1()
  .scale(scaleFactor)
  .translate([width/2, height/2])

/* Define path. */
const path = d3.geoPath(projection)

/* Create g-element. */
const g = svg.append("g")

/* Define handleZoom. */
const handleZoom = (e) => {
  d3.select("g")
    .attr("transform", e.transform)
}

/* Define zoom. */
const zoom = d3.zoom()
  .scaleExtent([1, 5])
  .translateExtent([[-1000, 0], [2000, height]])
  .on("zoom", handleZoom)

  /* Define initZoom. */
const initZoom = () => {
  d3.select("svg")
    .call(zoom)
}

/* Define createMap.  */
const createMap = async () => {
  const data = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")

  const countries = topojson.feature(data, data.objects.countries)
  
  const allCountriesTemp = []

  g.selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("name", (d, i) => {
      allCountriesTemp.push(d.properties.name)
      return d.properties.name
    })
    .attr("d", path)
    .on("click", (event, d) => {
      const clickedCountry = d.properties.name
      checkHit(clickedCountry)
    })

  return allCountriesTemp
}

/* Define checkHit. */
const checkHit = (clickedCountry) => {
  if (clickedCountry == randomCountry) {
    playerScore += 1
    setRandomCountry(allCountries)
    countryToFindElement.innerText = `Find: ${randomCountry}`
    scoreElement.innerText = `Score: ${playerScore}`
    youClickedElement.innerText = "Correct!"
  } else {
    youClickedElement.innerText = `You clicked: ${clickedCountry}`
  }
}

/* Define setRandomCountry. */
const setRandomCountry = (allCountries) => {
  randomCountry = allCountries[Math.floor(Math.random() * allCountries.length)]
  countryToFindElement.innerText = `Find: ${randomCountry}`
}

/* Define game.  */
const game = async () => {
  initZoom()
  allCountries = await createMap()
  setRandomCountry(allCountries)  
}

/* Create  p-element for country to find.*/
const countryToFind = document.getElementById("countrytofind")
const countryToFindElement = document.createElement("p")
countryToFind.appendChild(countryToFindElement)

/* Create p-element for extra info. */
const youClicked = document.getElementById("youclicked")
const youClickedElement = document.createElement("p")
youClicked.appendChild(youClickedElement)

/* Create p-element for score. */
const score = document.getElementById("score")
const scoreElement = document.createElement("p")
score.appendChild(scoreElement)
scoreElement.innerText = `Score: ${playerScore}`

/* Execute game(). */
game()

document.getElementById("fetch-button").addEventListener("click", fetchCountryData);

async function fetchCountryData() {
    const countryName = document.getElementById("country-input").value.trim();
    if (!countryName) {
        alert("Please enter a country name!");
        return;
    }

    const countryInfoSection = document.getElementById("country-info");
    const bordersSection = document.getElementById("bordering-countries");

    countryInfoSection.innerHTML = "";
    bordersSection.innerHTML = "";

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error("Country not found");

        const data = await response.json();
        const country = data[0];

        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population.toLocaleString();
        const region = country.region;
        const flagUrl = country.flags.svg;
        const borders = country.borders || [];

        countryInfoSection.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flagUrl}" alt="Flag of ${country.name.common}">
        `;

        if (borders.length > 0) {
            bordersSection.innerHTML = "<h3>Bordering Countries:</h3>";
            borders.forEach(async (borderCode) => {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderElement = document.createElement("div");
                borderElement.innerHTML = `
                    <p><strong>${borderCountry.name.common}</strong></p>
                    <img src="${borderCountry.flags.svg}" alt="Flag of ${borderCountry.name.common}">
                `;
                bordersSection.appendChild(borderElement);
            });
        } else {
            bordersSection.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        countryInfoSection.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

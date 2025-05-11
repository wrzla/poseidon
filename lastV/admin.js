document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-button")
  const tabContents = document.querySelectorAll(".tab-content")

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      navButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((tab) => tab.classList.remove("active"))

      button.classList.add("active")
      const tabId = `${button.dataset.tab}-tab`
      document.getElementById(tabId).classList.add("active")

      if (button.dataset.tab === "bookings") {
        loadBookings()
      } else if (button.dataset.tab === "rooms") {
        loadRooms()
      }
    })
  })

  const searchBookings = document.getElementById("search-bookings")
  searchBookings.addEventListener("input", () => {
    const searchTerm = searchBookings.value.toLowerCase()
    const rows = document.querySelectorAll("#bookings-table tbody tr:not(.loading-row)")

    rows.forEach((row) => {
      const guestName = row.querySelector("td:nth-child(5)").textContent.toLowerCase()
      const guestPhone = row.querySelector("td:nth-child(6)").textContent.toLowerCase()

      if (guestName.includes(searchTerm) || guestPhone.includes(searchTerm)) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  })

  document.getElementById("refresh-bookings").addEventListener("click", loadBookings)
  document.getElementById("refresh-rooms").addEventListener("click", loadRooms)

  loadBookings()

  function loadBookings() {
    const bookingsTable = document.querySelector("#bookings-table tbody")
    bookingsTable.innerHTML = '<tr class="loading-row"><td colspan="8">Загрузка данных...</td></tr>'

    fetch("/api/bookings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((bookings) => {
        if (bookings.length === 0) {
          bookingsTable.innerHTML = '<tr><td colspan="8">Нет данных о бронированиях</td></tr>'
          return
        }

        bookingsTable.innerHTML = ""
        bookings.forEach((booking) => {
          const row = document.createElement("tr")
          row.innerHTML = `
                        <td>${booking.id}</td>
                        <td>${formatDate(booking.checkInDate)}</td>
                        <td>${formatDate(booking.checkOutDate)}</td>
                        <td>${booking.roomType}</td>
                        <td>${booking.guestName}</td>
                        <td>${booking.guestPhone || "-"}</td>
                        <td>${booking.guestEmail || "-"}</td>
                        <td>${formatDateTime(booking.createdAt)}</td>
                    `
          bookingsTable.appendChild(row)
        })
      })
      .catch((error) => {
        console.error("Error loading bookings:", error)
        bookingsTable.innerHTML = `<tr><td colspan="8">Ошибка загрузки данных: ${error.message}</td></tr>`
      })
  }

  function loadRooms() {
    const roomsTable = document.querySelector("#rooms-table tbody")
    roomsTable.innerHTML = '<tr class="loading-row"><td colspan="5">Загрузка данных...</td></tr>'

    fetch("/api/rooms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((rooms) => {
        if (rooms.length === 0) {
          roomsTable.innerHTML = '<tr><td colspan="5">Нет данных о номерах</td></tr>'
          return
        }

        roomsTable.innerHTML = ""
        rooms.forEach((room) => {
          const row = document.createElement("tr")
          row.innerHTML = `
                        <td>${room.id}</td>
                        <td>${room.roomType}</td>
                        <td>${room.description}</td>
                        <td>${room.price}р</td>
                        <td>${room.imagePath ? `<img src="${room.imagePath}" alt="${room.roomType}" width="100">` : "-"}</td>
                    `
          roomsTable.appendChild(row)
        })
      })
      .catch((error) => {
        console.error("Error loading rooms:", error)
        roomsTable.innerHTML = `<tr><td colspan="5">Ошибка загрузки данных: ${error.message}</td></tr>`
      })
  }

  function formatDate(dateString) {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU")
  }

  function formatDateTime(dateTimeString) {
    if (!dateTimeString) return "-"
    const date = new Date(dateTimeString)
    return `${date.toLocaleDateString("ru-RU")} ${date.toLocaleTimeString("ru-RU")}`
  }
})

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("booking-form")

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0]
  }

  document.getElementById("check-in").value = formatDateForInput(today)
  document.getElementById("check-out").value = formatDateForInput(tomorrow)

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const formData = {
      checkInDate: document.getElementById("check-in").value,
      checkOutDate: document.getElementById("check-out").value,
      roomType: document.getElementById("room-type").value,
      guestName: document.getElementById("guest-name").value,
      guestPhone: document.getElementById("guest-phone").value,
    }

    const checkInDate = new Date(formData.checkInDate)
    const checkOutDate = new Date(formData.checkOutDate)

    if (checkInDate >= checkOutDate) {
      alert("Дата выезда должна быть позже даты заезда")
      return
    }

    localStorage.setItem("bookingData", JSON.stringify(formData))

    window.location.href = "confirm.html"
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const bookingDataString = localStorage.getItem("bookingData")

  if (!bookingDataString) {
    alert("Информация о бронировании не найдена. Пожалуйста, заполните форму бронирования.")
    window.location.href = "index.html"
    return
  }

  const bookingData = JSON.parse(bookingDataString)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU")
  }

  document.getElementById("confirm-check-in").textContent = formatDate(bookingData.checkInDate)
  document.getElementById("confirm-check-out").textContent = formatDate(bookingData.checkOutDate)
  document.getElementById("confirm-room-type").textContent = bookingData.roomType
  document.getElementById("confirm-guest-name").textContent = bookingData.guestName
  document.getElementById("confirm-guest-phone").textContent = bookingData.guestPhone

  const roomPrices = {
    Эконом: 2000,
    Средний: 3000,
    Люкс: 4000,
  }

  const roomPrice = roomPrices[bookingData.roomType] || 0
  document.getElementById("room-price").textContent = roomPrice

  const checkInDate = new Date(bookingData.checkInDate)
  const checkOutDate = new Date(bookingData.checkOutDate)
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
  document.getElementById("nights-count").textContent = nights

  const totalPrice = roomPrice * nights
  document.getElementById("total-price").textContent = totalPrice

  const verificationForm = document.getElementById("verification-form")
  verificationForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const smsCode = document.getElementById("sms-code").value

    if (smsCode.length === 4 && /^\d+$/.test(smsCode)) {
      submitBookingToServer(bookingData, totalPrice)
        .then((response) => {
          if (response.success) {
            alert("Бронирование успешно подтверждено! Ваш номер забронирован.")
            localStorage.removeItem("bookingData")
            window.location.href = "index.html"
          } else {
            alert("Ошибка при бронировании: " + response.error)
          }
        })
        .catch((error) => {
          alert("Ошибка при отправке данных: " + error.message)
        })
    } else {
      alert("Пожалуйста, введите правильный 4-значный код.")
    }
  })

  const resendCodeButton = document.getElementById("resend-code")
  resendCodeButton.addEventListener("click", () => {
    alert("Новый код подтверждения отправлен на номер " + bookingData.guestPhone)
  })

  async function submitBookingToServer(bookingData, totalPrice) {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      return await response.json()
    } catch (error) {
      console.error("Error submitting booking:", error)
      throw error
    }
  }
})

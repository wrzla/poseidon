import Image from "next/image"
import BookingForm from "@/components/booking-form"
import RoomCard from "@/components/room-card"
import Footer from "@/components/footer"

export default function Home() {
  // Данные о номерах (вместо отдельных файлов)
  const rooms = [
    {
      title: "Эконом",
      description: "Уютный номер с основными удобствами для комфортного проживания.",
      imageSrc: "/images/room-economy.jpg",
      price: "3000",
      type: "economy",
    },
    {
      title: "Средний",
      description: "Просторный номер с дополнительными удобствами.",
      imageSrc: "/images/room-standard.jpg",
      price: "5000",
      type: "standard",
    },
    {
      title: "Люкс",
      description: "Премиальный номер с максимальным комфортом.",
      imageSrc: "/images/room-luxury.jpg",
      price: "8000",
      type: "luxury",
    },
  ]

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header Section */}
      <header className="relative h-[500px] w-full">
        <Image
          src="/images/forest-header.jpg"
          alt="Forest background"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 text-center drop-shadow-lg">
            Гостиница "Посейдон"
          </h1>
          <div className="w-full max-w-6xl px-4">
            <BookingForm />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-green-800">О нашей гостинице</h2>
            <p className="text-sm text-muted-foreground mt-1">Уютное место в окружении природы</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-green-800 text-lg mb-4">
                Расположена в живописном уголке возле моря, в окружении природы заповедника Утриш. Номера с удобствами,
                есть ресторан с местной кухней и бассейн. Подходит для спокойного отдыха,
                пляжного отдыха и экотуризма. Рядом – дельфинарий и можжевеловые рощи.
              </p>
              <p className="text-green-800 text-lg">
                Мы предлагаем различные типы номеров, от экономичных вариантов до люксов, чтобы удовлетворить
                потребности каждого гостя. Наша цель - создать для вас незабываемый отдых в гармонии с природой.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/images/hotel-exterior.jpg" alt="Гостиница Посейдон" fill className="object-cover" />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-green-800">Наши номера</h2>
            <p className="text-sm text-muted-foreground mt-1">Выберите идеальный вариант для вашего отдыха</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <RoomCard
                key={index}
                title={room.title}
                description={room.description}
                imageSrc={room.imageSrc}
                price={room.price}
                type={room.type}
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-green-800">Окружающая природа</h2>
            <p className="text-sm text-muted-foreground mt-1">Насладитесь красотой леса</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="relative h-60 rounded-lg overflow-hidden">
                <Image
                  src={`/images/nature-${num}.jpg`}
                  alt={`Природа вокруг гостиницы ${num}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}


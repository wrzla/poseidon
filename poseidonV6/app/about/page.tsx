import Image from "next/image"
import { Heading } from "@/components/ui/heading"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-green-50">
      <div className="relative h-[300px] w-full">
        <Image
          src="/images/forest-header.jpg"
          alt="Forest background"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
            О гостинице "Посейдон"
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-16">
          <Heading title="Наша история" description="Как все начиналось" className="mb-8" />

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-green-800 text-lg mb-4">
                Гостиница "Посейдон" была основана в 2010 году с целью создать уникальное место отдыха, где городские
                жители могли бы насладиться красотой природы, не отказываясь от комфорта.
              </p>
              <p className="text-green-800 text-lg mb-4">
                Название "Посейдон" было выбрано не случайно - оно символизирует гармонию с природными стихиями и
                стремление создать оазис спокойствия и умиротворения вдали от городской суеты.
              </p>
              <p className="text-green-800 text-lg">
                За годы работы мы постоянно совершенствовали наш сервис и инфраструктуру, чтобы предложить гостям
                максимально комфортный и запоминающийся отдых.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/images/hotel-exterior.jpg" alt="Гостиница Посейдон" fill className="object-cover" />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <Heading title="Наша миссия" description="Что мы стремимся предложить нашим гостям" className="mb-8" />

          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-green-800 text-lg mb-4">
              Миссия гостиницы "Посейдон" - создать идеальное место для отдыха, где каждый гость может насладиться
              красотой природы, получить качественный сервис и почувствовать себя как дома.
            </p>
            <p className="text-green-800 text-lg mb-4">Мы стремимся:</p>
            <ul className="list-disc pl-6 space-y-2 text-green-800">
              <li>Обеспечивать высокий уровень комфорта и сервиса</li>
              <li>Создавать атмосферу уюта и гостеприимства</li>
              <li>Предлагать разнообразные варианты размещения для разных потребностей и бюджетов</li>
              <li>Минимизировать воздействие на окружающую среду</li>
              <li>Постоянно совершенствовать наши услуги на основе отзывов гостей</li>
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <Heading title="Наша команда" description="Люди, которые делают ваш отдых незабываемым" className="mb-8" />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Александр Петров",
                position: "Генеральный директор",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Елена Смирнова",
                position: "Управляющий гостиницей",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Дмитрий Иванов",
                position: "Шеф-повар",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((person, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative h-64 w-full">
                  <Image src={person.image || "/placeholder.svg"} alt={person.name} fill className="object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-green-800">{person.name}</h3>
                  <p className="text-gray-600">{person.position}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

